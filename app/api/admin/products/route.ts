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

// GET /api/admin/products - 获取所有产品
export async function GET() {
  const db = readDB();
  return NextResponse.json({ products: db.products || [] });
}

// POST /api/admin/products - 创建新产品
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = readDB();

    const newProduct = {
      id: `prod_${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.products = db.products || [];
    db.products.push(newProduct);
    writeDB(db);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
