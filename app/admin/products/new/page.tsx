"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const categories = [
  { id: "fences", name: "栅栏与围栏", nameEn: "Fences & Privacy" },
  { id: "lighting", name: "庭院灯具", nameEn: "Garden Lighting" },
  { id: "robotics", name: "庭院剪草工具", nameEn: "Garden Robotics & Tools" },
  { id: "energy", name: "户储能源", nameEn: "Home & Garden Energy" },
];

export default function NewProduct() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    price: "",
    category: "fences",
    status: "draft" as "draft" | "published" | "archived",
    description: "",
    descriptionEn: "",
    features: "",
    images: "",
    specs: "",
    pdfUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title: formData.title,
        titleEn: formData.titleEn,
        price: parseFloat(formData.price),
        category: formData.category,
        status: formData.status,
        description: formData.description,
        descriptionEn: formData.descriptionEn,
        features: formData.features.split("\n").filter(f => f.trim()),
        images: formData.images.split("\n").filter(i => i.trim()),
        specs: formData.specs ? JSON.parse(formData.specs) : {},
        pdfUrl: formData.pdfUrl || null,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        alert("保存失败");
      }
    } catch (error) {
      alert("保存失败：" + error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">新增产品</h1>
          <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
            ← 返回列表
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-8 shadow">
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              产品名称（中文）*
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="例如：铝合金隐私栅栏 6ft"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              产品名称（英文）*
            </label>
            <input
              type="text"
              required
              value={formData.titleEn}
              onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="e.g. Premium Privacy Fence Panel 6ft"
            />
          </div>

          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                价格（美元）*
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="299.99"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                产品分类*
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} - {cat.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              发布状态
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
              <option value="archived">已归档</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              产品描述（中文）
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="产品的详细描述..."
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              产品描述（英文）
            </label>
            <textarea
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Product description in English..."
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              产品特点（每行一个）
            </label>
            <textarea
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              rows={5}
              className="w-full rounded-md border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Weather-resistant aluminum construction&#10;10-year warranty included&#10;Easy DIY installation"
            />
            <p className="mt-1 text-xs text-gray-500">每行一个特点</p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              产品图片 URL（每行一个）*
            </label>
            <textarea
              required
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              rows={5}
              className="w-full rounded-md border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
              placeholder="/products/fence-001.jpg&#10;/products/fence-001-detail.jpg&#10;https://example.com/image.jpg"
            />
            <p className="mt-1 text-xs text-gray-500">
              每行一个图片 URL，可以是本地路径（/products/...）或完整 URL
            </p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              技术规格（JSON 格式）
            </label>
            <textarea
              value={formData.specs}
              onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
              rows={8}
              className="w-full rounded-md border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
              placeholder={`{
  "dimensions": "72\\" H × 96\\" W",
  "material": "Powder-coated aluminum",
  "weight": "45 lbs",
  "warranty": "10 years",
  "installation": "DIY-friendly"
}`}
            />
            <p className="mt-1 text-xs text-gray-500">
              JSON 格式的键值对，例如尺寸、材质、重量等
            </p>
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              PDF 规格书 URL（可选）
            </label>
            <input
              type="text"
              value={formData.pdfUrl}
              onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="/docs/fence-001-specs.pdf"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存产品"}
            </button>
            <Link
              href="/admin"
              className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
            >
              取消
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
