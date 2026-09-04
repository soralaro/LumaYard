import { NextRequest, NextResponse } from "next/server";
import {
  ProductRecord,
  readDatabase,
  writeDatabase,
} from "@/lib/database";

type NewProduct = Omit<ProductRecord, "id" | "createdAt" | "updatedAt">;

// GET /api/admin/products - 获取所有产品和分类
export async function GET() {
  const database = readDatabase();
  return NextResponse.json({
    products: database.products,
    categories: database.categories,
  });
}

// POST /api/admin/products - 创建新产品
export async function POST(request: NextRequest) {
  try {
    const product = (await request.json()) as NewProduct;
    const database = readDatabase();
    const timestamp = new Date().toISOString();
    const newProduct: ProductRecord = {
      id: `prod_${Date.now()}`,
      ...product,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    database.products.push(newProduct);
    writeDatabase(database);

    return NextResponse.json({ success: true, product: newProduct });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
