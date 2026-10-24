import { activeAds, LOBBY_LEVEL, requestCity } from "@/lib/ads";
import { getGameContent } from "@/lib/missionStore";
import { todayInColombia } from "@/lib/seasons";

// Pautas que el juego pone en un mapa: ?nivel=<levelId>. Solo las vigentes hoy,
// de ese mapa y de la ciudad del jugador (o de todas), cada una con cuántas
// vallas y fachadas ocupa. Con ?nivel=lobby, las del lobby (sus vallas de
// lobby, sin fachadas). El logo se sirve desde este mismo sitio para que el
// juego lo pueda cargar.
export async function GET(request: Request) {
  const levelId = new URL(request.url).searchParams.get("nivel") ?? "";
  const { missions, ads } = await getGameContent();
  const lobby = levelId === LOBBY_LEVEL;
  const mission = missions.find((item) => item.levelId === levelId) ?? null;
  const list = activeAds(ads, lobby ? LOBBY_LEVEL : (mission?.id ?? null), requestCity(request), todayInColombia()).map((ad) => ({
    id: ad.id,
    company: ad.company,
    logo: `/api/ads/logo?u=${encodeURIComponent(ad.logoUrl ?? "")}`,
    link: ad.link,
    billboards: lobby ? ad.lobby : ad.billboards,
    facades: lobby ? 0 : ad.facades,
  }));
  return Response.json({ ads: list }, { headers: { "Cache-Control": "private, no-store" } });
}
