import { NextResponse } from "next/server";
import { getPublicSiteSettings } from "@/lib/site-settings";

export async function GET() {
  return NextResponse.json(await getPublicSiteSettings(), { headers: { "Cache-Control": "no-store" } });
}
