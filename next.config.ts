import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }, { protocol: "https", hostname: "www.fencefactory.com" }],
  },
  poweredByHeader: false,
  allowedDevOrigins: ["192.168.1.52"],
};

export default nextConfig;
