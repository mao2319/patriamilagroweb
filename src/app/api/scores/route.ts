import { rankingEnabled, submitScore, validId, validSecret } from "@/lib/ranking";
import { requestCountry } from "@/lib/requestCountry";

// Puntaje de una partida: { id, secret, levelId, score, timeSeconds, won }.
export async function POST(request: Request) {
  if (!rankingEnabled()) return Response.json({ error: "ranking-off" }, { status: 503 });
  const body = await request.json().catch(() => null);
  const valid =
    body &&
    validId(body.id) &&
    validSecret(body.secret) &&
    typeof body.levelId === "string" &&
    Number.isFinite(body.score) &&
    Number.isFinite(body.timeSeconds) &&
    typeof body.won === "boolean";
  if (!valid) return Response.json({ error: "bad-request" }, { status: 400 });
  // Una partida de verdad dura al menos 20 segundos y no da puntajes imposibles.
  if (body.timeSeconds < 20 || body.score > 100000) return Response.json({ error: "rejected" }, { status: 422 });
  try {
    const saved = await submitScore(body.id, body.secret, body.levelId, body.score, body.timeSeconds, body.won, requestCountry(request));
    return Response.json({ ok: saved }, { status: saved ? 200 : 403 });
  } catch (error) {
    console.error("[scores]", error);
    return Response.json({ error: "scores-failed" }, { status: 502 });
  }
}
