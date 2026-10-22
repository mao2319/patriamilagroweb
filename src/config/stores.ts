// Enlaces a la versión completa del juego. Salen de variables de entorno
// públicas: nunca se inventa una URL. Si falta o no es válida, la tienda se
// muestra como «Próximamente» en vez de un enlace roto.

export type StoreId = "appStore" | "googlePlay" | "roblox";

export interface StoreLink {
  id: StoreId;
  // null = aún no publicada (se muestra «Próximamente»).
  url: string | null;
}

// Dominios aceptados por tienda: evita mostrar como oficial un enlace a otro sitio.
const ALLOWED_HOSTS: Record<StoreId, string[]> = {
  appStore: ["apps.apple.com"],
  googlePlay: ["play.google.com"],
  roblox: ["www.roblox.com", "roblox.com"],
};

export function validateStoreUrl(id: StoreId, raw: string | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    if (!ALLOWED_HOSTS[id].includes(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

// Next.js solo reemplaza las variables NEXT_PUBLIC_ cuando se leen de forma
// literal (process.env.NOMBRE), por eso no se arman con un índice.
export const STORE_LINKS: StoreLink[] = [
  { id: "appStore", url: validateStoreUrl("appStore", process.env.NEXT_PUBLIC_APP_STORE_URL) },
  { id: "googlePlay", url: validateStoreUrl("googlePlay", process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL) },
  { id: "roblox", url: validateStoreUrl("roblox", process.env.NEXT_PUBLIC_ROBLOX_URL) },
];
