export type Product = {
  handle: string;
  title: string;
  price: number;
  image: string;
  collection: "solar" | "portable" | "privacy";
  spaces: string[];
  description: string;
  features: string[];
  stripePaymentLink?: string;
  whatsappInquiry?: boolean;
};

export const products: Product[] = [
  {
    handle: "sola-fence-light-8-pack",
    title: "Sola Fence Light — 8 Pack",
    price: 69,
    image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=85",
    collection: "solar",
    spaces: ["backyard", "garden", "deck"],
    description: "A warm, low-profile glow for fences, rails, and the spaces that welcome you home.",
    features: ["Solar powered", "USB-C backup", "IP65 weatherproof", "Auto-on at dusk"],
    stripePaymentLink: "https://buy.stripe.com/",
  },
  {
    handle: "lumago-portable-lamp",
    title: "LumaGo Portable Lamp",
    price: 89,
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85",
    collection: "portable",
    spaces: ["patio", "deck", "backyard"],
    description: "A dimmable, rechargeable lamp made for unhurried dinners and impromptu evenings outside.",
    features: ["USB-C rechargeable", "Up to 20 hours", "Dimmable warm light", "IP65 weatherproof"],
    stripePaymentLink: "https://buy.stripe.com/",
  },
  {
    handle: "woven-privacy-screen",
    title: "Woven Privacy Screen",
    price: 249,
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=85",
    collection: "privacy",
    spaces: ["backyard", "patio", "garden"],
    description: "A considered boundary that brings intimacy, texture, and a little more calm to open spaces.",
    features: ["Modular panels", "Outdoor-rated frame", "Easy installation", "Project consultation included"],
    whatsappInquiry: true,
  },
];

export function getProduct(handle: string) {
  return products.find((product) => product.handle === handle);
}
