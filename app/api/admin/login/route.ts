import { NextResponse } from "next/server";
import { createDatabaseSession, isAdminConfigured, setAdminCookie, setDatabaseSessionCookie, usesDatabaseAuth, validPassword } from "@/lib/admin-auth";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({ password: "" }));
  const password = body.password;
  if (typeof password !== "string") return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  if (usesDatabaseAuth()) {
    if (typeof body.email !== "string") return NextResponse.json({ error: "Email is required." }, { status: 400 });
    try {
      const session = await createDatabaseSession(body.email, password);
      if (!session) return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
      const response = NextResponse.json({ ok: true }); setDatabaseSessionCookie(response, session); return response;
    } catch { return NextResponse.json({ error: "Admin database is not available." }, { status: 503 }); }
  }
  if (!isAdminConfigured()) return NextResponse.json({ error: "Admin is not configured." }, { status: 503 });
  if (!validPassword(password)) return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  const response = NextResponse.json({ ok: true }); setAdminCookie(response); return response;
}
