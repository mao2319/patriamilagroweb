// Antes de «next build»: si la build de Unity no está en public/unity/Build
// (deploys automáticos desde GitHub, donde no se versiona), la descarga del
// almacén de Vercel Blob (UNITY_BUILD_ORIGIN). Así se sirve como archivo
// estático del deploy, con los encabezados Brotli de next.config.ts.
// Ver scripts/publish-unity-build.mjs para subirla.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const folder = join(process.cwd(), "public", "unity", "Build");
const files = ["firme.loader.js", "firme.framework.js.br", "firme.wasm.br", "firme.data.br"];

if (files.every((name) => existsSync(join(folder, name)))) {
  console.log("[unity] Build local en public/unity/Build: no se descarga.");
  process.exit(0);
}

const origin = process.env.UNITY_BUILD_ORIGIN?.replace(/\/$/, "");
if (!origin) {
  // Sin build ni almacén, el portal funciona y /jugar avisa que no pudo cargar.
  console.warn("[unity] Sin build de Unity: falta UNITY_BUILD_ORIGIN.");
  process.exit(0);
}

mkdirSync(folder, { recursive: true });
for (const name of files) {
  const response = await fetch(`${origin}/unity/Build/${name}`);
  if (!response.ok) {
    console.error(`[unity] No se pudo descargar ${name}: HTTP ${response.status}`);
    process.exit(1);
  }
  // fetch quita la compresión del transporte; queda el archivo tal cual lo generó Unity.
  const bytes = Buffer.from(await response.arrayBuffer());
  writeFileSync(join(folder, name), bytes);
  console.log(`[unity] ${name}: ${(bytes.length / 1048576).toFixed(2)} MB`);
}
