import { NextRequest, NextResponse } from "next/server";
import { ProductRecord } from "@/lib/database";
import { getCurrentAdmin, writeAdminAuditLog } from "@/lib/admin-auth";
import { createProduct, listAdminProducts } from "@/lib/product-store";
import { listCategories } from "@/lib/category-store";

type NewProduct = Omit<ProductRecord, "id" | "createdAt" | "updatedAt">;

// GET /api/admin/products - 获取所有产品和分类
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [products, categories] = await Promise.all([listAdminProducts(), listCategories()]);
  return NextResponse.json({
    products,
    categories,
  });
}

// POST /api/admin/products - 创建新产品
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const product = (await request.json()) as NewProduct;
    const newProduct = await createProduct(product);
    await writeAdminAuditLog(admin, request, "PRODUCT_CREATED", "Product", newProduct.id, undefined, newProduct);

    return NextResponse.json({ success: true, product: newProduct });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
