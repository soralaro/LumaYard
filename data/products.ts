export type Product = {
  handle: string;
  title: string;
  price: number;
  image: string;
  collection: "fences" | "lighting" | "robotics" | "energy";
  spaces: string[];
  description: string;
  features: string[];
  stripePaymentLink?: string;
  whatsappInquiry?: boolean;
};

export const products: Product[] = [
  {
    handle: "modular-privacy-fence-panel",
    title: "Modular Privacy Fence Panel",
    price: 189,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
    collection: "fences",
    spaces: ["backyard", "garden", "patio"],
    description: "Weather-resistant privacy panels designed to define your outdoor sanctuary with lasting beauty.",
    features: ["Modular installation", "UV-resistant finish", "10-year warranty", "Professional consultation included"],
    whatsappInquiry: true,
  },
  {
    handle: "decorative-garden-fence",
    title: "Decorative Garden Fence",
    price: 129,
    image: "https://images.unsplash.com/photo-1591290619762-d6d4afe9e5d5?auto=format&fit=crop&w=1200&q=85",
    collection: "fences",
    spaces: ["garden", "backyard"],
    description: "Low-profile garden borders that bring structure and charm without blocking your view.",
    features: ["Easy DIY install", "Rust-proof coating", "Expandable sections", "Includes ground stakes"],
    whatsappInquiry: true,
  },
  {
    handle: "solar-fence-light-8-pack",
    title: "Solar Fence Light — 8 Pack",
    price: 69,
    image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=85",
    collection: "lighting",
    spaces: ["backyard", "garden", "deck"],
    description: "Warm, low-profile accent lighting that turns on at dusk and runs all night.",
    features: ["Solar powered", "USB-C backup", "IP65 weatherproof", "Auto-on at dusk"],
    stripePaymentLink: "https://buy.stripe.com/",
  },
  {
    handle: "lumago-portable-lamp",
    title: "LumaGo Portable Lamp",
    price: 89,
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85",
    collection: "lighting",
    spaces: ["patio", "deck", "backyard"],
    description: "Rechargeable, dimmable lamp for dinners that never feel rushed.",
    features: ["USB-C rechargeable", "Up to 20 hours", "Dimmable warm light", "IP65 weatherproof"],
    stripePaymentLink: "https://buy.stripe.com/",
  },
  {
    handle: "solar-garden-pathway-light",
    title: "Solar Garden Pathway Light",
    price: 45,
    image: "https://images.unsplash.com/photo-1558521958-0a228e77e984?auto=format&fit=crop&w=1200&q=85",
    collection: "lighting",
    spaces: ["garden", "backyard"],
    description: "Elegant pathway markers that guide your steps with soft, solar-powered glow.",
    features: ["No wiring needed", "Auto-on at dusk", "Weather-resistant", "Set of 6 included"],
    stripePaymentLink: "https://buy.stripe.com/",
  },
  {
    handle: "smart-robotic-mower",
    title: "Smart Robotic Lawn Mower",
    price: 1299,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=85",
    collection: "robotics",
    spaces: ["backyard", "garden"],
    description: "Autonomous mowing that keeps your lawn perfect while you enjoy your time outside.",
    features: ["GPS navigation", "Rain sensor", "Quiet operation", "App control & scheduling"],
    whatsappInquiry: true,
  },
  {
    handle: "home-solar-energy-system",
    title: "Home Solar + Storage System",
    price: 8999,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=85",
    collection: "energy",
    spaces: ["backyard", "deck"],
    description: "Complete solar panel and battery storage solution to power your outdoor living and beyond.",
    features: ["10kW solar array", "15kWh battery storage", "Grid-tied or off-grid", "Full installation & consultation"],
    whatsappInquiry: true,
  },
];

export function getProduct(handle: string) {
  return products.find((product) => product.handle === handle);
}

export function getProductsByCollection(collection: Product["collection"]) {
  return products.filter((product) => product.collection === collection);
}
