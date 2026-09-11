"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type TrackedView = { id: string; startedAt: number | null; accumulatedMs: number };

function reportDuration(view: TrackedView | null, pause = false) {
  if (!view) return;
  const now = Date.now();
  const durationMs = Math.min(view.accumulatedMs + (view.startedAt ? now - view.startedAt : 0), 24 * 60 * 60 * 1000);
  if (pause) {
    view.accumulatedMs = durationMs;
    view.startedAt = null;
  }
  if (durationMs < 1_000) return;
  navigator.sendBeacon(
    "/api/analytics/page-view",
    new Blob([JSON.stringify({ pageViewId: view.id, durationMs })], { type: "application/json" }),
  );
}

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeView = useRef<TrackedView | null>(null);
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    let cancelled = false;
    reportDuration(activeView.current);
    activeView.current = null;

    const queryString = searchParams.toString();
    void fetch("/api/analytics/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        queryString,
        pageTitle: document.title,
        referrer: previousPath.current ? `${window.location.origin}${previousPath.current}` : document.referrer,
        utmSource: searchParams.get("utm_source"),
        utmMedium: searchParams.get("utm_medium"),
        utmCampaign: searchParams.get("utm_campaign"),
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      }),
      keepalive: true,
    })
      .then(async (response) => {
        if (!response.ok || cancelled) return;
        const data = (await response.json()) as { pageViewId?: string };
        if (data.pageViewId) activeView.current = { id: data.pageViewId, startedAt: Date.now(), accumulatedMs: 0 };
      })
      .catch(() => undefined);
    previousPath.current = queryString ? `${pathname}?${queryString}` : pathname;

    return () => {
      cancelled = true;
      reportDuration(activeView.current);
      activeView.current = null;
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        reportDuration(activeView.current, true);
      } else if (activeView.current && activeView.current.startedAt === null) {
        activeView.current.startedAt = Date.now();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return null;
}
