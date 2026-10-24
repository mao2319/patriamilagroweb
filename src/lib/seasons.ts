// Temas de temporada: el juego decora los mapas (calabazas, alumbrados,
// banderas…) cuando hay uno activo. En /admin se habilita cada tema y se
// elige entre qué fechas va; si dos se cruzan, gana el primero de la lista.

export const SEASON_IDS = ["halloween", "navidad", "amor_amistad", "independencia", "carnaval"] as const;
export type SeasonId = (typeof SEASON_IDS)[number];

export interface SeasonTheme {
  id: SeasonId;
  name: string;
  description: string;
  /** Fechas sugeridas (mes-día) la primera vez que se habilita. */
  suggestedStart: string;
  suggestedEnd: string;
}

export const SEASON_THEMES: SeasonTheme[] = [
  { id: "halloween", name: "Halloween", description: "Calabazas, murciélagos, fantasmas y luces moradas.", suggestedStart: "10-15", suggestedEnd: "11-01" },
  { id: "navidad", name: "Navidad", description: "Alumbrados de colores, árbol gigante, regalos y estrellas.", suggestedStart: "12-01", suggestedEnd: "01-06" },
  { id: "amor_amistad", name: "Amor y Amistad", description: "Corazones y globos rojos y rosados.", suggestedStart: "09-01", suggestedEnd: "09-30" },
  { id: "independencia", name: "Fiestas patrias", description: "Banderas y guirnaldas amarillo, azul y rojo.", suggestedStart: "07-15", suggestedEnd: "08-07" },
  { id: "carnaval", name: "Carnaval", description: "Serpentinas, banderines de colores y máscaras.", suggestedStart: "02-10", suggestedEnd: "03-05" },
];

/** Configuración guardada de un tema: si está habilitado y sus fechas (AAAA-MM-DD). */
export interface SeasonSetting {
  enabled: boolean;
  start: string;
  end: string;
}

export type SeasonSettings = Partial<Record<SeasonId, SeasonSetting>>;

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export const isSeasonId = (value: unknown): value is SeasonId => typeof value === "string" && (SEASON_IDS as readonly string[]).includes(value);

/** Limpia lo guardado o lo que llega de /admin: temas conocidos y fechas válidas. */
export function sanitizeSeasons(input: unknown): SeasonSettings {
  const clean: SeasonSettings = {};
  if (!input || typeof input !== "object") return clean;
  for (const [id, raw] of Object.entries(input as Record<string, unknown>)) {
    if (!isSeasonId(id) || !raw || typeof raw !== "object") continue;
    const value = raw as Record<string, unknown>;
    const start = typeof value.start === "string" && DATE.test(value.start) ? value.start : "";
    const end = typeof value.end === "string" && DATE.test(value.end) ? value.end : "";
    if (!start || !end) continue;
    clean[id] = { enabled: value.enabled === true, start, end };
  }
  return clean;
}

/** Fecha de hoy en Colombia (AAAA-MM-DD). */
export function todayInColombia(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** El tema activo hoy (o null): el primero habilitado cuyas fechas incluyen el día. */
export function activeSeason(settings: SeasonSettings, today = todayInColombia()): SeasonId | null {
  for (const theme of SEASON_THEMES) {
    const setting = settings[theme.id];
    if (!setting?.enabled) continue;
    // Las fechas en formato AAAA-MM-DD se comparan bien como texto.
    if (setting.start <= today && today <= setting.end) return theme.id;
  }
  return null;
}

/** Fechas sugeridas para un tema a partir de este año (la Navidad termina en enero del siguiente). */
export function suggestedDates(theme: SeasonTheme, today = todayInColombia()): { start: string; end: string } {
  const year = Number(today.slice(0, 4));
  const start = `${year}-${theme.suggestedStart}`;
  const endYear = theme.suggestedEnd < theme.suggestedStart ? year + 1 : year;
  return { start, end: `${endYear}-${theme.suggestedEnd}` };
}
