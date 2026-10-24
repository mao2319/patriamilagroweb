import Link from "next/link";
import { cache, Suspense } from "react";
import StoreButtons from "@/components/StoreButtons";
import Advertise from "@/components/home/Advertise";
import Contact from "@/components/home/Contact";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import MissionCards from "@/components/home/MissionCards";
import { DEFAULT_LOCALE, getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { getGameContent } from "@/lib/missionStore";
import { DEFAULT_MISSIONS } from "@/lib/missions";

// Lo editado en /admin (portada, texto y misiones), leído una vez por visita.
const content = cache(getGameContent);

// Home de la demo: portada del juego, misiones, cómo se juega, pauta y tiendas. Lo
// que viene de /admin llega por streaming; mientras tanto se ve lo de fábrica.
export default function Home() {
  const t = getDictionary(DEFAULT_LOCALE);
  return (
    <main className="flex flex-1 flex-col">
      <Suspense fallback={<Hero t={t} heroUrl={null} lead={t.home.lead} />}>
        <HeroFromAdmin t={t} />
      </Suspense>

      <section id="misiones" aria-labelledby="misiones-titulo" className="mx-auto flex w-full max-w-6xl scroll-mt-6 flex-col gap-6 px-4 py-14 sm:px-8">
        <div className="flex flex-col gap-2">
          <h2 id="misiones-titulo" className="font-display text-4xl sm:text-5xl">
            {t.home.missionsTitle}
          </h2>
          <p className="max-w-2xl text-lg text-muted">{t.home.missionsLead}</p>
        </div>
        <Suspense fallback={<MissionCards t={t} missions={DEFAULT_MISSIONS} />}>
          <MissionsFromAdmin t={t} />
        </Suspense>
      </section>

      <section aria-labelledby="como-se-juega" className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-8">
        <h2 id="como-se-juega" className="font-display text-4xl sm:text-5xl">
          {t.home.howTo}
        </h2>
        <Features t={t} />
      </section>

      <Advertise t={t} />

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8">
        <div className="flex flex-col gap-8 rounded-[2rem] border-4 border-game-violet bg-[radial-gradient(ellipse_at_top_right,#7b5cff_0%,#3b2a9c_55%,#22175e_100%)] p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5">
            <p className="font-display text-3xl sm:text-4xl">{t.home.fullVersion}</p>
            <StoreButtons t={t} />
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-center lg:text-center">
            <p className="text-lg font-semibold">{t.home.finalCta}</p>
            <Link
              href="/jugar"
              className="game-button inline-flex min-h-16 items-center rounded-2xl border-4 border-white bg-accent px-10 font-display text-3xl uppercase tracking-wide text-accent-ink"
            >
              {t.home.play}
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-auto flex w-full max-w-6xl flex-col gap-5 border-t border-foreground/10 px-4 py-8 sm:px-8">
        <Contact t={t} />
        <p className="text-sm text-muted">{t.footer.fiction}</p>
      </footer>
    </main>
  );
}

async function HeroFromAdmin({ t }: { t: Dictionary }) {
  const { home } = await content();
  return <Hero t={t} heroUrl={home.heroUrl} lead={home.lead || t.home.lead} />;
}

async function MissionsFromAdmin({ t }: { t: Dictionary }) {
  const { missions } = await content();
  return <MissionCards t={t} missions={missions} />;
}
