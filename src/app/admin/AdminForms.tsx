"use client";

import { useActionState, useState } from "react";
import type { HomeContent } from "@/lib/missionStore";
import { MAX_SUSPECTS, MIN_SUSPECTS, type Mission } from "@/lib/missions";
import { AD_CITIES, DEFAULT_AD_SPACES, MAX_AD_SPACES, type Ad } from "@/lib/ads";
import type { AdRequest } from "@/lib/adRequests";
import { SEASON_THEMES, suggestedDates, type SeasonId, type SeasonSettings } from "@/lib/seasons";
import { MAX_PHRASE_LENGTH, MAX_PHRASES, NAME_TOKEN, type GamePhrases } from "@/lib/phrases";
import { login, logout, removeAd, updateAd, updateHome, updateMission, updatePhrases, updateSeasons, updateSplash, type FormState } from "./actions";

const field = "w-full rounded-xl border border-white/15 bg-background px-3 py-2 text-foreground";
const button = "rounded-full bg-accent px-5 py-2 font-bold text-accent-ink disabled:opacity-60";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="flex max-w-sm flex-col gap-3 rounded-2xl bg-surface p-5">
      <label htmlFor="email" className="font-semibold">
        Correo
      </label>
      <input id="email" name="email" type="email" autoComplete="username" required className={field} />
      <label htmlFor="password" className="font-semibold">
        Contraseña
      </label>
      <input id="password" name="password" type="password" autoComplete="current-password" required className={field} />
      {state.message && (
        <p role="alert" className="text-danger">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className={button}>
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

export function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="text-sm underline underline-offset-4">
        Cerrar sesión
      </button>
    </form>
  );
}

const texts: { name: keyof Mission; label: string; long?: boolean }[] = [
  { name: "title", label: "Título (español)" },
  { name: "titleEn", label: "Título (inglés)" },
  { name: "mission", label: "Misión (español)", long: true },
  { name: "missionEn", label: "Misión (inglés)", long: true },
  { name: "description", label: "Descripción (español)", long: true },
  { name: "descriptionEn", label: "Descripción (inglés)", long: true },
];

