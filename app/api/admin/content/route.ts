import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, writeAdminAuditLog } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await prisma.contentItem.findMany({ include: { assets: true }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { title?: string; slug?: string; type?: string; category?: string; excerpt?: string; body?: string; featured?: boolean; status?: string };
  if (!body.title?.trim() || !body.slug?.trim() || !body.type) return NextResponse.json({ error: "title, slug and type are required" }, { status: 400 });
  try {
    const item = await prisma.contentItem.create({ data: { title: body.title.trim(), slug: body.slug.trim(), type: body.type as never, category: body.category || null, excerpt: body.excerpt || null, body: body.body || null, featured: body.featured ?? false, status: (body.status || "DRAFT") as never, publishedAt: body.status === "PUBLISHED" ? new Date() : null } });
    await writeAdminAuditLog(admin, request, "CONTENT_CREATED", "ContentItem", item.id, undefined, { title: item.title, slug: item.slug });
    return NextResponse.json({ item }, { status: 201 });
  } catch { return NextResponse.json({ error: "Unable to create content" }, { status: 400 }); }
}
