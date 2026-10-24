import { createHash } from "node:crypto";
import { statSync } from "node:fs";
import path from "node:path";

const FILES = ["firme.loader.js", "firme.framework.js.br", "firme.wasm.br", "firme.data.br"];

// Huella de la build de Unity que hay en public/unity/Build (tamaño y fecha de
// cada archivo). Va en las URL de la build (?v=…): los archivos se llaman
// igual en todas las builds y el navegador los guarda una hora, así que sin
// ella podía mezclar partes de una build vieja con una nueva y el juego se
// rompía al cargar. Si los archivos no están aquí (build en otro dominio),
// no hay huella.
export function unityBuildVersion(): string {
  try {
    const folder = path.join(process.cwd(), "public", "unity", "Build");
    const hash = createHash("sha1");
    for (const file of FILES) {
      const stat = statSync(path.join(folder, file));
      hash.update(`${file}:${stat.size}:${stat.mtimeMs}`);
    }
    return hash.digest("hex").slice(0, 12);
  } catch {
    return "";
  }
}
