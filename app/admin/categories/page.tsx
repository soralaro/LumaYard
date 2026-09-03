"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  slug: string;
  coverImage?: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      alert("加载分类失败");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData(cat);
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setEditingId(null);
        loadCategories();
        alert("分类已更新");
      }
    } catch (error) {
      alert("保存失败");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("type", "category-cover");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataUpload,
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, coverImage: data.url });
      }
    } catch (error) {
      alert("图片上传失败");
    }
  };

  if (loading) return <div className="p-6">加载中...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">分类管理</h1>
          <Link href="/admin" className="text-blue-600 hover:underline">
            返回后台
          </Link>
        </div>

        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.id} className="rounded-lg bg-white p-6 shadow">
              {editingId === cat.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      分类名称（中文）
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      分类名称（英文）
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, nameEn: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      分类描述
                    </label>
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      分类封面图片
                    </label>
                    {formData.coverImage && (
                      <div className="mb-4 max-w-xs">
                        <img
                          src={formData.coverImage}
                          alt={formData.name}
                          className="h-32 w-full rounded object-cover"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-1 block w-full"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      推荐尺寸：1200×800px
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {cat.name} ({cat.nameEn})
                      </h3>
                      <p className="text-sm text-gray-600">{cat.description}</p>
                    </div>
                  </div>
                  {cat.coverImage && (
                    <div className="mb-4 max-w-xs">
                      <img
                        src={cat.coverImage}
                        alt={cat.name}
                        className="h-32 w-full rounded object-cover"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-600 hover:underline"
                  >
                    编辑
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
