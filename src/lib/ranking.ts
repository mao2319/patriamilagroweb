import { createHash } from "node:crypto";

// Ranking del juego: jugadores y puntajes en Supabase, siempre desde el
// servidor del portal (llave de servidor). El juego nunca habla con la base de
// datos directamente.

const url = () => (process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
const key = () => process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
export const rankingEnabled = () => Boolean(url() && key());

export type Scope = "weekly" | "global" | "country";
export const SCOPES: Scope[] = ["weekly", "global", "country"];

export interface RankRow {
  rank: number;
  name: string;
  country: string | null;
  best: number;
  me: boolean;
}

async function rest(path: string, init: RequestInit = {}) {
  const response = await fetch(`${url()}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    // Las llaves clásicas (JWT) van también como Authorization; las nuevas (sb_secret_…) solo como apikey.
    headers: {
      apikey: key(),
      ...(key().startsWith("eyJ") ? { Authorization: `Bearer ${key()}` } : {}),
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

const hash = (secret: string) => createHash("sha256").update(`firme-ranking:${secret}`).digest("hex");

// ── Nombres ──
const BLOCKED = ["puta", "puto", "mierda", "marica", "gonorrea", "hijueputa", "malparido", "verga", "culo", "fuck", "shit"];
const ALLOWED = /^[\p{L}\p{N} ]+$/u;

export const cleanName = (name: string) => name.trim().replace(/\s+/g, " ");

/** Problema del nombre (clave de texto) o null si sirve. Las mismas reglas que en el juego. */
export function nameProblem(raw: string): string | null {
  const name = cleanName(raw);
  if (name.length < 3) return "short";
  if (name.length > 16) return "long";
  if (!ALLOWED.test(name)) return "chars";
  const compact = name.toLowerCase().replace(/ /g, "");
  if (BLOCKED.some((word) => compact.includes(word))) return "rude";
  return null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const validId = (id: unknown): id is string => typeof id === "string" && UUID.test(id);
export const validSecret = (secret: unknown): secret is string => typeof secret === "string" && secret.length >= 16 && secret.length <= 128;
export const validCountry = (country: string | null | undefined) => (country && /^[A-Z]{2}$/.test(country) ? country : null);

interface PlayerRow {
  id: string;
  secret_hash: string;
  name: string;
  country: string | null;
}

async function findPlayer(id: string): Promise<PlayerRow | null> {
  const rows: PlayerRow[] = await rest(`players?id=eq.${id}&select=id,secret_hash,name,country`);
  return rows[0] ?? null;
}

/** ¿Lo tiene otro jugador? (sin distinguir mayúsculas). */
export async function nameTaken(name: string, exceptId?: string): Promise<boolean> {
  const rows: { id: string }[] = await rest(`players?name_key=eq.${encodeURIComponent(cleanName(name).toLowerCase())}&select=id`);
  return rows.some((row) => row.id !== exceptId);
}

export type RegisterResult = { ok: true; name: string } | { ok: false; reason: "secret" | "taken" | "short" | "long" | "chars" | "rude" };

/**
 * Crea o actualiza al jugador (id + secreto del dispositivo). Si el nombre ya
 * es de otro, no se cambia y se avisa.
 */
export async function registerPlayer(id: string, secret: string, rawName: string, country: string | null): Promise<RegisterResult> {
  const name = cleanName(rawName);
  const problem = nameProblem(name);
  const existing = await findPlayer(id);
  if (existing && existing.secret_hash !== hash(secret)) return { ok: false, reason: "secret" };
  if (problem) return { ok: false, reason: problem as "short" };
  if (await nameTaken(name, id)) return { ok: false, reason: "taken" };
  if (existing) {
    await rest(`players?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name, country: country ?? existing.country, updated_at: new Date().toISOString() }),
    });
  } else {
    await rest("players", { method: "POST", body: JSON.stringify({ id, secret_hash: hash(secret), name, country }) });
  }
  return { ok: true, name };
}

/** Guarda el puntaje de una partida (solo si el secreto es del jugador). */
export async function submitScore(id: string, secret: string, levelId: string, score: number, timeSeconds: number, won: boolean, country: string | null) {
  const player = await findPlayer(id);
  if (!player || player.secret_hash !== hash(secret)) return false;
  await rest("scores", {
    method: "POST",
    body: JSON.stringify({
      player_id: id,
      level_id: levelId.slice(0, 64),
      score: Math.max(0, Math.min(100000, Math.round(score))),
      time_seconds: Math.max(0, timeSeconds),
      won,
      country: country ?? player.country,
    }),
  });
  if (country && !player.country) await rest(`players?id=eq.${id}`, { method: "PATCH", body: JSON.stringify({ country }) });
  return true;
}

/** Los primeros del alcance y el puesto del jugador (si se pasa su id). */
export async function getRanking(scope: Scope, country: string | null, playerId: string | null, limit = 10) {
  const top: { rank: number; player_id: string; name: string; country: string | null; best: number }[] = await rest("rpc/leaderboard", {
    method: "POST",
    body: JSON.stringify({ p_scope: scope, p_country: country, p_limit: limit }),
  });
  let me: { rank: number; best: number } | null = null;
  if (playerId) {
    const rows: { rank: number; best: number }[] = await rest("rpc/player_rank", {
      method: "POST",
      body: JSON.stringify({ p_scope: scope, p_country: country, p_player: playerId }),
    });
    me = rows[0] ?? null;
  }
  const rows: RankRow[] = top.map((row) => ({ rank: Number(row.rank), name: row.name, country: row.country, best: row.best, me: row.player_id === playerId }));
  return { scope, country, top: rows, me };
}
