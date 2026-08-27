import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
const COOKIE = "lumayard_admin";
function secret() { return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "change-me"; }
function token() { return createHmac("sha256", secret()).update("admin-session").digest("hex"); }
export function isAdminConfigured() { return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET); }
export function validPassword(value: string) { const expected = process.env.ADMIN_PASSWORD ?? ""; return Boolean(expected && value.length === expected.length && timingSafeEqual(Buffer.from(value), Buffer.from(expected))); }
export async function isAdmin() { const value = (await cookies()).get(COOKIE)?.value; return Boolean(value && value === token()); }
export function setAdminCookie(response: Response) { response.headers.append("Set-Cookie", `${COOKIE}=${token()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`); }
export function clearAdminCookie(response: Response) { response.headers.append("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`); }
