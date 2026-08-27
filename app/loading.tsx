export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f2eb] text-[#19382f]">
      <div className="text-center" role="status" aria-live="polite">
        <p className="font-[family-name:var(--font-display)] text-4xl">Luma<span className="italic">Yard</span></p>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">Preparing your outdoor space</p>
      </div>
    </main>
  );
}
