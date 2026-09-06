import { NextRequest, NextResponse } from "next/server";
import { clearAdminCookie, getCurrentAdmin, revokeCurrentDatabaseSession, writeAdminAuditLog } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (admin) await writeAdminAuditLog(admin, request, "ADMIN_LOGOUT", "Session");
  await revokeCurrentDatabaseSession().catch(() => undefined);
  const response = NextResponse.json({ success: true });
  clearAdminCookie(response);
  return response;
}
