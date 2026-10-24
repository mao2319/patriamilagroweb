"use server";

import { refresh } from "next/cache";
import { credentialsMatch, endSession, isAdmin, startSession } from "@/lib/adminSession";
import { MAX_AD_SPACES, newAdId, sanitizeAd } from "@/lib/ads";
import {
  canSaveMissions,
  clearSplash,
  deleteAd,
  getMissions,
  photoProblem,
  replacePhoto,
  saveAd,
  saveHome,
  saveMission,
  savePhrases,
  saveSeasons,
  saveSplash,
} from "@/lib/missionStore";
import { EDITABLE_FIELDS, sanitizeOverride } from "@/lib/missions";
import { MAX_PHRASES, phraseLines } from "@/lib/phrases";
import { SEASON_IDS, type SeasonSettings } from "@/lib/seasons";

export interface FormState {
  ok?: boolean;
  message?: string;
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  if (!credentialsMatch(String(form.get("email") ?? ""), String(form.get("password") ?? ""))) {
    return { message: "Correo o contraseña incorrectos." };
  }
  await startSession();
  refresh();
  return { ok: true };
}

export async function logout() {
  await endSession();
  refresh();
}

export async function updateMission(_: FormState, form: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { message: "Tu sesión terminó. Vuelve a entrar." };
  if (!canSaveMissions()) return { message: "Falta BLOB_READ_WRITE_TOKEN: no se puede guardar." };
  const id = String(form.get("id") ?? "");
  const current = (await getMissions()).find((mission) => mission.id === id);
  if (!current) return { message: "Esa misión no existe." };

  const fields: Record<string, unknown> = {};
  for (const field of EDITABLE_FIELDS) fields[field] = form.get(field);
  fields.suspects = form.get("suspects");
  const change = sanitizeOverride(fields);

  const photo = form.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const problem = photoProblem(photo);
    if (problem) return { message: problem };
    change.photoUrl = await replacePhoto(id, photo, current.photoUrl);
  }
  await saveMission(id, change);
  refresh();
  return {
    ok: true,
    message: "Guardado. El juego lo muestra en menos de un minuto.",
  };
}

export async function updatePhrases(_: FormState, form: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { message: "Tu sesión terminó. Vuelve a entrar." };
  if (!canSaveMissions()) return { message: "Falta BLOB_READ_WRITE_TOKEN: no se puede guardar." };
  const capture = phraseLines(String(form.get("capture") ?? ""));
  const approach = phraseLines(String(form.get("approach") ?? ""));
  await savePhrases({ capture, approach });
  refresh();
  return {
    ok: true,
    message: `Guardado: ${capture.length} de captura y ${approach.length} al acercarse (máx. ${MAX_PHRASES} de cada una). El juego las usa al abrirse.`,
  };
}

export async function updateSplash(_: FormState, form: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { message: "Tu sesión terminó. Vuelve a entrar." };
  if (!canSaveMissions()) return { message: "Falta BLOB_READ_WRITE_TOKEN: no se puede guardar." };
  if (form.get("reset") === "1") {
    await clearSplash();
    refresh();
    return {
      ok: true,
      message: "Listo: el juego vuelve a la presentación de fábrica.",
    };
  }
  const image = form.get("image");
  if (!(image instanceof File) || image.size === 0) return { message: "Elige una imagen." };
  const problem = photoProblem(image);
  if (problem) return { message: problem };
  await saveSplash(image);
  refresh();
  return {
    ok: true,
    message: "Guardado. El juego la muestra al abrir (en menos de un minuto).",
  };
}

export async function updateHome(_: FormState, form: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { message: "Tu sesión terminó. Vuelve a entrar." };
  if (!canSaveMissions()) return { message: "Falta BLOB_READ_WRITE_TOKEN: no se puede guardar." };
  const image = form.get("hero");
  let hero: File | null = null;
  if (image instanceof File && image.size > 0) {
    const problem = photoProblem(image);
    if (problem) return { message: problem };
    hero = image;
  }
  await saveHome(String(form.get("lead") ?? ""), String(form.get("leadEn") ?? ""), hero, form.get("resetHero") === "1");
  refresh();
  return { ok: true, message: "Guardado. El home ya muestra los cambios." };
}

export async function updateSeasons(_: FormState, form: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { message: "Tu sesión terminó. Vuelve a entrar." };
  if (!canSaveMissions()) return { message: "Falta BLOB_READ_WRITE_TOKEN: no se puede guardar." };
  const seasons: SeasonSettings = {};
  for (const id of SEASON_IDS) {
    const start = String(form.get(`${id}-start`) ?? "");
    const end = String(form.get(`${id}-end`) ?? "");
    const enabled = form.get(`${id}-enabled`) === "on";
    if (!start || !end) {
      if (enabled)
        return {
          message: "Pon la fecha de inicio y de fin de cada tema habilitado.",
        };
      continue;
    }
    if (end < start) return { message: "La fecha de fin no puede ser antes de la de inicio." };
    seasons[id] = { enabled, start, end };
  }
  await saveSeasons(seasons);
  refresh();
  return {
    ok: true,
    message: "Guardado. Los mapas se decoran al abrir el juego (en menos de un minuto).",
  };
}

/** Crea o cambia una pauta: empresa, logo, enlace, vigencia, mapas y ciudades. */
export async function updateAd(_: FormState, form: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { message: "Tu sesión terminó. Vuelve a entrar." };
  if (!canSaveMissions()) return { message: "Falta BLOB_READ_WRITE_TOKEN: no se puede guardar." };
  const isNew = !String(form.get("id") ?? "");
  const ad = sanitizeAd({
    id: isNew ? newAdId() : String(form.get("id")),
    company: form.get("company"),
    link: form.get("link"),
    start: form.get("start"),
    end: form.get("end"),
    missions: form.getAll("missions").map(String),
    cities: form.getAll("cities").map(String),
    billboards: form.get("billboards"),
    facades: form.get("facades"),
    lobby: form.get("lobby"),
    enabled: form.get("enabled") === "on",
  });
  if (!ad)
    return {
      message: "Revisa los datos: empresa, fecha de inicio y una fecha de fin igual o posterior.",
    };
  if (String(form.get("billboards")) !== String(ad.billboards) || String(form.get("facades")) !== String(ad.facades) || String(form.get("lobby")) !== String(ad.lobby)) {
    return {
      message: `Usa números enteros: de 0 a ${MAX_AD_SPACES.billboards} vallas, de 0 a ${MAX_AD_SPACES.facades} fachadas y de 0 a ${MAX_AD_SPACES.lobby} en el lobby.`,
    };
  }
  if (ad.billboards + ad.facades + ad.lobby === 0) return { message: "La pauta necesita al menos una valla, una fachada o un espacio en el lobby." };
  const logo = form.get("logo");
  let file: File | null = null;
  if (logo instanceof File && logo.size > 0) {
    const problem = photoProblem(logo);
    if (problem) return { message: problem };
    file = logo;
  }
  if (isNew && !file) return { message: "Sube el logo de la empresa." };
  await saveAd(ad, file);
  refresh();
  return {
    ok: true,
    message: isNew ? "Pauta creada. El juego la muestra en sus vallas y fachadas en las fechas elegidas." : "Pauta guardada.",
  };
}

export async function removeAd(_: FormState, form: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { message: "Tu sesión terminó. Vuelve a entrar." };
  if (!canSaveMissions()) return { message: "Falta BLOB_READ_WRITE_TOKEN: no se puede guardar." };
  await deleteAd(String(form.get("id") ?? ""));
  refresh();
  return { ok: true, message: "Pauta eliminada." };
}
