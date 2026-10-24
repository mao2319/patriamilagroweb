import { del, head, put } from "@vercel/blob";
import { connection } from "next/server";
import { mergeMissions, type Mission, type MissionOverride } from "@/lib/missions";
import { activeSeason, sanitizeSeasons, type SeasonId, type SeasonSettings } from "@/lib/seasons";
import { sanitizeAds, type Ad } from "@/lib/ads";
import { emptyPhrases, sanitizePhrases, type GamePhrases } from "@/lib/phrases";

// Guardado de lo que se edita en /admin (misiones, imagen del splash y portada
// del home), en
// el Blob del proyecto (el mismo almacén de la build de Unity). Sin token de
// Blob se usan los valores por defecto y /admin avisa que no puede guardar.

const DATA_PATH = "missions/missions.json";

/** Portada del home: imagen grande y texto principal (vacío: el de fábrica). */
export interface HomeContent {
  heroUrl: string | null;
  lead: string;
  leadEn: string;
}

interface StoredData {
  missions: Record<string, MissionOverride>;
  /** Imagen de la pantalla de presentación del juego (null: la de fábrica). */
  splashUrl: string | null;
  home: HomeContent;
  /** Temas de temporada habilitados y sus fechas. */
  seasons: SeasonSettings;
  /** Pautas publicitarias (vallas y fachadas en los mapas). */
  ads: Ad[];
  /** Frases de captura y mensajes al acercarse (se suman a las del juego). */
  phrases: GamePhrases;
}

export interface GameContent {
  missions: Mission[];
  splashUrl: string | null;
  home: HomeContent;
  seasons: SeasonSettings;
  /** Tema activo hoy (null: ninguno). */
  season: SeasonId | null;
  ads: Ad[];
  phrases: GamePhrases;
}

const emptyHome = (): HomeContent => ({ heroUrl: null, lead: "", leadEn: "" });
const cleanText = (value: unknown) => (typeof value === "string" ? value.trim().slice(0, 300) : "");

export const canSaveMissions = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const isBlobUrl = (value: unknown): value is string => typeof value === "string" && /^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(value);

async function readData(): Promise<StoredData> {
  const empty: StoredData = { missions: {}, splashUrl: null, home: emptyHome(), seasons: {}, ads: [], phrases: emptyPhrases() };
  if (!canSaveMissions()) return empty;
  // Siempre la versión actual (lo último que se guardó en /admin).
  await connection();
  try {
    const blob = await head(DATA_PATH);
    const response = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return empty;
    const data: unknown = await response.json();
    if (!data || typeof data !== "object") return empty;
    const record = data as Record<string, unknown>;
    // Formato anterior: solo las misiones, sin envoltura.
    if (!("missions" in record)) return { ...empty, missions: record as Record<string, MissionOverride> };
    const home = (record.home ?? {}) as Record<string, unknown>;
    return {
      missions: (record.missions ?? {}) as Record<string, MissionOverride>,
      splashUrl: isBlobUrl(record.splashUrl) ? record.splashUrl : null,
      home: { heroUrl: isBlobUrl(home.heroUrl) ? home.heroUrl : null, lead: cleanText(home.lead), leadEn: cleanText(home.leadEn) },
      seasons: sanitizeSeasons(record.seasons),
      ads: sanitizeAds(record.ads),
      phrases: sanitizePhrases(record.phrases),
    };
  } catch {
    // Aún no se ha editado nada (o el Blob no responde): valores por defecto.
    return empty;
  }
}

