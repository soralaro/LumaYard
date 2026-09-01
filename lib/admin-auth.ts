import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
const COOKIE = "lumayard_admin";
function secret() { return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "change-me"; }
function token() { return createHmac("sha256", secret()).update("admin-session").digest("hex"); }
export function isAdminConfigured() { return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET); }
export function usesDatabaseAuth() { return Boolean(process.env.DATABASE_URL); }
export function validPassword(value: string) { const expected = process.env.ADMIN_PASSWORD ?? ""; return Boolean(expected && value.length === expected.length && timingSafeEqual(Buffer.from(value), Buffer.from(expected))); }
function sessionHash(value: string) { return createHash("sha256").update(value).digest("hex"); }
export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  if (!usesDatabaseAuth()) return value === token();
  try {
    const session = await prisma.session.findUnique({ where: { tokenHash: sessionHash(value) }, include: { user: true } });
    return Boolean(session && session.expiresAt > new Date() && session.user.status === "ACTIVE");
  } catch { return false; }
}
export async function createDatabaseSession(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || user.status !== "ACTIVE" || !(await compare(password, user.passwordHash))) return null;
  const value = randomBytes(32).toString("hex");
  await prisma.$transaction([
    prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } }),
    prisma.session.create({ data: { userId: user.id, tokenHash: sessionHash(value), expiresAt: new Date(Date.now() + 86_400_000) } }),
    prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
  ]);
  return value;
}
export function setAdminCookie(response: Response) { response.headers.append("Set-Cookie", `${COOKIE}=${token()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`); }
export function setDatabaseSessionCookie(response: Response, value: string) { response.headers.append("Set-Cookie", `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`); }
export async function revokeDatabaseSession() {
  if (!usesDatabaseAuth()) return;
  const value = (await cookies()).get(COOKIE)?.value;
  if (value) await prisma.session.deleteMany({ where: { tokenHash: sessionHash(value) } }).catch(() => undefined);
}
export function clearAdminCookie(response: Response) { response.headers.append("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`); }
