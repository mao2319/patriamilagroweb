import { flagSource } from "@/lib/countries";
import { validCountry } from "@/lib/ranking";

// Bandera de un país (?c=CO) para el juego, desde el mismo sitio (sin
// problemas de CORS en WebGL). Se guarda en caché un día.
export async function GET(request: Request) {
  const code = validCountry((new URL(request.url).searchParams.get("c") ?? "").toUpperCase());
  if (!code) return new Response("País inválido", { status: 400 });
  const upstream = await fetch(flagSource(code), { cache: "force-cache" }).catch(() => null);
  if (!upstream?.ok) return new Response("Sin bandera", { status: 404 });
  return new Response(await upstream.arrayBuffer(), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400, s-maxage=86400" },
  });
}
