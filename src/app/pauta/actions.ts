"use server";

import { headers } from "next/headers";
import { saveAdRequest, requestLogoProblem } from "@/lib/adRequests";
import { CONTACT } from "@/config/contact";

export interface AdRequestState {
  ok?: boolean;
  message?: string;
  /** Enlace de WhatsApp con el mensaje listo (empresa, ciudad y logo). */
  whatsapp?: string;
}

// Freno sencillo para el formulario público: pocas solicitudes por conexión.
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function tooMany(key: string): boolean {
  const now = Date.now();
  const times = (recent.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  times.push(now);
  recent.set(key, times);
  return times.length > MAX_PER_WINDOW;
}

/** Solicitud de pauta del home: guarda empresa, ciudad y logo, y arma el mensaje de WhatsApp. */
export async function requestAd(_: AdRequestState, form: FormData): Promise<AdRequestState> {
  // Campo trampa: las personas no lo ven ni lo llenan.
  if (String(form.get("sitio") ?? "")) return { message: "No se pudo enviar." };
  const company = String(form.get("company") ?? "")
    .trim()
    .slice(0, 80);
  const city = String(form.get("city") ?? "")
    .trim()
    .slice(0, 60);
  if (company.length < 2) return { message: "Escribe el nombre de la empresa." };
  if (city.length < 2) return { message: "Escribe la ciudad." };
  const logo = form.get("logo");
  const file = logo instanceof File && logo.size > 0 ? logo : null;
  if (file) {
    const problem = requestLogoProblem(file);
    if (problem) return { message: problem };
  }
  const from = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (tooMany(from))
    return {
      message: "Ya recibimos varias solicitudes desde aquí. Escríbenos directo por WhatsApp.",
    };

  let logoUrl: string | null = null;
  try {
    logoUrl = (await saveAdRequest(company, city, file)).logoUrl;
  } catch (error) {
    // Si no se pudo guardar, igual se arma el mensaje (el logo se manda por el chat).
    console.error("[pauta]", error);
  }
  const lines = [
    `¡Hola, Mauricio! Quiero pautar con ${CONTACT.company} en Firme por la Patria Game y recibir un presupuesto.`,
    `Empresa: ${company}`,
    `Ciudad: ${city}`,
    logoUrl ? `Logo: ${logoUrl}` : "Logo: te lo envío por este chat.",
  ];
  return {
    ok: true,
    message: "¡Listo! Abre WhatsApp para enviar tu solicitud.",
    whatsapp: `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`,
  };
}
