// Sube la build WebGL de Unity (public/unity/Build) al almacén de Vercel Blob
// del proyecto, para que los deploys automáticos desde GitHub tengan el juego
// sin versionar la build en el repositorio. El portal la sirve en /unity/...
// (ver la regla de respaldo en next.config.ts y UNITY_BUILD_ORIGIN).
//
//   npm run publish:unity
//
// Requiere la CLI de Vercel con sesión iniciada y el proyecto vinculado
// (credenciales del almacén en .env.local: BLOB_READ_WRITE_TOKEN).
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Token del almacén: de la variable de entorno o de .env.local (no se imprime).
function blobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  const env = join(process.cwd(), ".env.local");
  if (!existsSync(env)) return "";
  const line = readFileSync(env, "utf8").split(/\r?\n/).find((l) => l.startsWith("BLOB_READ_WRITE_TOKEN="));
  return line ? line.slice("BLOB_READ_WRITE_TOKEN=".length).replace(/^"|"$/g, "") : "";
}

const token = blobToken();
if (!token) {
  console.error("Falta BLOB_READ_WRITE_TOKEN (ejecuta «vercel env pull» o define la variable).");
  process.exit(1);
}

const folder = join(process.cwd(), "public", "unity", "Build");
const types = {
  ".loader.js": "application/javascript",
  ".br": "application/octet-stream",
};

let files;
try {
  files = readdirSync(folder).filter((name) => statSync(join(folder, name)).isFile());
} catch {
  console.error(`No hay build en ${folder}. Genérala desde Unity con -portalDir.`);
  process.exit(1);
}

for (const name of files) {
  const type = Object.entries(types).find(([suffix]) => name.endsWith(suffix))?.[1] ?? "application/octet-stream";
  const size = (statSync(join(folder, name)).size / 1048576).toFixed(2);
  console.log(`Subiendo ${name} (${size} MB)…`);
  execFileSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    [
      "vercel", "blob", "put", join(folder, name),
      "--pathname", `unity/Build/${name}`,
      "--access", "public",
      "--allow-overwrite", "true",
      // Caché corta: al publicar una build nueva, los jugadores la reciben pronto.
      "--cache-control-max-age", "300",
      "--content-type", type,
      "--rw-token", token,
    ],
    // Sin la variable OIDC: la CLI exige usar un solo tipo de credencial.
    { stdio: "inherit", shell: process.platform === "win32", env: { ...process.env, VERCEL_OIDC_TOKEN: "" } },
  );
}
console.log("Build de Unity publicada en Vercel Blob.");
