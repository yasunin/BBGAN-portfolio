import { NextResponse } from "next/server";
import {
  createEntry,
  getAllEntries,
} from "@/lib/performance-db";
import {
  isAdminAuthorized,
  unauthorizedResponse,
} from "@/lib/performance-auth";
import type {
  CreatePerformancePayload,
  PerformanceImage,
} from "@/lib/performance-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TITLE_LENGTH = 180;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_IMAGES_PER_ENTRY = 12;
const UPLOAD_URL_PATTERN = /^\/uploads\/performance\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp|gif)$/;

function invalidResponse(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

function parsePayload(payload: unknown):
  | { value: CreatePerformancePayload }
  | { error: string } {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { error: "รูปแบบข้อมูลไม่ถูกต้อง" };
  }

  const input = payload as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const description =
    typeof input.description === "string" ? input.description.trim() : "";

  if (!title) return { error: "กรุณาระบุหัวข้อเรื่อง" };
  if (title.length > MAX_TITLE_LENGTH) {
    return { error: `หัวข้อเรื่องยาวได้ไม่เกิน ${MAX_TITLE_LENGTH} ตัวอักษร` };
  }
  if (!description) return { error: "กรุณาระบุรายละเอียด" };
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return { error: `รายละเอียดมีความยาวเกิน ${MAX_DESCRIPTION_LENGTH} ตัวอักษร` };
  }

  if (!Array.isArray(input.images) || input.images.length === 0) {
    return { error: "กรุณาเพิ่มรูปภาพอย่างน้อย 1 รูป" };
  }
  if (input.images.length > MAX_IMAGES_PER_ENTRY) {
    return { error: `เพิ่มรูปภาพได้ไม่เกิน ${MAX_IMAGES_PER_ENTRY} รูปต่อรายการ` };
  }

  const images: PerformanceImage[] = [];
  for (const image of input.images) {
    if (!image || typeof image !== "object" || Array.isArray(image)) {
      return { error: "ข้อมูลรูปภาพไม่ถูกต้อง" };
    }

    const item = image as Record<string, unknown>;
    if (
      typeof item.id !== "string" ||
      typeof item.url !== "string" ||
      typeof item.name !== "string" ||
      typeof item.size !== "number" ||
      !Number.isFinite(item.size) ||
      !UPLOAD_URL_PATTERN.test(item.url)
    ) {
      return { error: "ข้อมูลรูปภาพไม่ถูกต้อง" };
    }

    images.push({
      id: item.id,
      url: item.url,
      name: item.name.slice(0, 255),
      size: item.size,
    });
  }

  const tags = Array.isArray(input.tags)
    ? input.tags
        .filter((tag): tag is string => typeof tag === "string")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 12)
    : [];

  return { value: { title, description, tags, images } };
}

export async function GET() {
  try {
    const entries = await getAllEntries();
    return NextResponse.json(
      { entries },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { error: "ไม่สามารถโหลดข้อมูลผลงานได้" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return invalidResponse("รูปแบบข้อมูลไม่ถูกต้อง");
  }

  const parsed = parsePayload(payload);
  if ("error" in parsed) return invalidResponse(parsed.error);

  try {
    const entry = await createEntry(parsed.value);
    return NextResponse.json({ entry }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "ไม่สามารถบันทึกข้อมูลผลงานได้" },
      { status: 500 }
    );
  }
}
