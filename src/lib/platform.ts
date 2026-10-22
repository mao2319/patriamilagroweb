// Detección de plataforma para PRIORIZAR el botón de la tienda adecuada. No se
// usa para seguridad ni para bloquear la demo: ante la duda, «desconocida» y se
// muestran todas las opciones.

import type { StoreId } from "@/config/stores";

export type Platform = "ios" | "android" | "desktop" | "mobile" | "unknown";

interface PlatformHints {
  userAgent?: string;
  // navigator.userAgentData.platform (Chromium), cuando existe.
  uaPlatform?: string;
  // navigator.maxTouchPoints: el iPad moderno se presenta como Mac de escritorio.
  maxTouchPoints?: number;
  // matchMedia("(pointer: coarse)").matches
  coarsePointer?: boolean;
}

export function detectPlatform({ userAgent = "", uaPlatform, maxTouchPoints = 0, coarsePointer = false }: PlatformHints): Platform {
  const platform = uaPlatform?.toLowerCase() ?? "";
  if (platform === "android" || /android/i.test(userAgent)) return "android";
  if (platform === "ios" || /iphone|ipad|ipod/i.test(userAgent)) return "ios";
  // iPadOS 13+ dice ser «Macintosh»: se distingue por la pantalla táctil.
  if (/macintosh/i.test(userAgent) && maxTouchPoints > 1) return "ios";
  if (coarsePointer || /mobi/i.test(userAgent)) return "mobile";
  if (userAgent || platform) return "desktop";
  return "unknown";
}

// Lee las pistas del navegador actual (solo en el cliente).
export function currentPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  return detectPlatform({
    userAgent: nav.userAgent,
    uaPlatform: nav.userAgentData?.platform,
    maxTouchPoints: nav.maxTouchPoints,
    coarsePointer: typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches,
  });
}

// Orden de los botones de descarga: primero la tienda del dispositivo.
export function storeOrder(platform: Platform): StoreId[] {
  if (platform === "ios") return ["appStore", "googlePlay", "roblox"];
  if (platform === "android") return ["googlePlay", "appStore", "roblox"];
  return ["appStore", "googlePlay", "roblox"];
}
