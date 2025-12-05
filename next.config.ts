import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // 1. Tetapkan output kepada 'export'
  output: 'export', 

  // 2. Tentukan laluan asas (basePath) menggunakan nama repositori anda
  //    Base path: /MainCalculator
  basePath: isProd ? '/MainCalculatorModern' : '',
  
  // 3. Matikan Image Optimization untuk Static Export (disyorkan)
  images: {
    unoptimized: true,
  },
  
  // 4. Konfigurasi lain (jika ada) boleh diletakkan di sini
  // ...
};

export default nextConfig;