async function writeData(data: StoredData) {
  await put(DATA_PATH, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

export async function getGameContent(): Promise<GameContent> {
  const data = await readData();
  return { missions: mergeMissions(data.missions), splashUrl: data.splashUrl, home: data.home, seasons: data.seasons, season: activeSeason(data.seasons), ads: data.ads, phrases: data.phrases };
}

/** Guarda las frases de captura y los mensajes al acercarse. */
export async function savePhrases(phrases: GamePhrases): Promise<void> {
  const data = await readData();
  data.phrases = sanitizePhrases(phrases);
  await writeData(data);
}

/** Guarda qué temas de temporada están habilitados y sus fechas. */
export async function saveSeasons(seasons: SeasonSettings): Promise<void> {
  const data = await readData();
  data.seasons = sanitizeSeasons(seasons);
  await writeData(data);
}

export async function getMissions(): Promise<Mission[]> {
  return (await getGameContent()).missions;
}

export async function saveMission(id: string, change: MissionOverride): Promise<void> {
  const data = await readData();
  data.missions[id] = { ...data.missions[id], ...change };
  await writeData(data);
}

/** Cambia la imagen del splash y borra la anterior. */
export async function saveSplash(file: File): Promise<string> {
  const data = await readData();
  const url = await uploadImage(`splash/splash-${Date.now()}`, file);
  const previous = data.splashUrl;
  data.splashUrl = url;
  await writeData(data);
  if (previous) await del(previous).catch(() => undefined);
  return url;
}

/** Cambia el texto de la portada del home y, si llega, su imagen (borra la anterior). */
export async function saveHome(lead: string, leadEn: string, hero: File | null, resetHero: boolean): Promise<void> {
  const data = await readData();
  const previous = data.home.heroUrl;
  data.home = { ...data.home, lead: cleanText(lead), leadEn: cleanText(leadEn) };
  if (hero) data.home.heroUrl = await uploadImage(`home/portada-${Date.now()}`, hero);
  else if (resetHero) data.home.heroUrl = null;
  await writeData(data);
  if (previous && previous !== data.home.heroUrl) await del(previous).catch(() => undefined);
}

/** Vuelve a la presentación de fábrica (la que trae el juego). */
export async function clearSplash(): Promise<void> {
  const data = await readData();
  const previous = data.splashUrl;
  data.splashUrl = null;
  await writeData(data);
  if (previous) await del(previous).catch(() => undefined);
}

const PHOTO_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
/** Vercel limita el cuerpo de las funciones a 4,5 MB. */
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

export function photoProblem(file: File): string | null {
  if (!PHOTO_TYPES[file.type]) return "La imagen debe ser JPG, PNG o WebP.";
  if (file.size > MAX_PHOTO_BYTES) return "La imagen pesa más de 4 MB.";
  return null;
}

async function uploadImage(path: string, file: File) {
  const blob = await put(`${path}.${PHOTO_TYPES[file.type]}`, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: true,
  });
  return blob.url;
}

/** Sube la foto nueva de una misión y borra la anterior (si era del Blob). */
export async function replacePhoto(id: string, file: File, previous: string | null): Promise<string> {
  const url = await uploadImage(`missions/${id}-${Date.now()}`, file);
  if (isBlobUrl(previous)) await del(previous).catch(() => undefined);
  return url;
}

/** Crea o cambia una pauta (con su logo nuevo, si llega) y borra el logo anterior. */
export async function saveAd(ad: Ad, logo: File | null): Promise<void> {
  const data = await readData();
  const previous = data.ads.find((item) => item.id === ad.id);
  const next = { ...ad, logoUrl: previous?.logoUrl ?? null };
  if (logo) next.logoUrl = await uploadImage(`pautas/${ad.id}-${Date.now()}`, logo);
  data.ads = [next, ...data.ads.filter((item) => item.id !== ad.id)];
  await writeData(data);
  if (logo && previous?.logoUrl) await del(previous.logoUrl).catch(() => undefined);
}

export async function deleteAd(id: string): Promise<void> {
  const data = await readData();
  const previous = data.ads.find((item) => item.id === id);
  data.ads = data.ads.filter((item) => item.id !== id);
  await writeData(data);
  if (previous?.logoUrl) await del(previous.logoUrl).catch(() => undefined);
}

/** Sube una imagen (logos de las solicitudes de pauta). */
export async function uploadPublicImage(path: string, file: File): Promise<string> {
  return uploadImage(path, file);
}
