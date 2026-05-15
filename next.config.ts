import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "toptechkh.com" },
      { protocol: "http", hostname: "toptechkh.com" },
      { protocol: "https", hostname: "klbtheme.com" },
      { protocol: "http", hostname: "klbtheme.com" },
      { protocol: "https", hostname: "**.klbtheme.com" },
      { protocol: "http", hostname: "**.klbtheme.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
    ],
  },
};

export default nextConfig;
