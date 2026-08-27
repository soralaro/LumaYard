import { NextResponse } from "next/server";
import { isAdminConfigured, setAdminCookie, validPassword } from "@/lib/admin-auth";
export async function POST(request: Request) { const { password } = await request.json().catch(() => ({ password: "" })); if (!isAdminConfigured()) return NextResponse.json({ error: "Admin is not configured." }, { status: 503 }); if (typeof password !== "string" || !validPassword(password)) return NextResponse.json({ error: "Incorrect password." }, { status: 401 }); const response = NextResponse.json({ ok: true }); setAdminCookie(response); return response; }
