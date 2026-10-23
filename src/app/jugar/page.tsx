import Link from "next/link";
import GameExperience from "@/components/game/GameExperience";
import { DEFAULT_LOCALE, getDictionary } from "@/i18n/dictionaries";

// Dónde está el build WebGL de Unity. Por defecto, en este mismo sitio
// (public/unity), que es donde el hosting envía los encabezados que pide Unity.
const BUILD_URL = (process.env.NEXT_PUBLIC_UNITY_BUILD_URL || "/unity").replace(/\/$/, "");

export default function Jugar() {
  const t = getDictionary(DEFAULT_LOCALE);
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-8 sm:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">{t.play.title}</h1>
        <Link href="/" className="underline underline-offset-4">
          {t.play.back}
        </Link>
      </div>
      <GameExperience t={t} buildUrl={BUILD_URL} />
    </main>
  );
}
