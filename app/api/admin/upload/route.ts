import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getCurrentAdmin, writeAdminAuditLog } from "@/lib/admin-auth";

const UPLOAD_TYPES = new Set(["products", "categories", "category-cover"]);
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

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

    // 获取文件类型
    const fileType = (formData.get("type") as string) || "products";
    if (!UPLOAD_TYPES.has(fileType) || !file.type.startsWith("image/") || file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json({ success: false, error: "Unsupported image upload" }, { status: 400 });
    }

    // 创建上传目录
    const uploadDir = path.join(process.cwd(), "public", fileType);
    await mkdir(uploadDir, { recursive: true });

    // 生成文件名
    const timestamp = Date.now();
    const originalName = file.name;
    const ext = path.extname(originalName);
    const fileName = `${timestamp}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // 保存文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // 返回可访问的 URL
    const url = `/${fileType}/${fileName}`;
    await writeAdminAuditLog(admin, request, "MEDIA_UPLOADED", "MediaAsset", fileName, undefined, {
      fileName: originalName,
      mimeType: file.type,
      byteSize: file.size,
      url,
    });

    return NextResponse.json({
      success: true,
      url,
      fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
