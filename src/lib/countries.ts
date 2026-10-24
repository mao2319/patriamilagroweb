import { validCountry } from "@/lib/ranking";

// País de la conexión del jugador para mostrarlo junto a su personaje (bandera
// y nombre). En producción lo da Vercel; en local se simula con ?pais=XX y,
// si no se pide ninguno, se usa Colombia para poder verlo al probar.

const names = new Intl.DisplayNames(["es"], { type: "region" });

/** «CO» → «Colombia» (en español). */
export function countryName(code: string): string {
  try {
    return names.of(code) ?? code;
  } catch {
    return code;
  }
}

export function connectionCountry(request: Request): string | null {
  const fromVercel = request.headers.get("x-vercel-ip-country");
  if (fromVercel) return validCountry(fromVercel.toUpperCase());
  if (process.env.NODE_ENV === "production") return null;
  const forced = new URL(request.url).searchParams.get("pais");
  return validCountry((forced ?? "CO").toUpperCase());
}

/** Bandera de un país (PNG, 80 px de ancho) en flagcdn. */
export const flagSource = (code: string) => `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
