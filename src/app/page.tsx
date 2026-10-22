import Link from "next/link";
import StoreButtons from "@/components/StoreButtons";
import { DEFAULT_LOCALE, getDictionary } from "@/i18n/dictionaries";

// Presentación de la demo (versión base de la Fase 1; el diseño final es de la
// Fase 5).
export default function Home() {
  const t = getDictionary(DEFAULT_LOCALE);
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-14 px-4 py-14 sm:px-8">
      <section className="flex flex-col gap-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">{t.home.kicker}</p>
        <h1 className="text-5xl font-black leading-tight sm:text-6xl">{t.home.title}</h1>
        <p className="max-w-2xl text-lg text-muted">{t.home.lead}</p>
        <div>
          <Link href="/jugar" className="inline-flex min-h-14 items-center rounded-full bg-accent px-8 text-lg font-bold text-accent-ink">
            {t.home.play}
          </Link>
        </div>
      </section>

      <section aria-labelledby="como-se-juega" className="flex flex-col gap-6">
        <h2 id="como-se-juega" className="text-2xl font-bold">
          {t.home.howTo}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {t.home.features.map((feature) => (
            <li key={feature.title} className="rounded-2xl bg-surface p-5">
              <h3 className="mb-1 text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted">{feature.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <p className="text-lg">{t.home.fullVersion}</p>
        <StoreButtons t={t} />
      </section>

      <footer className="mt-auto border-t border-foreground/10 pt-6 text-sm text-muted">{t.footer.fiction}</footer>
    </main>
  );
}
