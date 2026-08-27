import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import {
  type PerformanceEntry,
  type CreatePerformancePayload,
} from "@/lib/performance-types";

const DATA_DIR = path.join(process.cwd(), "data", "performance");
const ENTRIES_FILE = path.join(DATA_DIR, "entries.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "performance");
let mutationQueue = Promise.resolve();

async function ensureDirs(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

async function readEntriesFile(): Promise<PerformanceEntry[]> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(ENTRIES_FILE, "utf-8");
    const parsed = JSON.parse(raw) as PerformanceEntry[];
    if (!Array.isArray(parsed)) {
      throw new Error("Performance entries data must be an array");
    }
    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await writeEntriesFile([]);
      return [];
    }
    throw error;
  }
}

async function writeEntriesFile(entries: PerformanceEntry[]): Promise<void> {
  await ensureDirs();
  const temporaryFile = `${ENTRIES_FILE}.${randomUUID()}.tmp`;

  try {
    await fs.writeFile(temporaryFile, JSON.stringify(entries, null, 2), "utf-8");
    await fs.rename(temporaryFile, ENTRIES_FILE);
  } catch (error) {
    await fs.unlink(temporaryFile).catch(() => undefined);
    throw error;
  }
}

async function withMutationLock<T>(
  operation: () => Promise<T>
): Promise<T> {
  const previousMutation = mutationQueue;
  let releaseLock: () => void;
  mutationQueue = new Promise<void>((resolve) => {
    releaseLock = resolve;
  });

  await previousMutation;
  try {
    return await operation();
  } finally {
    releaseLock!();
  }
}

export async function getAllEntries(): Promise<PerformanceEntry[]> {
  const entries = await readEntriesFile();
  return entries.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getEntryById(id: string): Promise<PerformanceEntry | null> {
  const entries = await readEntriesFile();
  return entries.find((entry) => entry.id === id) ?? null;
}

export async function createEntry(
  payload: CreatePerformancePayload
): Promise<PerformanceEntry> {
  return withMutationLock(async () => {
    const entries = await readEntriesFile();
    const entry: PerformanceEntry = {
      id: randomUUID(),
      title: payload.title.trim(),
      description: payload.description.trim(),
      tags: payload.tags,
      images: payload.images,
      createdAt: new Date().toISOString(),
    };
    entries.unshift(entry);
    await writeEntriesFile(entries);
    return entry;
  });
}

export async function updateEntry(
  id: string,
  payload: CreatePerformancePayload
): Promise<PerformanceEntry | null> {
  return withMutationLock(async () => {
    const entries = await readEntriesFile();
    const index = entries.findIndex((entry) => entry.id === id);
    if (index === -1) return null;

    const previous = entries[index];
    const removedImages = previous.images.filter(
      (img) => !payload.images.some((next) => next.url === img.url)
    );

    const updated: PerformanceEntry = {
      ...previous,
      title: payload.title.trim(),
      description: payload.description.trim(),
      tags: payload.tags,
      images: payload.images,
      updatedAt: new Date().toISOString(),
    };
    entries[index] = updated;
    await writeEntriesFile(entries);
    await deleteImageFiles(removedImages.map((img) => img.url));
    return updated;
  });
}

export async function deleteEntry(id: string): Promise<boolean> {
  return withMutationLock(async () => {
    const entries = await readEntriesFile();
    const index = entries.findIndex((entry) => entry.id === id);
    if (index === -1) return false;

    const [removed] = entries.splice(index, 1);
    await writeEntriesFile(entries);
    await deleteImageFiles(removed.images.map((img) => img.url));
    return true;
  });
}

export function getUploadDir(): string {
  return UPLOAD_DIR;
}

async function deleteImageFiles(urls: string[]): Promise<void> {
  await Promise.all(
    urls.map(async (url) => {
      if (!url.startsWith("/uploads/performance/")) return;
      const filename = path.basename(url);
      const filePath = path.join(UPLOAD_DIR, filename);
      try {
        await fs.unlink(filePath);
      } catch {
        // file may already be removed
      }
    })
  );
}
