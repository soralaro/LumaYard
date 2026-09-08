import type { NextConfig } from "next";

const mediaUrl = process.env.S3_PUBLIC_URL;
const mediaPattern = mediaUrl
  ? (() => {
      try {
        const url = new URL(mediaUrl);
        return { protocol: url.protocol.replace(":", "") as "http" | "https", hostname: url.hostname, pathname: "/**" };
      } catch {
        return null;
      }
    })()
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.fencefactory.com" },
      ...(mediaPattern ? [mediaPattern] : []),
    ],
  },
  poweredByHeader: false,
  allowedDevOrigins: ["192.168.1.52"],
};

export default nextConfig;
