import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // Buang: output: 'export',
  // Buang: basePath: '/MainCalculator',
  // Buang: images: { unoptimized: true }
};

export default nextConfig;