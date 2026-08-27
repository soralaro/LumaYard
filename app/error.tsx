"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f2eb] px-6 text-center text-[#19382f]">
      <div>
        <p className="font-[family-name:var(--font-display)] text-5xl">A quiet pause.</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#536058]">Something went wrong while loading this page. Please try again.</p>
        <button type="button" onClick={() => reset()} className="mt-8 inline-flex min-h-12 items-center bg-[#19382f] px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white hover:bg-[#102c25]">Try again</button>
      </div>
    </main>
  );
}
