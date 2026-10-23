// Eventos que el juego (Unity, WebBridge.cs) publica en window como
// CustomEvent «firme:game-event». El portal no confía en lo que llega: valida
// cada campo antes de usarlo y descarta lo que no reconoce.

export const GAME_EVENT = "firme:game-event";

export type GameEvent =
  | { type: "ready" }
  | { type: "levelCompleted"; levelId: string; timeSeconds: number; score: number; objectivesDone: number; objectivesTotal: number }
  | { type: "levelFailed"; levelId: string; reason: string };

const LEVEL_ID = /^[a-z0-9_]{1,64}$/;
const REASON = /^[A-Za-z]{1,32}$/;

const isCount = (value: unknown, max: number): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= max;

export function parseGameEvent(detail: unknown): GameEvent | null {
  if (typeof detail !== "object" || detail === null) return null;
  const data = detail as Record<string, unknown>;

  switch (data.type) {
    case "ready":
      return { type: "ready" };

    case "levelCompleted": {
      const { levelId, timeSeconds, score, objectivesDone, objectivesTotal } = data;
      if (typeof levelId !== "string" || !LEVEL_ID.test(levelId)) return null;
      if (typeof timeSeconds !== "number" || !Number.isFinite(timeSeconds) || timeSeconds < 0 || timeSeconds > 24 * 3600) return null;
      if (!isCount(score, 10_000_000) || !isCount(objectivesTotal, 1000) || !isCount(objectivesDone, 1000)) return null;
      if (objectivesDone > objectivesTotal) return null;
      return { type: "levelCompleted", levelId, timeSeconds, score, objectivesDone, objectivesTotal };
    }

    case "levelFailed": {
      const { levelId, reason } = data;
      if (typeof levelId !== "string" || !LEVEL_ID.test(levelId)) return null;
      if (typeof reason !== "string" || !REASON.test(reason)) return null;
      return { type: "levelFailed", levelId, reason };
    }

    default:
      return null;
  }
}

/** Escucha los eventos válidos del juego. Devuelve la función para dejar de escuchar. */
export function listenGameEvents(onEvent: (event: GameEvent) => void): () => void {
  const handler = (raw: Event) => {
    const event = parseGameEvent((raw as CustomEvent).detail);
    if (event) onEvent(event);
  };
  window.addEventListener(GAME_EVENT, handler);
  return () => window.removeEventListener(GAME_EVENT, handler);
}

/** Formato m:ss para mostrar el tiempo de la partida. */
export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
