import { NextRequest, NextResponse } from "next/server";
import { CategoryRecord, readDatabase, writeDatabase } from "@/lib/database";

type CategoryUpdate = Partial<CategoryRecord> & Pick<CategoryRecord, "id">;

// PUT /api/admin/categories - 更新分类
export async function PUT(request: NextRequest) {
  try {
    const categoryUpdate = (await request.json()) as CategoryUpdate;
    const database = readDatabase();
    const index = database.categories.findIndex(
      (category) => category.id === categoryUpdate.id
    );

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    database.categories[index] = {
      ...database.categories[index],
      ...categoryUpdate,
    };
    writeDatabase(database);

    return NextResponse.json({
      success: true,
      category: database.categories[index],
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}
