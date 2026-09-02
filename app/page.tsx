"use client";

import Image from "next/image";
import { useState } from "react";

type IconName =
  | "arrow"
  | "menu"
  | "close"
  | "spark"
  | "sun"
  | "drop"
  | "bolt"
  | "leaf"
  | "pin"
  | "plus"
  | "check"
  | "zap"
  | "shield";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const shared = {
    className: `h-5 w-5 ${className}`,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (name === "arrow") return <svg {...shared}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>;
  if (name === "menu") return <svg {...shared}><path d="M3 6h18M3 12h18M3 18h18" /></svg>;
  if (name === "close") return <svg {...shared}><path d="M6 6l12 12M18 6 6 18" /></svg>;
  if (name === "spark") return <svg {...shared}><path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></svg>;
  if (name === "sun") return <svg {...shared}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>;
  if (name === "drop") return <svg {...shared}><path d="M12 2.5S5.5 9.1 5.5 14A6.5 6.5 0 0 0 18.5 14c0-4.9-6.5-11.5-6.5-11.5Z" /><path d="M9.2 15.2c.3 1.2 1.2 2.1 2.5 2.4" /></svg>;
  if (name === "bolt") return <svg {...shared}><path d="m13 2-8 12h6l-1 8 8-12h-6l1-8Z" /></svg>;
  if (name === "leaf") return <svg {...shared}><path d="M20.5 3.5C12 3.5 5 7.2 5 14c0 3.7 2.7 6.5 6.2 6.5 6.8 0 9.3-8.7 9.3-17Z" /><path d="M3.5 20.5c3-5 6.5-7.6 11.5-10" /></svg>;
  if (name === "pin") return <svg {...shared}><path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
  if (name === "check") return <svg {...shared}><path d="M20 6 9 17l-5-5" /></svg>;
  if (name === "zap") return <svg {...shared}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" /></svg>;
  if (name === "shield") return <svg {...shared}><path d="M12 2 3 7v5c0 6 4 10 9 11 5-1 9-5 9-11V7l-9-5Z" /></svg>;
  return <svg {...shared}><path d="M12 5v14M5 12h14" /></svg>;
}

