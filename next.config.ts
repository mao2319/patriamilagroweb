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
  // Si la build de Unity no está en public/ (deploys automáticos desde GitHub,
  // donde no se versiona), se sirve desde Vercel Blob por la misma ruta. Los
  // encabezados de arriba se aplican igual. Ver scripts/publish-unity-build.mjs.
  async rewrites() {
    const origin = process.env.UNITY_BUILD_ORIGIN?.replace(/\/$/, "");
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: origin ? [{ source: "/unity/:path*", destination: `${origin}/unity/:path*` }] : [],
    };
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
