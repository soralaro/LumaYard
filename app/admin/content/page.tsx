import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");
  const items = await prisma.contentItem.findMany({ orderBy: { updatedAt: "desc" }, select: { id: true, title: true, slug: true, type: true, status: true, featured: true, updatedAt: true } }) as Array<{ id: string; title: string; slug: string; type: string; status: string; featured: boolean; updatedAt: Date }>;
  return <main className="min-h-screen bg-gray-50"><header className="border-b bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"><div><p className="text-xs font-bold uppercase tracking-wider text-gray-500">Admin</p><h1 className="text-2xl font-bold text-gray-900">Content library</h1></div><Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">Back to dashboard</Link></div></header><section className="mx-auto max-w-7xl px-6 py-8"><div className="mb-6 flex items-center justify-between"><p className="text-sm text-gray-600">Manage guides, inspiration, case studies and downloads.</p><span className="rounded bg-gray-900 px-3 py-2 text-xs font-semibold text-white">{items.length} items</span></div><div className="overflow-hidden rounded-lg border bg-white"><table className="w-full text-left text-sm"><thead className="border-b bg-gray-50 text-xs uppercase tracking-wider text-gray-500"><tr><th className="px-5 py-3">Title</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Updated</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="px-5 py-4"><Link href={`/ideas/${item.slug}`} className="font-semibold text-gray-900 hover:underline">{item.title}</Link>{item.featured && <span className="ml-2 text-xs text-amber-700">Featured</span>}</td><td className="px-5 py-4 text-gray-600">{item.type.toLowerCase().replace("_", " ")}</td><td className="px-5 py-4 text-gray-600">{item.status.toLowerCase()}</td><td className="px-5 py-4 text-gray-500">{item.updatedAt.toLocaleDateString("en-GB")}</td></tr>)}</tbody></table>{items.length === 0 && <p className="px-5 py-12 text-center text-gray-500">No content yet. Upload the first guide or PDF from the content workflow.</p>}</div></section></main>;
}
