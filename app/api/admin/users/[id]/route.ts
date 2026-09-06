import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, isOwner, writeAdminAuditLog } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type UserAction =
  | { action: "disable" }
  | { action: "enable" }
  | { action: "reset-password"; password: string }
  | { action: "revoke-sessions" };

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin || !isOwner(admin)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Administrator not found" }, { status: 404 });

  try {
    const body = (await request.json()) as Partial<UserAction>;
    if (body.action === "disable") {
      if (target.role === "OWNER") return NextResponse.json({ error: "Owner accounts cannot be disabled here" }, { status: 400 });
      await prisma.$transaction([
        prisma.user.update({ where: { id }, data: { status: "DISABLED" } }),
        prisma.session.deleteMany({ where: { userId: id } }),
      ]);
      await writeAdminAuditLog(admin, request, "ADMIN_DISABLED", "User", id, { status: target.status }, { status: "DISABLED" });
      return NextResponse.json({ success: true, status: "DISABLED" });
    }

    if (body.action === "enable") {
      await prisma.user.update({ where: { id }, data: { status: "ACTIVE" } });
      await writeAdminAuditLog(admin, request, "ADMIN_ENABLED", "User", id, { status: target.status }, { status: "ACTIVE" });
      return NextResponse.json({ success: true, status: "ACTIVE" });
    }

    if (body.action === "reset-password") {
      if (typeof body.password !== "string" || body.password.length < 12 || body.password.length > 256) {
        return NextResponse.json({ error: "Password must be 12 to 256 characters" }, { status: 400 });
      }
      await prisma.$transaction([
        prisma.user.update({ where: { id }, data: { passwordHash: await hash(body.password, 12) } }),
        prisma.session.deleteMany({ where: { userId: id } }),
      ]);
      await writeAdminAuditLog(admin, request, "ADMIN_PASSWORD_RESET", "User", id);
      return NextResponse.json({ success: true });
    }

    if (body.action === "revoke-sessions") {
      const result = await prisma.session.deleteMany({ where: { userId: id } });
      await writeAdminAuditLog(admin, request, "ADMIN_SESSIONS_REVOKED", "User", id, undefined, { count: result.count });
      return NextResponse.json({ success: true, count: result.count });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Unable to update administrator" }, { status: 500 });
  }
}
