"use client";

import { useEffect, useState } from "react";

type SocialSettings = { linkedinUrl: string; facebookUrl: string; xUrl: string; instagramUrl: string; youtubeUrl: string };
const defaults: SocialSettings = { linkedinUrl: "", facebookUrl: "", xUrl: "", instagramUrl: "", youtubeUrl: "" };
const platforms = [
  { key: "linkedinUrl", label: "LinkedIn", kind: "linkedin", color: "#70a9d8" },
  { key: "facebookUrl", label: "Facebook", kind: "facebook", color: "#7da9e1" },
  { key: "xUrl", label: "X", kind: "x", color: "#d9ddd9" },
  { key: "instagramUrl", label: "Instagram", kind: "instagram", color: "#d88a9d" },
  { key: "youtubeUrl", label: "YouTube", kind: "youtube", color: "#e18484" },
] as const;

function BrandIcon({ kind }: { kind: string }) {
  const props = { className: "h-[18px] w-[18px]", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (kind === "linkedin") return <svg {...props}><path d="M5 8v11M5 5.5v.01M9 19V8m0 4c.8-2.8 5-3.2 5 1v6m0-6c0-2.7 5-3.2 5 1v5" /><path d="M3 3h18v18H3z" /></svg>;
  if (kind === "facebook") return <svg {...props}><path d="M14 21v-8h2.8l.4-3H14V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a18 18 0 0 0-2.5-.2c-2.5 0-4.2 1.5-4.2 4.3V10H8v3h2.6v8" /></svg>;
  if (kind === "instagram") return <svg {...props}><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4.5" /><circle cx="12" cy="12" r="4.1" /><circle cx="17.5" cy="6.7" r=".7" fill="currentColor" stroke="none" /></svg>;
  if (kind === "youtube") return <svg {...props}><path d="m10 8 6 4-6 4V8Z" fill="currentColor" stroke="none" /><path d="M21 12c0 3.8-.4 5.5-1.1 6.2-.7.7-2.4 1.1-7.9 1.1s-7.2-.4-7.9-1.1C3.4 17.5 3 15.8 3 12s.4-5.5 1.1-6.2C4.8 5.1 6.5 4.7 12 4.7s7.2.4 7.9 1.1C20.6 6.5 21 8.2 21 12Z" /></svg>;
  return <svg {...props}><path d="M5 4 19 20M19 4 5 20" /></svg>;
}

export function SocialLinks({ compact = false, colored = false }: { compact?: boolean; colored?: boolean }) {
  const [settings, setSettings] = useState<SocialSettings>(defaults);
  useEffect(() => { void fetch("/api/site-settings").then(async (response) => { if (response.ok) setSettings({ ...defaults, ...(await response.json()) }); }).catch(() => undefined); }, []);
  return <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`} aria-label="Social links">
    {platforms.map((platform) => {
      const href = settings[platform.key];
      const className = `grid ${compact ? "h-9 w-9" : "h-10 w-10"} place-items-center border transition ${href ? "hover:-translate-y-0.5" : "cursor-default"}`;
      const style = colored ? { color: href ? platform.color : "rgba(255,255,255,.35)", borderColor: href ? `${platform.color}99` : "rgba(255,255,255,.2)", backgroundColor: href ? `${platform.color}18` : "transparent" } : undefined;
      return href ? <a key={platform.key} href={href} target="_blank" rel="noreferrer" className={className} style={style} aria-label={platform.label} title={platform.label}><BrandIcon kind={platform.kind} /></a> : <span key={platform.key} className={className} style={style} aria-label={`${platform.label} link not configured`} title="Add link in admin settings"><BrandIcon kind={platform.kind} /></span>;
    })}
  </div>;
}
