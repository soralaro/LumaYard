import { prisma } from "@/lib/prisma";

export type PublicSiteSettings = {
  email: string;
  whatsappNumber: string;
  linkedinUrl: string;
  serviceArea: string;
  hours: string;
};

export const defaultSiteSettings: PublicSiteSettings = {
  email: "hello@lumayard.com",
  whatsappNumber: "15551234567",
  linkedinUrl: "",
  serviceArea: "Serving homeowners and outdoor projects across the United States.",
  hours: "Mon-Fri, 9am-5pm",
};

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "public-contact" } });
  if (!setting || typeof setting.value !== "object" || !setting.value) return defaultSiteSettings;
  return { ...defaultSiteSettings, ...(setting.value as Partial<PublicSiteSettings>) };
}
