// Pautas publicitarias: el logo de una marca en los mapas del juego, en vallas
// (en postes) y en fachadas de edificios, y en las vallas del lobby. Se crean
// en /admin con sus fechas, cuántas vallas y fachadas ocupa en cada mapa (y
// cuántas en el lobby), los mapas donde salen y las ciudades de los jugadores
// que las ven (vacío: todas).

/** Cuántas vallas y fachadas ocupa una pauta en cada mapa, y cuántas vallas en el lobby. */
export interface AdSpaces {
  billboards: number;
  facades: number;
  lobby: number;
}

export const DEFAULT_AD_SPACES: AdSpaces = { billboards: 2, facades: 1, lobby: 1 };
/** Lo máximo que tienen los mapas del juego y el lobby (si no caben, salen las que haya). */
export const MAX_AD_SPACES: AdSpaces = { billboards: 10, facades: 5, lobby: 4 };

/** El «nivel» que pide el lobby del juego (/api/ads?nivel=lobby). */
export const LOBBY_LEVEL = "lobby";

const spaceCount = (raw: unknown, fallback: number, max: number) => {
  const number = typeof raw === "string" && raw.trim() !== "" ? Number(raw) : raw;
  return typeof number === "number" && Number.isInteger(number) && number >= 0 && number <= max ? number : fallback;
};

export interface Ad {
  id: string;
  company: string;
  /** Logo en el Blob (https). */
  logoUrl: string | null;
  /** Página o red social de la marca (https). */
  link: string;
  /** Vigencia (AAAA-MM-DD, ambas incluidas). */
  start: string;
  end: string;
  /** Mapas (id de la misión) donde sale; vacío: todos. */
  missions: string[];
  /** Ciudades de los jugadores que la ven; vacío: todas. */
  cities: string[];
  /** Vallas y fachadas que ocupa en cada mapa (las guardadas antes: 2 y 1). */
  billboards: number;
  facades: number;
  /** Vallas que ocupa en el lobby (0: no sale ahí; las guardadas antes: 1). */
  lobby: number;
  enabled: boolean;
}

/** Ciudades para elegir en /admin (las del juego y otras grandes de Colombia). */
export const AD_CITIES = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Cúcuta",
  "Pereira",
  "Manizales",
  "Ibagué",
  "Santa Marta",
  "San Andrés",
  "Villavicencio",
  "Pasto",
  "Neiva",
  "Armenia",
  "Montería",
  "Valledupar",
] as const;

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_ADS = 60;

/** «Bogotá» y «BOGOTA» son la misma ciudad. */
export function normalizeCity(city: string): string {
  return city.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();
}

const cleanText = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export function safeLink(value: unknown): string {
  const text = cleanText(value, 300);
  if (!text) return "";
  const withScheme = /^https?:\/\//i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(withScheme);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

const isBlobUrl = (value: unknown): value is string => typeof value === "string" && /^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(value);

/** Limpia una pauta (de lo guardado o de /admin). Devuelve null si no sirve. */
export function sanitizeAd(input: unknown): Ad | null {
  if (!input || typeof input !== "object") return null;
  const value = input as Record<string, unknown>;
  const id = cleanText(value.id, 40);
  const company = cleanText(value.company, 80);
  const start = typeof value.start === "string" && DATE.test(value.start) ? value.start : "";
  const end = typeof value.end === "string" && DATE.test(value.end) ? value.end : "";
  if (!/^[a-z0-9-]{4,40}$/.test(id) || !company || !start || !end || end < start) return null;
  const list = (raw: unknown, max: number) =>
    Array.isArray(raw)
      ? [
          ...new Set(
            raw
              .filter((item): item is string => typeof item === "string")
              .map((item) => item.trim().slice(0, 40))
              .filter(Boolean),
          ),
        ].slice(0, max)
      : [];
  return {
    id,
    company,
    logoUrl: isBlobUrl(value.logoUrl) ? value.logoUrl : null,
    link: safeLink(value.link),
    start,
    end,
    missions: list(value.missions, 20),
    cities: list(value.cities, 30),
    billboards: spaceCount(value.billboards, DEFAULT_AD_SPACES.billboards, MAX_AD_SPACES.billboards),
    facades: spaceCount(value.facades, DEFAULT_AD_SPACES.facades, MAX_AD_SPACES.facades),
    lobby: spaceCount(value.lobby, DEFAULT_AD_SPACES.lobby, MAX_AD_SPACES.lobby),
    enabled: value.enabled !== false,
  };
}

export function sanitizeAds(input: unknown): Ad[] {
  if (!Array.isArray(input)) return [];
  return input
    .map(sanitizeAd)
    .filter((ad): ad is Ad => ad !== null)
    .slice(0, MAX_ADS);
}

/**
 * Las pautas que se ven hoy en ese mapa para un jugador de esa ciudad (con logo).
 * En el lobby (missionId = LOBBY_LEVEL): las que tienen vallas de lobby, sin importar los mapas.
 */
export function activeAds(ads: Ad[], missionId: string | null, city: string | null, today: string): Ad[] {
  const playerCity = city ? normalizeCity(city) : null;
  const lobby = missionId === LOBBY_LEVEL;
  return ads.filter((ad) => {
    if (!ad.enabled || !ad.logoUrl || ad.start > today || ad.end < today) return false;
    if (lobby ? ad.lobby === 0 : ad.missions.length > 0 && (!missionId || !ad.missions.includes(missionId))) return false;
    if (ad.cities.length > 0 && (!playerCity || !ad.cities.some((c) => normalizeCity(c) === playerCity))) return false;
    return true;
  });
}

/** Ciudad del jugador según Vercel (viene codificada: «Bogot%C3%A1»). En local se simula con ?ciudad=. */
export function requestCity(request: Request): string | null {
  const header = request.headers.get("x-vercel-ip-city");
  const forced = process.env.NODE_ENV !== "production" ? new URL(request.url).searchParams.get("ciudad") : null;
  const raw = header ?? forced;
  if (!raw) return null;
  try {
    return decodeURIComponent(raw).slice(0, 60);
  } catch {
    return raw.slice(0, 60);
  }
}

export const newAdId = () => `pauta-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
