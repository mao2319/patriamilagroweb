import Link from "next/link";
import { DEFAULT_LOCALE, getDictionary } from "@/i18n/dictionaries";

// Aquí se monta el build WebGL de Unity en la Fase 4 (carga con progreso real,
// errores y reintento). Por ahora reserva la ruta.
export default function Jugar() {
  const t = getDictionary(DEFAULT_LOCALE);
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-14 sm:px-8">
      <h1 className="text-3xl font-bold">{t.play.title}</h1>
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-surface p-6 text-center text-muted">
        {t.play.pending}
      </div>
      <Link href="/" className="self-start underline underline-offset-4">
        {t.play.back}
      </Link>
    </main>
  );
}
