import Link from "next/link";
import type { ReactNode } from "react";

// Envoltura de las páginas legales (borradores para revisar antes de publicar).
export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 sm:px-8">
      <Link href="/jugar" className="self-start underline underline-offset-4">
        Volver al juego
      </Link>
      <h1 className="text-3xl font-black">{title}</h1>
      <p className="rounded-2xl border border-accent/60 p-4 text-sm text-muted">
        Borrador. Este texto debe revisarlo un abogado antes de publicar el juego. Última actualización: {updated}.
      </p>
      <div className="flex flex-col gap-4 leading-relaxed [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_ul]:list-disc [&_ul]:pl-6">{children}</div>
    </main>
  );
}
