import { NextResponse } from "next/server";
import { listPublishedContent } from "@/lib/content-store";
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET() { const items = await listPublishedContent({ featured: true }); return NextResponse.json({ items: items.map((item: any) => ({ id: item.id, slug: item.slug, title: item.title, excerpt: item.excerpt, type: item.type, image: item.assets.find((a: any) => a.kind === "IMAGE")?.publicUrl || null, document: item.assets.find((a: any) => a.kind === "DOCUMENT")?.publicUrl || null })) }); }
