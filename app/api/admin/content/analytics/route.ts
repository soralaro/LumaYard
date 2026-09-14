// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
export async function GET() { const admin = await getCurrentAdmin(); if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const rows = await prisma.contentEvent.groupBy({ by: ["contentId", "eventType"], _count: { _all: true }, orderBy: { _count: { eventType: "desc" } } }); const ids = rows.map((r) => r.contentId); const items = await prisma.contentItem.findMany({ where: { id: { in: ids } }, select: { id: true, title: true, slug: true } }); const names = new Map(items.map((item) => [item.id, item])); return NextResponse.json({ analytics: rows.map((row) => ({ content: names.get(row.contentId) || { id: row.contentId }, eventType: row.eventType, count: row._count._all })) }); }
