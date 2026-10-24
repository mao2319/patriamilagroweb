import { getGameContent } from "@/lib/missionStore";

// Lo que lee el juego: las misiones del tablero (título, misión, foto y si ya
// se puede jugar), la imagen del splash, el tema de temporada activo y las
// frases de /admin (captura y al acercarse). Respuesta corta en caché para no
// consultar el Blob en cada visita.
export async function GET() {
  const { missions, splashUrl, season, phrases } = await getGameContent();
  return Response.json(
    { missions, splashUrl, season: season ?? "", capturePhrases: phrases.capture, approachPhrases: phrases.approach },
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=300" } },
  );
}
