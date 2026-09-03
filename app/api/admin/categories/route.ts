import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "database.json");

function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { products: [], categories: [] };
  }
}

function writeDB(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// PUT /api/admin/categories - 更新分类
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const db = readDB();

    const index = db.categories?.findIndex((c: any) => c.id === body.id);
    if (index === -1 || index === undefined) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    db.categories[index] = {
      ...db.categories[index],
      ...body,
    };

    writeDB(db);

    return NextResponse.json({ success: true, category: db.categories[index] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}