const spaces = [
  { title: "Backyard", eyebrow: "Privacy & gathering", color: "bg-[#9e8c70]", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85" },
  { title: "Garden", eyebrow: "Beauty & boundaries", color: "bg-[#749068]", image: "https://images.unsplash.com/photo-1558521958-0a228e77e984?auto=format&fit=crop&w=1000&q=85" },
  { title: "Patio", eyebrow: "Intimate & lit", color: "bg-[#ad7959]", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85" },
  { title: "Deck", eyebrow: "Elevated living", color: "bg-[#63705a]", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85" },
];

const solutions = [
  {
    title: "Complete Backyard Privacy",
    description: "Transform an open yard into a secluded retreat with fencing, accent lighting, and automated care.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=88",
    items: ["8 × Privacy Fence Panels", "12 × Solar Fence Lights", "Smart Robotic Mower"],
    price: 3299,
  },
  {
    title: "Garden Glow & Structure",
    description: "Define garden beds with decorative fencing and pathway lights that guide every step.",
    image: "https://images.unsplash.com/photo-1558521958-0a228e77e984?auto=format&fit=crop&w=1400&q=88",
    items: ["6 × Garden Fence Sections", "12 × Pathway Lights", "4 × Portable Lamps"],
    price: 1199,
  },
  {
    title: "Energy-Independent Outdoor",
    description: "Power your entire outdoor space with solar + storage, from lighting to tools.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=88",
    items: ["Solar + Storage System", "16 × Solar Lights", "Smart Mower"],
    price: 10999,
  },
];

const productLines = [
  {
    category: "Fences & Privacy",
    tagline: "Define your sanctuary",
    description: "Weather-resistant panels and decorative borders that bring privacy, structure, and lasting beauty.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
    collection: "fences",
  },
  {
    category: "Garden Lighting",
    tagline: "Warm, solar-powered glow",
    description: "Fence accents, pathway markers, and portable lamps designed for effortless outdoor evenings.",
    image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=85",
    collection: "lighting",
  },
  {
    category: "Garden Robotics",
    tagline: "Hands-free maintenance",
    description: "Autonomous mowing and smart garden tools that keep your outdoor space perfect while you relax.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=85",
    collection: "robotics",
  },
  {
    category: "Home Energy",
    tagline: "Solar + storage for every need",
    description: "Complete solar panel and battery systems that power your outdoor living and reduce your bills.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=85",
    collection: "energy",
  },
];

const ideas = [
  { category: "The Luma journal", title: "How to choose the right fence for privacy and style", image: "https://images.unsplash.com/photo-1591290619762-d6d4afe9e5d5?auto=format&fit=crop&w=1000&q=85" },
  { category: "Outdoor notes", title: "Five ways solar lighting transforms your garden at night", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=85" },
  { category: "Garden guide", title: "Why robotic mowers are worth it: a realistic look", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=85" },
];

function ArrowLink({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <a href="#shop" className={`group inline-flex items-center gap-3 border-b pb-2 text-xs font-bold uppercase tracking-[0.18em] transition-colors ${light ? "border-white/35 text-white hover:border-white" : "border-[#1e3b33]/35 text-[#1e3b33] hover:border-[#1e3b33]"}`}>{children}<Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState("Backyard");

  return (
    <main className="overflow-hidden">
      <div className="bg-[#1e3b33] px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f8f3e9] sm:text-xs">
        Free consultation on complete outdoor solutions <span className="mx-2 text-[#c89957]">·</span> Fences, lighting, robotics & energy
      </div>

      <header className="absolute inset-x-0 top-[39px] z-30 text-white">
        <div className="mx-auto flex h-22 max-w-[1440px] items-center justify-between px-5 md:px-10 lg:px-14">
          <a href="#" className="font-[family-name:var(--font-display)] text-2xl tracking-[0.04em] sm:text-3xl">Luma<span className="italic">Yard</span></a>
          <nav className="hidden items-center gap-8 text-[11px] font-bold uppercase tracking-[0.18em] lg:flex">
            <a href="#solutions" className="transition-opacity hover:opacity-65">Solutions</a>
            <a href="#products" className="transition-opacity hover:opacity-65">Products</a>
            <a href="#spaces" className="transition-opacity hover:opacity-65">Spaces</a>
            <a href="#ideas" className="transition-opacity hover:opacity-65">Ideas</a>
            <a href="#planner" className="flex items-center gap-1.5 text-[#edce9b] transition-opacity hover:opacity-65"><Icon name="spark" className="h-3.5 w-3.5" />Custom plan</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="#contact" className="hidden text-[11px] font-bold uppercase tracking-[0.16em] sm:block">Contact us</a>
            <button aria-label="Open menu" onClick={() => setMenuOpen(true)} className="grid h-10 w-10 place-items-center rounded-full border border-white/40 transition-colors hover:bg-white/15 lg:hidden"><Icon name="menu" /></button>
          </div>
        </div>
      </header>

      {menuOpen && <div className="fixed inset-0 z-50 bg-[#17362e] px-6 py-6 text-white lg:hidden">
        <div className="flex items-center justify-between"><span className="font-[family-name:var(--font-display)] text-3xl">Luma<span className="italic">Yard</span></span><button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-white/35"><Icon name="close" /></button></div>
        <nav className="mt-18 flex flex-col gap-7 text-3xl font-[family-name:var(--font-display)]"><a onClick={() => setMenuOpen(false)} href="#solutions">Solutions</a><a onClick={() => setMenuOpen(false)} href="#products">Products</a><a onClick={() => setMenuOpen(false)} href="#spaces">Spaces</a><a onClick={() => setMenuOpen(false)} href="#ideas">Ideas</a><a onClick={() => setMenuOpen(false)} href="#planner" className="text-[#edce9b]">Custom plan</a></nav>
      </div>}

      <section className="relative flex min-h-[740px] items-end bg-[#283f32] md:min-h-[820px]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2200&q=90')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102c25]/88 via-[#102c25]/42 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#102c25]/68 to-transparent" />
        <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-18 pt-48 text-white md:px-10 md:pb-24 lg:px-14">
          <p className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#edce9b]"><span className="h-px w-8 bg-[#edce9b]" />Complete outdoor solutions</p>
          <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-[-0.045em] sm:text-6xl md:text-8xl">Transform your<br /><em className="font-normal">outdoor space.</em></h1>
          <p className="mt-7 max-w-md text-base leading-7 text-white/80 md:text-lg">Privacy fencing, solar lighting, smart garden tools, and home energy—designed to work beautifully together.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><a href="#solutions" className="inline-flex min-h-13 items-center justify-center bg-[#e8c58d] px-7 text-xs font-bold uppercase tracking-[0.18em] text-[#18372f] transition-transform hover:-translate-y-0.5">Explore solutions</a><a href="#planner" className="inline-flex min-h-13 items-center justify-center border border-white/55 px-7 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-[#18372f]">Get custom plan</a></div>
        </div>
      </section>

      <section className="bg-[#f5f2eb] px-5 py-22 sm:px-8 md:py-30 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-16 text-center"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">How we work</p><h2 className="mx-auto mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl tracking-[-0.035em] text-[#19382f] sm:text-5xl">We listen, design, and deliver.</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#536058]">From a single fence panel to a complete backyard transformation, every project starts with understanding how you live outside.</p></div>
          <div className="grid gap-8 md:grid-cols-3"><div className="border-t-2 border-[#c89957] pt-6"><div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#e8c58d]"><span className="font-[family-name:var(--font-display)] text-2xl text-[#19382f]">01</span></div><h3 className="font-[family-name:var(--font-display)] text-2xl text-[#19382f]">Listen</h3><p className="mt-3 text-sm leading-6 text-[#536058]">Tell us about your space, your goals, and what matters most. We ask the right questions to understand your vision.</p></div><div className="border-t-2 border-[#c89957] pt-6"><div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#e8c58d]"><span className="font-[family-name:var(--font-display)] text-2xl text-[#19382f]">02</span></div><h3 className="font-[family-name:var(--font-display)] text-2xl text-[#19382f]">Design</h3><p className="mt-3 text-sm leading-6 text-[#536058]">We recommend the right combination of fencing, lighting, tools, and energy solutions tailored to your needs and budget.</p></div><div className="border-t-2 border-[#c89957] pt-6"><div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#e8c58d]"><span className="font-[family-name:var(--font-display)] text-2xl text-[#19382f]">03</span></div><h3 className="font-[family-name:var(--font-display)] text-2xl text-[#19382f]">Deliver</h3><p className="mt-3 text-sm leading-6 text-[#536058]">From product delivery to full installation support, we help you bring your outdoor vision to life with confidence.</p></div></div>
        </div>
      </section>

      <section id="solutions" className="bg-[#eae4d9] px-5 py-22 sm:px-8 md:py-30 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 text-center"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">Featured solutions</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.035em] text-[#19382f] sm:text-5xl">Complete outdoor packages.</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#536058]">Pre-designed combinations of fencing, lighting, and tools—or start a conversation to build something custom.</p></div>
          <div className="grid gap-8 md:grid-cols-3">
            {solutions.map((solution) => <article key={solution.title} className="group bg-[#f5f2eb]"><div className="overflow-hidden"><Image src={solution.image} alt="" className="aspect-[1.15] w-full object-cover transition duration-700 group-hover:scale-105" /></div><div className="p-6"><h3 className="font-[family-name:var(--font-display)] text-2xl text-[#19382f]">{solution.title}</h3><p className="mt-2 text-sm leading-6 text-[#536058]">{solution.description}</p><ul className="mt-5 space-y-2">{solution.items.map((item) => <li key={item} className="flex items-center gap-2 text-xs text-[#19382f]"><Icon name="check" className="h-4 w-4 text-[#6b7e57]" />{item}</li>)}</ul><div className="mt-6 flex items-center justify-between border-t border-[#19382f]/15 pt-5"><span className="text-2xl font-bold text-[#927141]">${solution.price.toLocaleString()}</span><a href="#contact" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#19382f] transition hover:gap-3">Get quote <Icon name="arrow" className="h-4 w-4" /></a></div></div></article>)}
          </div>
        </div>
      </section>

      <section id="spaces" className="bg-[#f5f2eb] px-5 py-22 sm:px-8 md:py-30 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-11 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">Shop by space</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.035em] text-[#19382f] sm:text-5xl">Start with where you gather.</h2></div><p className="max-w-sm text-sm leading-6 text-[#536058]">Every outdoor space has a different rhythm. Find solutions designed for how you use yours.</p></div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {spaces.map((space) => <a href="#shop" key={space.title} className="group relative aspect-[0.78] overflow-hidden bg-[#74806d]"><Image src={space.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#122c25]/80 via-transparent to-transparent" /><div className="absolute inset-x-4 bottom-4 text-white md:inset-x-5 md:bottom-5"><p className="mb-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white/70">{space.eyebrow}</p><div className="flex items-end justify-between"><h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">{space.title}</h3><Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div></div></a>)}
          </div>
        </div>
      </section>

      <section id="products" className="bg-[#dfd7c8] px-5 py-22 sm:px-8 md:py-30 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-11 text-center"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">Our product lines</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.035em] text-[#19382f] sm:text-5xl">Everything for outdoor living.</h2></div>
          <div className="grid gap-6 md:grid-cols-2">
            {productLines.map((line) => <article key={line.category} className="group overflow-hidden bg-[#f5f2eb]"><div className="overflow-hidden"><Image src={line.image} alt="" className="aspect-[1.5] w-full object-cover transition duration-700 group-hover:scale-105" /></div><div className="p-7"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#927141]">{line.tagline}</p><h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[#19382f]">{line.category}</h3><p className="mt-3 text-sm leading-6 text-[#536058]">{line.description}</p><a href="/shop" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#19382f] transition hover:gap-3">Explore {line.category.toLowerCase()} <Icon name="arrow" className="h-4 w-4" /></a></div></article>)}
          </div>
        </div>
      </section>

      <section className="grid bg-[#183a31] text-white lg:grid-cols-2">
        <div className="relative min-h-[430px] overflow-hidden"><Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1300&q=85" alt="A complete backyard with privacy fencing and warm lighting" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-[#15352d]/25" /></div>
        <div className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-18 lg:py-28"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e8c58d]">Shop the look</p><h2 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-[-0.04em] sm:text-5xl">See how it all comes together.</h2><p className="mt-6 max-w-md text-sm leading-7 text-white/70">From privacy panels to solar accents and smart mowing, explore real outdoor setups and get the complete product list.</p><div className="mt-8 flex flex-col gap-3">{["Privacy Fence Panels", "Solar Fence Lights", "Robotic Mower"].map((item, i) => <div key={item} className="flex items-center gap-3 text-sm"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e8c58d] text-[10px] font-bold text-[#19382f]">0{i + 1}</span><span>{item}</span></div>)}</div><div className="mt-9"><ArrowLink light>See all looks</ArrowLink></div></div>
      </section>

      <section id="planner" className="bg-[#c99759] px-5 py-22 sm:px-8 md:py-30 lg:px-14">
        <div className="mx-auto max-w-[1440px] text-center"><Icon name="spark" className="mx-auto h-8 w-8 text-[#294238]" /><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#294238]">The outdoor planner</p><h2 className="mx-auto mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-[1.03] tracking-[-0.04em] text-[#17362e] sm:text-6xl">Get a custom plan in 3 minutes.</h2><p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#294238]/85 md:text-base">Answer a few quick questions about your space, priorities, and budget. We'll recommend the right combination of fencing, lighting, tools, and energy solutions—or connect you with our team for a personalized quote.</p><a href="/contact" className="mx-auto mt-10 inline-flex min-h-14 items-center bg-[#19382f] px-8 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#102c25]">Start your outdoor plan <Icon name="arrow" className="ml-3 h-4 w-4" /></a></div>
      </section>

      <section className="bg-[#2b4739] px-5 py-18 text-[#f5f2eb] sm:px-8 md:py-22 lg:px-14">
        <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-4">{[{ icon: "shield" as IconName, title: "Built to last", text: "Weather-resistant materials and 10-year warranties." }, { icon: "sun" as IconName, title: "Solar first", text: "Harness the sun for lighting and home energy." }, { icon: "zap" as IconName, title: "Smart automation", text: "Robotic mowing and app-controlled convenience." }, { icon: "leaf" as IconName, title: "Eco-conscious", text: "Less waste, more efficiency, better for the planet." }].map((value) => <div key={value.title} className="border-t border-white/20 pt-5"><Icon name={value.icon} className="h-6 w-6 text-[#e8c58d]" /><h3 className="mt-6 font-[family-name:var(--font-display)] text-2xl">{value.title}</h3><p className="mt-2 max-w-45 text-sm leading-6 text-white/65">{value.text}</p></div>)}</div>
      </section>

      <section id="ideas" className="bg-[#f5f2eb] px-5 py-22 sm:px-8 md:py-30 lg:px-14"><div className="mx-auto max-w-[1440px]"><div className="mb-11 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">Outdoor ideas & guides</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.035em] text-[#19382f] sm:text-5xl">A little inspiration.</h2></div><ArrowLink>Read the journal</ArrowLink></div><div className="grid gap-7 md:grid-cols-3">{ideas.map((idea) => <article key={idea.title} className="group"><a href="#contact" className="block overflow-hidden bg-[#78856e]"><Image src={idea.image} alt="" className="aspect-[1.3] w-full object-cover transition duration-700 group-hover:scale-105" /></a><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#927141]">{idea.category}</p><h3 className="mt-2 max-w-sm font-[family-name:var(--font-display)] text-2xl leading-tight text-[#19382f]">{idea.title}</h3><a href="#contact" className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#19382f]">Read more <Icon name="arrow" className="h-3.5 w-3.5" /></a></article>)}</div></div></section>

      <section id="contact" className="bg-[#c99759] px-5 py-18 sm:px-8 md:py-22 lg:px-14"><div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 md:flex-row md:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#294238]">Let's build something beautiful</p><h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[1.03] tracking-[-0.035em] text-[#17362e] sm:text-5xl">Ready to transform your outdoor space?</h2><p className="mt-4 max-w-xl text-sm leading-6 text-[#294238]/80">Whether you're installing a single fence panel or planning a complete backyard makeover, we're here to help.</p></div><a href="/contact" className="inline-flex min-h-13 items-center bg-[#19382f] px-7 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#102c25]">Start a conversation <Icon name="arrow" className="ml-3 h-4 w-4" /></a></div></section>

      <footer className="bg-[#102c25] px-5 pb-7 pt-16 text-[#f5f2eb] sm:px-8 lg:px-14"><div className="mx-auto max-w-[1440px]"><div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-[1.3fr_1fr_1fr_1.15fr]"><div><a href="#" className="font-[family-name:var(--font-display)] text-4xl">Luma<span className="italic">Yard</span></a><p className="mt-5 max-w-xs text-sm leading-6 text-white/65">Complete outdoor solutions: fences, lighting, robotics, and energy.</p></div><div><h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8c58d]">Explore</h3><div className="mt-5 flex flex-col gap-3 text-sm text-white/70"><a href="#solutions">Solutions</a><a href="#products">Products</a><a href="#spaces">Spaces</a><a href="#planner">Custom planner</a></div></div><div><h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8c58d]">Help</h3><div className="mt-5 flex flex-col gap-3 text-sm text-white/70"><a href="/contact">Contact us</a><a href="#ideas">Ideas & guides</a><a href="#">Shipping & returns</a><a href="#">Installation</a></div></div><div><h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8c58d]">Stay inspired</h3><p className="mt-5 text-sm leading-6 text-white/65">New products, outdoor ideas, and project inspiration delivered monthly.</p><form className="mt-5 flex border-b border-white/45 pb-2"><input type="email" aria-label="Email address" placeholder="Your email address" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/45" /><button className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e8c58d]">Join</button></form></div></div><div className="flex flex-col justify-between gap-3 pt-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45 sm:flex-row"><span>© 2026 LumaYard. Complete outdoor solutions.</span><span>Privacy · Terms</span></div></div></footer>
    </main>
  );
}
