import { validCountry } from "@/lib/ranking";

// País del jugador según Vercel (cabecera de la conexión). En local no viene:
// se puede simular con ?pais=CO para probar el ranking por país.
export function requestCountry(request: Request): string | null {
  const fromVercel = request.headers.get("x-vercel-ip-country");
  const forced = process.env.NODE_ENV !== "production" ? new URL(request.url).searchParams.get("pais") : null;
  return validCountry((fromVercel ?? forced ?? "").toUpperCase());
}
