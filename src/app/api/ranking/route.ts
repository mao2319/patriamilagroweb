import { getRanking, rankingEnabled, SCOPES, validId, type Scope } from "@/lib/ranking";
import { requestCountry } from "@/lib/requestCountry";

const RANKING_LIST = 50;

// Ranking para el juego (los 50 primeros, ordenados de mayor a menor): ?alcance=weekly|global|country&id=<jugador>.
export async function GET(request: Request) {
  if (!rankingEnabled()) return Response.json({ error: "ranking-off" }, { status: 503 });
  const params = new URL(request.url).searchParams;
  const scope = (SCOPES as string[]).includes(params.get("alcance") ?? "") ? (params.get("alcance") as Scope) : "weekly";
  const id = params.get("id");
  const country = requestCountry(request);
  try {
    const ranking = await getRanking(scope, scope === "country" ? country : null, validId(id) ? id : null, RANKING_LIST);
    return Response.json({ ...ranking, myCountry: country }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[ranking]", error);
    return Response.json({ error: "ranking-failed" }, { status: 502 });
  }
}
