import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

const allowed = new Map([
  ["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"], ["image/avif", "avif"], ["application/pdf", "pdf"],
]);
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File is required." }, { status: 400 });
  const extension = allowed.get(file.type);
  const max = file.type.startsWith("image/") ? 15 * 1024 * 1024 : 25 * 1024 * 1024;
  if (!extension || file.size < 1 || file.size > max) return NextResponse.json({ error: "Unsupported type or oversized file." }, { status: 400 });
  const name = `${randomUUID()}.${extension}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ publicUrl: `/uploads/${name}`, originalName: file.name, mimeType: file.type, byteSize: file.size, kind: file.type.startsWith("image/") ? "IMAGE" : "DOCUMENT" });
}
