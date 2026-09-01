import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
export async function GET() { if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); try { return NextResponse.json(await prisma.mediaAsset.findMany({ where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" }, take: 100 })); } catch { return NextResponse.json({ error: "Database is not available." }, { status: 503 }); } }
