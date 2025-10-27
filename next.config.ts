import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Necesario para usar el runtime standalone (imagen ligera)
  output: "standalone",

  // Si no usas el optimizador de imágenes de Next en prod (Nginx, etc.)
  images: { unoptimized: true },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;