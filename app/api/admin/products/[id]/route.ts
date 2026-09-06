import { NextRequest, NextResponse } from "next/server";
import { ProductRecord } from "@/lib/database";
import { getCurrentAdmin, writeAdminAuditLog } from "@/lib/admin-auth";
import { deleteProduct, findProduct, updateProduct } from "@/lib/product-store";

type ProductUpdate = Partial<
  Omit<ProductRecord, "id" | "createdAt" | "updatedAt">
>;

// GET /api/admin/products/[id] - 获取单个产品
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const product = await findProduct(id);

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
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const productUpdate = (await request.json()) as ProductUpdate;
    const previous = await findProduct(id);
    if (!previous) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const product = await updateProduct(id, { ...previous, ...productUpdate });
    if (!product) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    await writeAdminAuditLog(admin, request, "PRODUCT_UPDATED", "Product", id, previous, product);

    return NextResponse.json({
      success: true,
      product,
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
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const deletedProduct = await deleteProduct(id);
    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    await writeAdminAuditLog(admin, _request, "PRODUCT_DELETED", "Product", id, deletedProduct);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
