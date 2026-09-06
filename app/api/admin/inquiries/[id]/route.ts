import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, writeAdminAuditLog } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const STATUSES = new Set(["NEW", "IN_PROGRESS", "CLOSED", "SPAM"]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const current = await prisma.inquiry.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });

  try {
    const body = (await request.json()) as { status?: unknown; internalNotes?: unknown };
    const status = typeof body.status === "string" && STATUSES.has(body.status) ? body.status as "NEW" | "IN_PROGRESS" | "CLOSED" | "SPAM" : current.status;
    const internalNotes = typeof body.internalNotes === "string" ? body.internalNotes.slice(0, 8_000) : current.internalNotes;
    const inquiry = await prisma.inquiry.update({ where: { id }, data: { status, internalNotes } });
    await writeAdminAuditLog(admin, request, "INQUIRY_UPDATED", "Inquiry", id, { status: current.status, internalNotes: current.internalNotes }, { status, internalNotes });
    return NextResponse.json({ inquiry });
  } catch {
    return NextResponse.json({ error: "Unable to update inquiry" }, { status: 400 });
  }
}
