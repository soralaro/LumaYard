import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LumaYard | Outdoor living, beautifully considered",
  description:
    "Lighting, privacy, and outdoor pieces designed to make every night outside feel more beautiful.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumayard.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "LumaYard | Outdoor living, beautifully considered",
    description: "Thoughtful lighting and outdoor pieces for the moments you want to make last.",
    url: "/",
    siteName: "LumaYard",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "LumaYard", description: "Outdoor living, beautifully considered." },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
