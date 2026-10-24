import { head, put } from "@vercel/blob";
import { connection } from "next/server";
import { canSaveMissions, photoProblem, uploadPublicImage } from "@/lib/missionStore";

// Solicitudes de pauta que llegan del home (empresa, ciudad y logo). Se guardan
// en su propio archivo del Blob (las últimas 200) para verlas en /admin; el
// presupuesto se conversa por WhatsApp.

const REQUESTS_PATH = "pautas/solicitudes.json";
const MAX_REQUESTS = 200;
/** Logos de las solicitudes: livianos (el formulario es público). */
export const MAX_REQUEST_LOGO_BYTES = 1024 * 1024;

export interface AdRequest {
  company: string;
  city: string;
  logoUrl: string | null;
  createdAt: string;
}

export async function listAdRequests(): Promise<AdRequest[]> {
  if (!canSaveMissions()) return [];
  await connection();
  try {
    const blob = await head(REQUESTS_PATH);
    const response = await fetch(`${blob.url}?t=${Date.now()}`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as AdRequest[]).slice(0, MAX_REQUESTS) : [];
  } catch {
    return [];
  }
}

/** Revisa el logo de una solicitud: imagen JPG, PNG o WebP de hasta 1 MB. */
export function requestLogoProblem(file: File): string | null {
  const problem = photoProblem(file);
  if (problem) return problem;
  return file.size > MAX_REQUEST_LOGO_BYTES ? "El logo pesa más de 1 MB." : null;
}

export async function saveAdRequest(company: string, city: string, logo: File | null): Promise<AdRequest> {
  const request: AdRequest = {
    company,
    city,
    logoUrl: null,
    createdAt: new Date().toISOString(),
  };
  if (!canSaveMissions()) return request;
  if (logo) request.logoUrl = await uploadPublicImage(`pautas/solicitudes/logo-${Date.now()}`, logo);
  const list = await listAdRequests();
  await put(REQUESTS_PATH, JSON.stringify([request, ...list].slice(0, MAX_REQUESTS), null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
  return request;
}
