import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  isAdminAuthorized,
  unauthorizedResponse,
} from "@/lib/performance-auth";
import {
  MAX_FILE_SIZE,
  VALID_IMAGE_TYPES,
  type PerformanceImage,
} from "@/lib/performance-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const extensionForType: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "ไม่สามารถอ่านไฟล์ที่อัปโหลดได้" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "กรุณาเลือกรูปภาพ" }, { status: 400 });
  }

  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "รองรับเฉพาะไฟล์ JPG, PNG, WEBP และ GIF" },
      { status: 400 }
    );
  }
  if (file.size === 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "ขนาดรูปภาพต้องไม่เกิน 10 MB" },
      { status: 400 }
    );
  }

  const id = randomUUID();
  const filename = `${id}${extensionForType[file.type]}`;
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "performance"
  );

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
  } catch {
    return NextResponse.json(
      { error: "ไม่สามารถบันทึกรูปภาพได้" },
      { status: 500 }
    );
  }

  const image: PerformanceImage = {
    id,
    url: `/uploads/performance/${filename}`,
    name: path.basename(file.name).slice(0, 255) || filename,
    size: file.size,
  };

  return NextResponse.json({ image }, { status: 201 });
}
