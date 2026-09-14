import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, writeAdminAuditLog } from "@/lib/admin-auth";
import { uploadObject, uploadPolicy } from "@/lib/storage";

const UPLOAD_TYPES = new Set(["products", "categories", "category-cover", "content"]);

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const fileType = (formData.get("type") as string) || "products";
    const policy = uploadPolicy(file.type, file.size);
    const imageOnly = fileType !== "products" && fileType !== "content";
    if (!UPLOAD_TYPES.has(fileType) || !policy.permitted || (imageOnly && !file.type.startsWith("image/"))) {
      return NextResponse.json(
        { success: false, error: "Unsupported upload or object storage is not configured" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const upload = await uploadObject({
      body: new Uint8Array(bytes),
      originalName: file.name,
      mimeType: file.type,
    });
    await writeAdminAuditLog(admin, request, "MEDIA_UPLOADED", "MediaAsset", upload.key, undefined, {
      fileName: file.name,
      mimeType: file.type,
      byteSize: file.size,
      url: upload.publicUrl,
    });

    return NextResponse.json({
      success: true,
      url: upload.publicUrl,
      fileName: upload.key,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
