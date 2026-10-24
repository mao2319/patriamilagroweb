import type { Metadata } from "next";
import { Suspense } from "react";
import { adminEnabled, isAdmin } from "@/lib/adminSession";
import { canSaveMissions, getGameContent } from "@/lib/missionStore";
import { listAdRequests } from "@/lib/adRequests";
import { todayInColombia } from "@/lib/seasons";
import { AdsEditor, HomeEditor, LoginForm, LogoutButton, MissionEditor, PhrasesEditor, SeasonEditor, SplashEditor } from "./AdminForms";

export const metadata: Metadata = {
  title: "Administración · Firme por la Patria",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Administración de misiones</h1>
      <Suspense fallback={<p className="text-muted">Cargando…</p>}>
        <AdminContent />
      </Suspense>
    </main>
  );
}

async function AdminContent() {
  if (!adminEnabled()) {
    return (
      <p className="rounded-2xl bg-surface p-5 text-muted">
        El módulo está apagado. Define las variables de entorno <code className="text-foreground">ADMIN_EMAIL</code> y{" "}
        <code className="text-foreground">ADMIN_PASSWORD</code> (mínimo 8 caracteres) en <code className="text-foreground">.env.local</code> y en Vercel, y
        reinicia el servidor.
      </p>
    );
  }
  if (!(await isAdmin())) return <LoginForm />;

  const [{ missions, splashUrl, home, seasons, season, ads, phrases }, requests] = await Promise.all([getGameContent(), listAdRequests()]);
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted">
          Cambia la portada del home, la imagen del splash, los temas de temporada, las pautas publicitarias, las voces y mensajes de los delincuentes y la
          foto, el título, la misión y la descripción de cada mapa. El juego toma los cambios al abrirse.
        </p>
        <LogoutButton />
      </div>
      {!canSaveMissions() && (
        <p className="rounded-2xl border border-danger p-4">Falta BLOB_READ_WRITE_TOKEN: puedes ver las misiones, pero no guardar cambios.</p>
      )}
      <HomeEditor home={home} />
      <SplashEditor splashUrl={splashUrl} />
      <SeasonEditor seasons={seasons} active={season} />
      <AdsEditor ads={ads} missions={missions} requests={requests} today={todayInColombia()} />
      <PhrasesEditor phrases={phrases} />
      <h2 className="mt-2 text-xl font-bold">Misiones</h2>
      <div className="flex flex-col gap-6">
        {missions.map((mission) => (
          <MissionEditor key={mission.id} mission={mission} />
        ))}
      </div>
    </>
  );
}
