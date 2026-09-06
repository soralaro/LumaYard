import { createHash, randomBytes } from "node:crypto";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const COOKIE = "lumayard_admin";
const SESSION_MAX_AGE_SECONDS = 86_400;

export type CurrentAdmin = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
};

function sessionHash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function getClientIp(request: Request) {
  // Nginx must overwrite these headers; never trust client-provided forwarding headers directly.
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || null;
}

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value || !process.env.DATABASE_URL) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { tokenHash: sessionHash(value) },
      include: { user: true },
    });

    if (!session || session.expiresAt <= new Date() || session.user.status !== "ACTIVE") {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    };
  } catch {
    return null;
  }
}

export async function isAdmin() {
  return Boolean(await getCurrentAdmin());
}

export function isOwner(admin: CurrentAdmin) {
  return admin.role === "OWNER";
}

export async function createDatabaseSession(
  email: string,
  password: string,
  metadata: { ipAddress: string | null; userAgent: string | null }
): Promise<{ value: string; user: CurrentAdmin } | null> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || user.status !== "ACTIVE" || !(await compare(password, user.passwordHash))) {
    return null;
  }

  const value = randomBytes(32).toString("hex");
  const now = new Date();
  await prisma.$transaction([
    prisma.session.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: sessionHash(value),
        expiresAt: new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000),
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    }),
    prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: now } }),
    prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "ADMIN_LOGIN",
        entityType: "Session",
        ipAddress: metadata.ipAddress,
        after: { userAgent: metadata.userAgent },
      },
    }),
  ]);

  return {
    value,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}

export function setDatabaseSessionCookie(response: Response, value: string, secure = process.env.NODE_ENV === "production") {
  response.headers.append(
    "Set-Cookie",
    `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}; ${secure ? "Secure;" : ""}`
  );
}

export async function revokeCurrentDatabaseSession() {
  const value = (await cookies()).get(COOKIE)?.value;
  if (value) {
    await prisma.session.deleteMany({ where: { tokenHash: sessionHash(value) } });
  }
}

export function clearAdminCookie(response: Response) {
  response.headers.append("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`);
}

export async function writeAdminAuditLog(
  admin: CurrentAdmin,
  request: Request,
  action: string,
  entityType: string,
  entityId?: string,
  before?: object,
  after?: object
) {
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action,
      entityType,
      entityId,
      before,
      after,
      ipAddress: getClientIp(request),
    },
  });
}
