import { NextRequest, NextResponse } from "next/server";
import {
  ProductRecord,
  readDatabase,
  writeDatabase,
} from "@/lib/database";

type ProductUpdate = Partial<
  Omit<ProductRecord, "id" | "createdAt" | "updatedAt">
>;

// GET /api/admin/products/[id] - 获取单个产品
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const database = readDatabase();
  const product = database.products.find((item) => item.id === id);

  if (!product) {
    return NextResponse.json(
      { success: false, error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, product });
}

// PUT /api/admin/products/[id] - 更新产品
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productUpdate = (await request.json()) as ProductUpdate;
    const database = readDatabase();
    const index = database.products.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    database.products[index] = {
      ...database.products[index],
      ...productUpdate,
      updatedAt: new Date().toISOString(),
    };
    writeDatabase(database);

    return NextResponse.json({
      success: true,
      product: database.products[index],
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - 删除产品
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const database = readDatabase();
    const index = database.products.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    database.products.splice(index, 1);
    writeDatabase(database);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