export function MissionEditor({ mission }: { mission: Mission }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateMission, {});
  const [preview, setPreview] = useState<string | null>(null);
  const photo = preview ?? mission.photoUrl;

  return (
    <form action={action} className="grid gap-5 rounded-3xl bg-surface p-5 sm:p-6 md:grid-cols-[280px_1fr]">
      <input type="hidden" name="id" value={mission.id} />
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">{mission.city}</h2>
        <div className="aspect-[16/10] overflow-hidden rounded-2xl border-4 border-[#7b5cff] bg-background">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:) o del Blob
            <img src={photo} alt={`Foto de ${mission.city}`} className="h-full w-full object-cover" />
          ) : (
            <p className="flex h-full items-center justify-center p-4 text-center text-sm text-muted">Sin foto todavía</p>
          )}
        </div>
        <label className="text-sm font-semibold" htmlFor={`photo-${mission.id}`}>
          Foto (JPG, PNG o WebP, máx. 4 MB)
        </label>
        <input
          id={`photo-${mission.id}`}
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="text-sm"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
        />
        <label className="text-sm font-semibold" htmlFor={`status-${mission.id}`}>
          Estado
        </label>
        <select id={`status-${mission.id}`} name="status" defaultValue={mission.status} className={field} disabled={!mission.levelId}>
          <option value="playable">Jugable</option>
          <option value="soon">Próximamente</option>
        </select>
        {!mission.levelId && <p className="text-xs text-muted">Este mapa aún no tiene nivel en el juego: queda en «Próximamente».</p>}
        <label className="text-sm font-semibold" htmlFor={`suspects-${mission.id}`}>
          Delincuentes a capturar
        </label>
        <input
          id={`suspects-${mission.id}`}
          name="suspects"
          type="number"
          inputMode="numeric"
          min={MIN_SUSPECTS}
          max={MAX_SUSPECTS}
          defaultValue={mission.suspects}
          className={field}
        />
        <p className="text-xs text-muted">
          De {MIN_SUSPECTS} a {MAX_SUSPECTS}. El juego ajusta el contador y los textos de la misión.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {texts.map(({ name, label, long }) => (
          <div key={name} className="flex flex-col gap-1">
            <label className="text-sm font-semibold" htmlFor={`${name}-${mission.id}`}>
              {label}
            </label>
            {long ? (
              <textarea id={`${name}-${mission.id}`} name={name} defaultValue={String(mission[name] ?? "")} rows={2} maxLength={400} className={field} />
            ) : (
              <input id={`${name}-${mission.id}`} name={name} defaultValue={String(mission[name] ?? "")} maxLength={400} className={field} />
            )}
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={pending} className={button}>
            {pending ? "Guardando…" : "Guardar"}
          </button>
          {state.message && (
            <p role="status" className={state.ok ? "text-accent" : "text-danger"}>
              {state.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

/** Vista previa de la imagen de fábrica (la escena de los personajes del juego) cuando no hay una subida. */
function FactoryArt({ label }: { label: string }) {
  return (
    <div className="relative h-full w-full">
      {/* eslint-disable-next-line @next/next/no-img-element -- vista previa fija del arte de fábrica */}
      <img src={FACTORY_ART} alt={label} className="h-full w-full object-cover" />
      <p className="absolute bottom-2 left-2 rounded-full bg-background/85 px-3 py-1 text-xs font-semibold">{label}</p>
    </div>
  );
}

const FACTORY_ART = "/brand/escena-personajes.png";

/** Frases de captura (voz) y mensajes al acercarse a un delincuente, una por línea. */
export function PhrasesEditor({ phrases }: { phrases: GamePhrases }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updatePhrases, {});
  const area = "min-h-40 w-full rounded-2xl border border-white/15 bg-background p-3 text-sm";

  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-surface p-5 sm:p-6" aria-labelledby="frases-titulo">
      <div className="flex flex-col gap-1">
        <h2 id="frases-titulo" className="text-xl font-bold">
          Voces y mensajes de los delincuentes
        </h2>
        <p className="text-sm text-muted">
          Una frase por línea (máx. {MAX_PHRASES} y {MAX_PHRASE_LENGTH} caracteres). Escribe <code className="text-foreground">{NAME_TOKEN}</code> donde va
          el alias del delincuente. Se suman a las que ya trae el juego y salen al azar.
        </p>
      </div>
      <form action={action} className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="frases-captura">
              Al capturarlo (las dice la voz)
            </label>
            <textarea
              id="frases-captura"
              name="capture"
              defaultValue={phrases.capture.join("\n")}
              placeholder={`¡Hasta aquí llegaste, ${NAME_TOKEN}!`}
              className={area}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="frases-acercarse">
              Al acercarte (cuando te ve y huye, y en el globo al perseguirlo)
            </label>
            <textarea
              id="frases-acercarse"
              name="approach"
              defaultValue={phrases.approach.join("\n")}
              placeholder={`¡No corras, ${NAME_TOKEN}, que te alcanzo!`}
              className={area}
            />
          </div>
        </div>
        <button type="submit" disabled={pending} className={`${button} self-start`}>
          {pending ? "Guardando…" : "Guardar frases"}
        </button>
        {state.message && (
          <p role="status" className={state.ok ? "text-accent" : "text-danger"}>
            {state.message}
          </p>
        )}
      </form>
    </section>
  );
}

export function SplashEditor({ splashUrl }: { splashUrl: string | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateSplash, {});
  const [preview, setPreview] = useState<string | null>(null);
  const image = preview ?? splashUrl;

  return (
    <section className="grid gap-5 rounded-3xl bg-surface p-5 sm:p-6 md:grid-cols-[1fr_280px]" aria-labelledby="splash-titulo">
      <div className="flex flex-col gap-3">
        <h2 id="splash-titulo" className="text-xl font-bold">
          Pantalla de presentación (splash)
        </h2>
        <div className="aspect-video overflow-hidden rounded-2xl border-4 border-[#7b5cff] bg-background">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:) o del Blob
            <img src={image} alt="Imagen del splash" className="h-full w-full object-cover" />
          ) : (
            <FactoryArt label="Presentación de fábrica (personajes y logo del juego)" />
          )}
        </div>
      </div>
      <form action={action} className="flex flex-col justify-end gap-3">
        <p className="text-sm text-muted">
          Horizontal (16:9), con el logo dentro de la imagen. Se muestra completa, sin recortes, unos 2 segundos al abrir el juego. JPG, PNG o WebP, máx. 4 MB;
          mejor menos de 1 MB para que cargue rápido.
        </p>
        <label className="text-sm font-semibold" htmlFor="splash-image">
          Nueva imagen
        </label>
        <input
          id="splash-image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="text-sm"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
        />
        <button type="submit" disabled={pending} className={button}>
          {pending ? "Guardando…" : "Guardar splash"}
        </button>
        {splashUrl && (
          <button type="submit" name="reset" value="1" disabled={pending} className="text-sm underline underline-offset-4">
            Volver a la de fábrica
          </button>
        )}
        {state.message && (
          <p role="status" className={state.ok ? "text-accent" : "text-danger"}>
            {state.message}
          </p>
        )}
      </form>
    </section>
  );
}

export function HomeEditor({ home }: { home: HomeContent }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateHome, {});
  const [preview, setPreview] = useState<string | null>(null);
  const image = preview ?? home.heroUrl;

  return (
    <section className="grid gap-5 rounded-3xl bg-surface p-5 sm:p-6 md:grid-cols-[1fr_320px]" aria-labelledby="home-titulo">
      <div className="flex flex-col gap-3">
        <h2 id="home-titulo" className="text-xl font-bold">
          Portada del home
        </h2>
        <div className="aspect-[3/2] overflow-hidden rounded-2xl border-4 border-[#7b5cff] bg-background">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:) o del Blob
            <img src={image} alt="Portada del home" className="h-full w-full object-cover" />
          ) : (
            <FactoryArt label="Portada de fábrica (personajes del juego)" />
          )}
        </div>
      </div>
      <form action={action} className="flex flex-col justify-end gap-3">
        <label className="text-sm font-semibold" htmlFor="home-hero">
          Imagen de portada (horizontal, con el logo)
        </label>
        <input
          id="home-hero"
          name="hero"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="text-sm"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
        />
        {home.heroUrl && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="resetHero" value="1" /> Volver a la portada de fábrica
          </label>
        )}
        <label className="text-sm font-semibold" htmlFor="home-lead">
          Texto principal (español)
        </label>
        <textarea
          id="home-lead"
          name="lead"
          defaultValue={home.lead}
          rows={3}
          maxLength={300}
          placeholder="Vacío: se arma solo con las misiones disponibles"
          className={field}
        />
        <label className="text-sm font-semibold" htmlFor="home-lead-en">
          Texto principal (inglés)
        </label>
        <textarea id="home-lead-en" name="leadEn" defaultValue={home.leadEn} rows={3} maxLength={300} className={field} />
        <button type="submit" disabled={pending} className={button}>
          {pending ? "Guardando…" : "Guardar portada"}
        </button>
        {state.message && (
          <p role="status" className={state.ok ? "text-accent" : "text-danger"}>
            {state.message}
          </p>
        )}
      </form>
    </section>
  );
}

