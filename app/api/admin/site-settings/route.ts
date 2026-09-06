import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, isOwner, writeAdminAuditLog } from "@/lib/admin-auth";
import { defaultSiteSettings, getPublicSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin || !isOwner(admin)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await getPublicSiteSettings());
}

export async function PATCH(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin || !isOwner(admin)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json() as Partial<typeof defaultSiteSettings>;
  const current = await getPublicSiteSettings();
  const next = {
    email: typeof body.email === "string" ? body.email.trim().slice(0, 254) : current.email,
    whatsappNumber: typeof body.whatsappNumber === "string" ? body.whatsappNumber.replace(/[^\d+]/g, "").slice(0, 20) : current.whatsappNumber,
    linkedinUrl: typeof body.linkedinUrl === "string" ? body.linkedinUrl.trim().slice(0, 500) : current.linkedinUrl,
    serviceArea: typeof body.serviceArea === "string" ? body.serviceArea.trim().slice(0, 240) : current.serviceArea,
    hours: typeof body.hours === "string" ? body.hours.trim().slice(0, 120) : current.hours,
  };
  if (next.email && !/^\S+@\S+\.\S+$/.test(next.email)) return NextResponse.json({ error: "Use a valid email address" }, { status: 400 });
  if (next.linkedinUrl && !/^https:\/\//i.test(next.linkedinUrl)) return NextResponse.json({ error: "LinkedIn URL must start with https://" }, { status: 400 });
  const saved = await prisma.siteSetting.upsert({ where: { key: "public-contact" }, update: { value: next, updatedById: admin.id }, create: { key: "public-contact", value: next, updatedById: admin.id } });
  await writeAdminAuditLog(admin, request, "SITE_SETTINGS_UPDATED", "SiteSetting", saved.key, current, next);
  return NextResponse.json(next);
}
