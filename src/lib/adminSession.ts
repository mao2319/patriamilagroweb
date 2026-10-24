import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

// Sesión del módulo de administración: un solo administrador (ADMIN_EMAIL y
// ADMIN_PASSWORD, variables de entorno) y una cookie httpOnly firmada con la
// contraseña. Cambiar la contraseña cierra todas las sesiones abiertas.

const COOKIE = "firme_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8;

const password = () => process.env.ADMIN_PASSWORD ?? "";
const email = () => (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
export const adminEnabled = () => password().length >= 8 && email().includes("@");

function sameText(a: string, b: string) {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

function token(issuedAt: number) {
  return `${issuedAt}.${createHmac("sha256", password()).update(`firme-admin:${issuedAt}`).digest("hex")}`;
}

export function credentialsMatch(candidateEmail: string, candidatePassword: string) {
  if (!adminEnabled()) return false;
  // Se comparan los dos siempre, para no revelar cuál de los dos falló.
  const emailOk = sameText(candidateEmail.trim().toLowerCase(), email());
  const passwordOk = sameText(candidatePassword, password());
  return emailOk && passwordOk;
}

export async function startSession() {
  (await cookies()).set(COOKIE, token(Date.now()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  // La sesión depende de la hora de cada pedido: nunca se prerenderiza.
  await connection();
  if (!adminEnabled()) return false;
  const value = (await cookies()).get(COOKIE)?.value ?? "";
  const issuedAt = Number(value.split(".")[0]);
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > MAX_AGE_SECONDS * 1000) return false;
  return sameText(value, token(issuedAt));
}
