import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["asset.kompas.com", "res.cloudinary.com"],
  },
};

export default nextConfig;
