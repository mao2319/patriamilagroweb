import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Build WebGL de Unity (public/unity/Build): comprimido con Brotli y sin
  // descompresión de respaldo, así que el navegador necesita estos encabezados.
  async headers() {
    const build = "/unity/Build/firme";
    const brotli = (suffix: string, type: string) => ({
      source: `${build}${suffix}`,
      headers: [
        { key: "Content-Encoding", value: "br" },
        { key: "Content-Type", value: type },
        { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
      ],
    });
    return [
      brotli(".wasm.br", "application/wasm"),
      brotli(".framework.js.br", "application/javascript"),
      brotli(".data.br", "application/octet-stream"),
      {
        source: `${build}.loader.js`,
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, must-revalidate" }],
      },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
