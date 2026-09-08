import { NextRequest, NextResponse } from "next/server";
import { getObject, storageConfigured } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ key: string[] }> }
) {
  const { key: segments } = await context.params;
  const key = segments.join("/");
  if (!storageConfigured() || !key || segments.some((segment) => !segment || segment === "." || segment === "..")) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const object = await getObject(key);
    if (!object.Body) return new NextResponse(null, { status: 404 });
    const body = object.Body.transformToWebStream();
    return new NextResponse(body, {
      headers: {
        "Content-Type": object.ContentType || "application/octet-stream",
        "Cache-Control": object.CacheControl || "public, max-age=31536000, immutable",
        ...(object.ContentLength ? { "Content-Length": object.ContentLength.toString() } : {}),
      },
    });
  } catch (error) {
    const status = typeof error === "object" && error && "$metadata" in error && (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404 ? 404 : 502;
    return new NextResponse(null, { status });
  }
}
