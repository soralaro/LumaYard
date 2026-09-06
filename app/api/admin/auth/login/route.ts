import { NextRequest, NextResponse } from "next/server";
import { createDatabaseSession, getClientIp, setDatabaseSessionCookie } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown };
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password || email.length > 320 || password.length > 256) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }

    const session = await createDatabaseSession(email, password, {
      ipAddress: getClientIp(request),
      userAgent: request.headers.get("user-agent"),
    });
    if (!session) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const response = NextResponse.json({ user: session.user });
    // Local HTTP previews cannot store Secure cookies; production HTTPS keeps them protected.
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    setDatabaseSessionCookie(response, session.value, forwardedProtocol ? forwardedProtocol === "https" : request.nextUrl.protocol === "https:");
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to sign in" }, { status: 400 });
  }
}
