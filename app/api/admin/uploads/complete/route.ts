import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const input = z.object({ key: z.string().min(1).max(500), publicUrl: z.string().url(), originalName: z.string().trim().min(1).max(180), mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"]), byteSize: z.number().int().positive().max(25 * 1024 * 1024), width: z.number().int().positive().optional(), height: z.number().int().positive().optional(), altText: z.string().trim().max(250).optional() });
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid media metadata." }, { status: 400 });
  const item = parsed.data;
  try {
    const media = await prisma.mediaAsset.create({ data: { kind: item.mimeType.startsWith("image/") ? "IMAGE" : "DOCUMENT", storageKey: item.key, publicUrl: item.publicUrl, originalName: item.originalName, mimeType: item.mimeType, byteSize: item.byteSize, width: item.width, height: item.height, altText: item.altText } });
    return NextResponse.json(media, { status: 201 });
  } catch { return NextResponse.json({ error: "Could not save media metadata." }, { status: 503 }); }
}
