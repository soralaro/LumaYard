import { NextResponse } from "next/server";
import { getCurrentAdmin, isOwner } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin || !isOwner(admin)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [events, sessions] = await Promise.all([
    prisma.auditLog.findMany({
      take: 200,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.session.findMany({
      take: 200,
      orderBy: { createdAt: "desc" },
      select: { id: true, ipAddress: true, userAgent: true, createdAt: true, expiresAt: true, user: { select: { email: true, name: true } } },
    }),
  ]);
  return NextResponse.json({ events, sessions });
}
