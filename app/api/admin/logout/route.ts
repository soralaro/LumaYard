import { NextResponse } from "next/server";
import { clearAdminCookie, revokeDatabaseSession } from "@/lib/admin-auth";
export async function POST() { await revokeDatabaseSession(); const response = NextResponse.json({ ok: true }); clearAdminCookie(response); return response; }
