"use client";

type DocumentLinksProps = { contentId: string; assetId: string; url: string; name: string; size: number };

export function DocumentLinks({ contentId, assetId, url, name, size }: DocumentLinksProps) {
  function track(eventType: "pdf_open" | "pdf_download") {
    void fetch("/api/content/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId, assetId, eventType, path: window.location.pathname }),
    });
  }

  return <section className="border-y border-[#19382f]/15 bg-[#eeebe4] px-5 py-6 sm:px-8 lg:px-10"><div className="mx-auto max-w-[1440px]"><div className="mb-5 flex flex-col gap-4 border-b border-[#19382f]/15 pb-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#927141]">Product document</p><h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl leading-tight sm:text-3xl">{name}</h2><p className="mt-1 text-xs text-[#536058]">{Math.max(1, Math.round(size / 1024))} KB · PDF catalogue</p></div><div className="flex gap-5 text-[10px] font-bold uppercase tracking-[0.16em]"><a href={url} target="_blank" rel="noreferrer" onClick={() => track("pdf_open")} className="border-b border-[#19382f] pb-2 hover:text-[#927141] hover:border-[#927141]">Open document</a><a href={url} download onClick={() => track("pdf_download")} className="bg-[#19382f] px-5 py-3 text-white hover:bg-[#102c25]">Download</a></div></div><iframe src={url} title={`${name} preview`} className="h-[520px] w-full border border-[#19382f]/20 bg-white sm:h-[680px] lg:h-[760px]" /></div></section>;
}
