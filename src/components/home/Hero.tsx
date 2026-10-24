import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";

const FALLBACK_ART = "/brand/escena-personajes.png";

// Portada del home: el arte del juego a todo lo ancho (el que se sube en
// /admin, que ya trae el logo) o, sin él, la escena de los personajes con el
// logo armado aquí. Abajo, el texto principal y los dos botones.
export default function Hero({ t, heroUrl, lead }: { t: Dictionary; heroUrl: string | null; lead: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_50%_20%,#8b7bff_0%,#5b45d6_45%,#2a1a6b_100%)]">
      {heroUrl ? (
        <div className="relative mx-auto aspect-[3/2] max-h-[78vh] w-full max-w-[1400px]">
          <Image src={heroUrl} alt="" fill priority sizes="(max-width: 1400px) 100vw, 1400px" className="object-cover" />
        </div>
      ) : (
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-10 sm:pt-14">
          <Logo t={t} />
          <div className="relative -mt-4 aspect-[16/9] w-full max-w-5xl">
            <Image src={FALLBACK_ART} alt="" fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-contain object-bottom" />
          </div>
        </div>
      )}
      {/* Fundido hacia el resto de la página. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-background" />

      <div className="relative mx-auto -mt-2 flex w-full max-w-4xl flex-col items-center gap-5 px-4 pb-14 text-center sm:-mt-10">
        {heroUrl && <h1 className="sr-only">{t.home.title}</h1>}
        <p className="max-w-2xl text-lg font-medium text-foreground [text-shadow:0_2px_8px_rgba(10,5,40,0.8)] sm:text-xl">{lead}</p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/jugar"
            className="game-button inline-flex min-h-16 items-center gap-3 rounded-2xl border-4 border-white bg-accent px-10 font-display text-3xl uppercase tracking-wide text-accent-ink"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8" fill="currentColor">
              <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.4-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" />
            </svg>
            {t.home.play}
          </Link>
          <a
            href="#misiones"
            className="inline-flex min-h-14 items-center rounded-2xl border-2 border-foreground/70 bg-black/30 px-7 text-lg font-bold backdrop-blur hover:bg-black/50"
          >
            {t.home.seeMissions}
          </a>
        </div>
      </div>
    </section>
  );
}

// Logo de texto (solo cuando no hay arte subido): «FIRME POR LA», «PATRIA»
// grande y lo que siga (p. ej. «Game») como sello.
function Logo({ t }: { t: Dictionary }) {
  const { top, big, tag } = splitTitle(t.home.title);
  return (
    <h1 className="relative z-10 flex -rotate-3 flex-col items-center pr-10 text-center font-display sm:pr-0 uppercase leading-[0.85] drop-shadow-[0_8px_0_rgba(20,10,50,0.55)]">
      <span className="game-outline text-4xl text-white sm:text-6xl">{top}</span>
      <span className="relative">
        <span className="game-outline text-7xl text-accent sm:text-[9rem]">{big}</span>
        {tag && (
          <span className="absolute -right-4 top-1 translate-x-full rotate-12 rounded-xl border-4 border-white bg-game-pink px-3 py-1 text-lg text-white sm:-right-2 sm:top-4 sm:text-3xl">
            {tag}
          </span>
        )}
      </span>
      <span aria-hidden="true" className="mt-2 flex h-3 w-56 overflow-hidden rounded-full sm:w-80">
        <span className="w-1/2 bg-[#fcd116]" />
        <span className="w-1/4 bg-[#003893]" />
        <span className="w-1/4 bg-[#ce1126]" />
      </span>
    </h1>
  );
}

// «Firme por la Patria Game» → arriba «Firme por la», grande «Patria», sello «Game».
function splitTitle(title: string): { top: string; big: string; tag: string } {
  const words = title.trim().split(/\s+/);
  const index = words.findIndex((word) => word.toLowerCase() === "patria");
  if (index < 0) return { top: "", big: title, tag: "" };
  return {
    top: words.slice(0, index).join(" "),
    big: words[index],
    tag: words.slice(index + 1).join(" "),
  };
}
