import { nameProblem, nameTaken, rankingEnabled, validId } from "@/lib/ranking";

// ¿Está libre este nombre? ?nombre=<nombre>&id=<jugador> → { available, reason? }.
export async function GET(request: Request) {
  if (!rankingEnabled()) return Response.json({ error: "ranking-off" }, { status: 503 });
  const params = new URL(request.url).searchParams;
  const name = params.get("nombre") ?? "";
  const id = params.get("id");
  const problem = nameProblem(name);
  if (problem) return Response.json({ available: false, reason: problem });
  try {
    const taken = await nameTaken(name, validId(id) ? id : undefined);
    return Response.json({ available: !taken, reason: taken ? "taken" : null }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[players/name]", error);
    return Response.json({ error: "name-failed" }, { status: 502 });
  }
}
