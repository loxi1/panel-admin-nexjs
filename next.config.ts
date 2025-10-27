import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 👇 importante: genera la build standalone (ideal para Docker)
  output: "standalone",

  // 🚫 quita el header "X-Powered-By: Next.js"
  poweredByHeader: false,

  // ⚡ mejora tiempos de build y tamaño
  compress: true,
  reactStrictMode: true,
  swcMinify: true,

  // 🔧 Config extra para SVGs (tu regla actual)
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  // 🖼️ si no usas el optimizador de imágenes de Next (útil en Docker)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;