import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, isOwner, writeAdminAuditLog } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin || !isOwner(admin)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, status: true, lastLoginAt: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin || !isOwner(admin)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = (await request.json()) as { email?: unknown; name?: unknown; password?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 12 || password.length > 256) {
      return NextResponse.json({ error: "Use a valid email and a password of at least 12 characters" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: { email, name: name || null, passwordHash: await hash(password, 12), role: "EDITOR" },
      select: { id: true, email: true, name: true, role: true, status: true, lastLoginAt: true, createdAt: true },
    });
    await writeAdminAuditLog(admin, request, "ADMIN_CREATED", "User", user.id, undefined, { email: user.email, role: user.role });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "That email is already an administrator" }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to create administrator" }, { status: 500 });
  }
}
