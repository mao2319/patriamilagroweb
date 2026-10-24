// Frases del juego que se editan en /admin: las que dice la voz al capturar a
// un delincuente y los mensajes al acercarse a uno (cuando te ve y sale
// corriendo, y en el globo del presidente mientras lo persigue). Se suman a
// las que ya trae el juego. «{nombre}» se reemplaza por el alias del
// delincuente.

export interface GamePhrases {
  capture: string[];
  approach: string[];
}

export const NAME_TOKEN = "{nombre}";
export const MAX_PHRASES = 60;
export const MAX_PHRASE_LENGTH = 140;

export const emptyPhrases = (): GamePhrases => ({ capture: [], approach: [] });

/** Una frase por línea: sin vacías, sin repetidas, cortas y con un máximo. */
export function phraseLines(raw: unknown): string[] {
  const lines = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(/\r?\n/) : [];
  const clean = lines
    .filter((line): line is string => typeof line === "string")
    // Sin llaves sueltas (el juego usa string.Format): solo el {nombre}.
    .map((line) => line.replace(/\s+/g, " ").trim().slice(0, MAX_PHRASE_LENGTH))
    .filter((line) => line.length > 0 && !/[{}]/.test(line.replaceAll(NAME_TOKEN, "")));
  return [...new Set(clean)].slice(0, MAX_PHRASES);
}

export function sanitizePhrases(input: unknown): GamePhrases {
  if (!input || typeof input !== "object") return emptyPhrases();
  const value = input as Record<string, unknown>;
  return { capture: phraseLines(value.capture), approach: phraseLines(value.approach) };
}
