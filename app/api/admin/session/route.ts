import { NextResponse } from "next/server";
import { isAdmin, isAdminConfigured, usesDatabaseAuth } from "@/lib/admin-auth";
export async function GET() { return NextResponse.json({ authenticated: await isAdmin(), configured: usesDatabaseAuth() || isAdminConfigured(), databaseAuth: usesDatabaseAuth() }); }
