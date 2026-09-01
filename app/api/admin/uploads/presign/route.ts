import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin-auth";
import { createUploadUrl, uploadPolicy } from "@/lib/storage";

const input = z.object({ originalName: z.string().trim().min(1).max(180), mimeType: z.string().trim(), byteSize: z.number().int().positive() });
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
  const policy = uploadPolicy(parsed.data.mimeType, parsed.data.byteSize);
  if (!policy.permitted) return NextResponse.json({ error: "Unsupported type, oversized file, or object storage is not configured." }, { status: 400 });
  try { return NextResponse.json({ ...(await createUploadUrl(parsed.data.originalName, parsed.data.mimeType)), kind: policy.kind }); }
  catch { return NextResponse.json({ error: "Could not prepare upload." }, { status: 503 }); }
}