export function SeasonEditor({ seasons, active }: { seasons: SeasonSettings; active: SeasonId | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateSeasons, {});
  const activeName = SEASON_THEMES.find((theme) => theme.id === active)?.name;

  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-surface p-5 sm:p-6" aria-labelledby="temporada-titulo">
      <div className="flex flex-col gap-1">
        <h2 id="temporada-titulo" className="text-xl font-bold">
          Temas de temporada
        </h2>
        <p className="text-sm text-muted">
          Habilita un tema y elige sus fechas: entre esas fechas los mapas del juego se decoran con sus objetos. Si dos temas se cruzan, va el primero de la
          lista.
        </p>
        <p className="text-sm font-semibold" role="status">
          {activeName ? `Hoy se ve: ${activeName}` : "Hoy no hay ningún tema activo."}
        </p>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <ul className="flex flex-col gap-3">
          {SEASON_THEMES.map((theme) => {
            const setting = seasons[theme.id];
            const dates = setting ?? suggestedDates(theme);
            return (
              <li key={theme.id} className="grid gap-3 rounded-2xl border border-white/10 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
                <label className="flex items-start gap-3">
                  <input type="checkbox" name={`${theme.id}-enabled`} defaultChecked={setting?.enabled ?? false} className="mt-1 size-5" />
                  <span>
                    <span className="block font-bold">{theme.name}</span>
                    <span className="block text-sm text-muted">{theme.description}</span>
                  </span>
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold">
                  Desde
                  <input type="date" name={`${theme.id}-start`} defaultValue={dates.start} className={field} />
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold">
                  Hasta
                  <input type="date" name={`${theme.id}-end`} defaultValue={dates.end} className={field} />
                </label>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={pending} className={button}>
            {pending ? "Guardando…" : "Guardar temas"}
          </button>
          {state.message && (
            <p role="status" className={state.ok ? "text-accent" : "text-danger"}>
              {state.message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

/** Pautas publicitarias: la lista (cada una editable) y el formulario para crear una nueva. */
export function AdsEditor({ ads, missions, requests, today }: { ads: Ad[]; missions: Mission[]; requests: AdRequest[]; today: string }) {
  return (
    <section className="flex flex-col gap-5 rounded-3xl bg-surface p-5 sm:p-6" aria-labelledby="pautas-titulo">
      <div className="flex flex-col gap-1">
        <h2 id="pautas-titulo" className="text-xl font-bold">
          Pautas publicitarias
        </h2>
        <p className="text-sm text-muted">
          El logo de cada pauta aparece en las vallas y fachadas de edificios que ocupa en cada mapa elegido, entre las fechas de inicio y fin, para los
          jugadores de las ciudades marcadas (sin ciudades: todas). Con «Lobby», también sale en las vallas del lobby (en todos los mapas). Cada mapa muestra
          al menos 2 vallas y 1 fachada, y el lobby 2 vallas; las que no tengan pauta dicen «Pauta aquí».
        </p>
      </div>
      <details className="rounded-2xl border-2 border-accent p-4" open={ads.length === 0}>
        <summary className="cursor-pointer font-bold">+ Crear nueva pauta</summary>
        <AdForm missions={missions} today={today} />
      </details>
      {ads.length > 0 && (
        <ul className="flex flex-col gap-4">
          {ads.map((ad) => {
            const status = adStatus(ad, today);
            return (
              <li key={ad.id}>
                <details className="rounded-2xl border border-white/15 p-4">
                  <summary className="flex cursor-pointer flex-wrap items-center gap-3">
                    {ad.logoUrl && (
                      // eslint-disable-next-line @next/next/no-img-element -- logo del Blob
                      <img src={ad.logoUrl} alt="" className="h-10 w-10 rounded-lg bg-white object-contain" />
                    )}
                    <span className="font-bold">{ad.company}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{spacesLabel(ad)}</span>
                    <span className="text-sm text-muted">
                      {ad.start} → {ad.end}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${status.style}`}>{status.label}</span>
                  </summary>
                  <AdForm ad={ad} missions={missions} today={today} />
                  <DeleteAd id={ad.id} />
                </details>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="font-bold">Solicitudes desde el home ({requests.length})</h3>
        {requests.length === 0 ? (
          <p className="text-sm text-muted">Todavía no hay solicitudes. Llegan del formulario «Pauta con nosotros» del home.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {requests.slice(0, 30).map((request) => (
              <li key={request.createdAt + request.company} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 px-3 py-2 text-sm">
                {request.logoUrl ? (
                  <a href={request.logoUrl} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element -- logo enviado en la solicitud */}
                    <img src={request.logoUrl} alt={`Logo de ${request.company}`} className="h-9 w-9 rounded bg-white object-contain" />
                  </a>
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded bg-background text-xs text-muted">—</span>
                )}
                <span className="font-semibold">{request.company}</span>
                <span className="text-muted">{request.city}</span>
                <span className="ml-auto text-xs text-muted">
                  {new Date(request.createdAt).toLocaleString("es-CO", {
                    timeZone: "America/Bogota",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/** «2 vallas · 1 fachada». */
function spacesLabel(ad: Ad) {
  const parts = [];
  if (ad.billboards > 0) parts.push(`${ad.billboards} ${ad.billboards === 1 ? "valla" : "vallas"}`);
  if (ad.facades > 0) parts.push(`${ad.facades} ${ad.facades === 1 ? "fachada" : "fachadas"}`);
  if (ad.lobby > 0) parts.push(`${ad.lobby} en el lobby`);
  return parts.join(" · ");
}

function adStatus(ad: Ad, today: string) {
  if (!ad.enabled) return { label: "Pausada", style: "bg-white/15" };
  if (today < ad.start) return { label: "Programada", style: "bg-game-blue text-white" };
  if (today > ad.end) return { label: "Vencida", style: "bg-danger text-white" };
  return { label: "Al aire", style: "bg-game-green text-white" };
}

function AdForm({ ad, missions, today }: { ad?: Ad; missions: Mission[]; today: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateAd, {});
  const [preview, setPreview] = useState<string | null>(null);
  const key = ad?.id ?? "nueva";
  const logo = preview ?? ad?.logoUrl ?? null;
  return (
    <form action={action} className="mt-4 grid gap-4 md:grid-cols-2">
      <input type="hidden" name="id" value={ad?.id ?? ""} />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold" htmlFor={`company-${key}`}>
          Empresa
        </label>
        <input id={`company-${key}`} name="company" required maxLength={80} defaultValue={ad?.company} className={field} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold" htmlFor={`link-${key}`}>
          Link o red social
        </label>
        <input id={`link-${key}`} name="link" maxLength={300} defaultValue={ad?.link} placeholder="https://instagram.com/marca" className={field} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold" htmlFor={`start-${key}`}>
          Fecha de inicio
        </label>
        <input id={`start-${key}`} name="start" type="date" required defaultValue={ad?.start ?? today} className={field} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold" htmlFor={`end-${key}`}>
          Fecha de fin
        </label>
        <input id={`end-${key}`} name="end" type="date" required defaultValue={ad?.end} className={field} />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" htmlFor={`logo-${key}`}>
          Logo de la empresa {ad ? "(sube uno nuevo para cambiarlo)" : ""}
        </label>
        <div className="flex items-center gap-3">
          {logo && (
            // eslint-disable-next-line @next/next/no-img-element -- vista previa del logo
            <img src={logo} alt="" className="h-14 w-14 rounded-lg bg-white object-contain" />
          )}
          <input
            id={`logo-${key}`}
            name="logo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="min-w-0 text-sm"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
          />
        </div>
        <p className="text-xs text-muted">Mejor horizontal (vallas y fachadas son 2:1) y con fondo. JPG, PNG o WebP, máx. 4 MB.</p>
      </div>
      <fieldset className="flex flex-wrap gap-4">
        <legend className="mb-1 text-sm font-semibold">Espacios en cada mapa y en el lobby</legend>
        <div className="flex flex-col gap-1">
          <label className="text-sm" htmlFor={`billboards-${key}`}>
            Vallas
          </label>
          <input
            id={`billboards-${key}`}
            name="billboards"
            type="number"
            min={0}
            max={MAX_AD_SPACES.billboards}
            step={1}
            required
            defaultValue={ad?.billboards ?? DEFAULT_AD_SPACES.billboards}
            className={`${field} w-24`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm" htmlFor={`facades-${key}`}>
            Fachadas
          </label>
          <input
            id={`facades-${key}`}
            name="facades"
            type="number"
            min={0}
            max={MAX_AD_SPACES.facades}
            step={1}
            required
            defaultValue={ad?.facades ?? DEFAULT_AD_SPACES.facades}
            className={`${field} w-24`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm" htmlFor={`lobby-${key}`}>
            Lobby
          </label>
          <input
            id={`lobby-${key}`}
            name="lobby"
            type="number"
            min={0}
            max={MAX_AD_SPACES.lobby}
            step={1}
            required
            defaultValue={ad?.lobby ?? DEFAULT_AD_SPACES.lobby}
            className={`${field} w-24`}
          />
        </div>
      </fieldset>
      <label className="flex items-center gap-2 self-end text-sm font-semibold">
        <input type="checkbox" name="enabled" defaultChecked={ad?.enabled ?? true} className="size-5" /> Activa
      </label>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold">Mapas donde sale (sin marcar: todos)</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {missions.map((mission) => (
            <label key={mission.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="missions" value={mission.id} defaultChecked={ad?.missions.includes(mission.id)} className="size-4" />
              {mission.city}
              {mission.status !== "playable" && <span className="text-xs text-muted">(próximamente)</span>}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold">Ciudades de los jugadores que la ven (sin marcar: todas)</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {AD_CITIES.map((city) => (
            <label key={city} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="cities" value={city} defaultChecked={ad?.cities.includes(city)} className="size-4" />
              {city}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-wrap items-center gap-4 md:col-span-2">
        <button type="submit" disabled={pending} className={button}>
          {pending ? "Guardando…" : ad ? "Guardar pauta" : "Crear pauta"}
        </button>
        {state.message && (
          <p role="status" className={state.ok ? "text-accent" : "text-danger"}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

function DeleteAd({ id }: { id: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(removeAd, {});
  const [confirming, setConfirming] = useState(false);
  return (
    <form action={action} className="mt-3 flex flex-wrap items-center gap-3">
      <input type="hidden" name="id" value={id} />
      {confirming ? (
        <>
          <span className="text-sm">¿Eliminar esta pauta? Se quita de todas las vallas.</span>
          <button type="submit" disabled={pending} className="rounded-full bg-danger px-4 py-1.5 text-sm font-bold text-white">
            {pending ? "Eliminando…" : "Sí, eliminar"}
          </button>
          <button type="button" onClick={() => setConfirming(false)} className="text-sm underline">
            Cancelar
          </button>
        </>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className="text-sm text-danger underline underline-offset-4">
          Eliminar pauta
        </button>
      )}
      {state.message && <span className="text-sm">{state.message}</span>}
    </form>
  );
}
