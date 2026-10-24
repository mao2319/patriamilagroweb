import { rankingEnabled, registerPlayer, validId, validSecret } from "@/lib/ranking";
import { requestCountry } from "@/lib/requestCountry";

// Registra o actualiza al jugador del dispositivo: { id, secret, name }.
export async function POST(request: Request) {
  if (!rankingEnabled()) return Response.json({ error: "ranking-off" }, { status: 503 });
  const body = await request.json().catch(() => null);
  if (!body || !validId(body.id) || !validSecret(body.secret) || typeof body.name !== "string") {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  try {
    const result = await registerPlayer(body.id, body.secret, body.name, requestCountry(request));
    return Response.json(result, { status: result.ok ? 200 : result.reason === "secret" ? 403 : 409 });
  } catch (error) {
    console.error("[players]", error);
    return Response.json({ error: "players-failed" }, { status: 502 });
  }
}
