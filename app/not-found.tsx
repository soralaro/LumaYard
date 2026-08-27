import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f2eb] px-6 text-center text-[#19382f]">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">404</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl">That path has gone dark.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#536058]">The page you are looking for is no longer here.</p>
        <Link href="/" className="mt-8 inline-flex min-h-12 items-center bg-[#19382f] px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white hover:bg-[#102c25]">Return home</Link>
      </div>
    </main>
  );
}
