"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function DeleteContentButton({ id, title }: { id: string; title: string }) {
  const router = useRouter(); const [busy, setBusy] = useState(false);
  async function remove() {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusy(true); const response = await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
    if (!response.ok) { const data = await response.json().catch(() => ({})); window.alert(data.error || "Unable to delete content"); setBusy(false); return; }
    router.refresh();
  }
  return <button type="button" onClick={remove} disabled={busy} className="ml-4 text-red-700 hover:underline disabled:opacity-50">{busy ? "Deleting..." : "Delete"}</button>;
}
