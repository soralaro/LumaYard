"use client";

type DocumentLinksProps = { contentId: string; assetId: string; url: string };

export function DocumentLinks({ contentId, assetId, url }: DocumentLinksProps) {
  function track(eventType: "pdf_open" | "pdf_download") {
    void fetch("/api/content/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId, assetId, eventType, path: window.location.pathname }),
    });
  }

  return <div className="w-full"><iframe src={url} title="PDF preview" className="mb-4 h-[520px] w-full border" /><span className="flex gap-4"><a href={url} target="_blank" rel="noreferrer" onClick={() => track("pdf_open")}>Open</a><a href={url} download onClick={() => track("pdf_download")}>Download</a></span></div>;
}
