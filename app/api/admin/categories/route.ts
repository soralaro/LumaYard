import { NextRequest, NextResponse } from "next/server";
import { CategoryRecord } from "@/lib/database";
import { getCurrentAdmin, writeAdminAuditLog } from "@/lib/admin-auth";
import { listCategories, updateCategory } from "@/lib/category-store";

type CategoryUpdate = Partial<CategoryRecord> & Pick<CategoryRecord, "id">;

// PUT /api/admin/categories - 更新分类
export async function PUT(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const categoryUpdate = (await request.json()) as CategoryUpdate;
    const previous = (await listCategories()).find((category) => category.id === categoryUpdate.id);
    if (!previous) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    const category = await updateCategory({ ...previous, ...categoryUpdate });
    await writeAdminAuditLog(admin, request, "CATEGORY_UPDATED", "Category", categoryUpdate.id, previous, category);

    return NextResponse.json({
      success: true,
      category,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}
