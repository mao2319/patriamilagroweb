"use client";

import { useCallback, useState } from "react";
import StoreButtons from "@/components/StoreButtons";
import UnityGame from "@/components/game/UnityGame";
import type { Dictionary } from "@/i18n/dictionaries";
import { currentPlatform, storeOrder } from "@/lib/platform";
import { formatDuration, type GameEvent } from "@/lib/unityBridge";

type Completed = Extract<GameEvent, { type: "levelCompleted" }>;

// El juego y lo que pasa alrededor: cuando el nivel termina, la invitación a
// la versión completa (con la tienda del dispositivo primero). La lógica de la
// partida sigue en Unity; aquí solo se reacciona a su aviso.
export default function GameExperience({ t, buildUrl }: { t: Dictionary; buildUrl: string }) {
  const [completed, setCompleted] = useState<Completed | null>(null);

  const onGameEvent = useCallback((event: GameEvent) => {
    if (event.type === "levelCompleted") setCompleted(event);
  }, []);

  return (
    <div className="relative">
      <UnityGame t={t} buildUrl={buildUrl} onGameEvent={onGameEvent} />

      {completed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-background/90 p-4" role="dialog" aria-modal="true" aria-labelledby="resultado-titulo">
          <div className="flex w-full max-w-xl flex-col gap-5 rounded-3xl bg-surface p-6 sm:p-8">
            <h2 id="resultado-titulo" className="text-3xl font-black">
              {t.result.title}
            </h2>
            <dl className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-background p-3">
                <dt className="text-sm text-muted">{t.result.time}</dt>
                <dd className="text-2xl font-bold">{formatDuration(completed.timeSeconds)}</dd>
              </div>
              <div className="rounded-2xl bg-background p-3">
                <dt className="text-sm text-muted">{t.result.score}</dt>
                <dd className="text-2xl font-bold">{completed.score.toLocaleString("es-CO")}</dd>
              </div>
              <div className="rounded-2xl bg-background p-3">
                <dt className="text-sm text-muted">{t.result.objectives}</dt>
                <dd className="text-2xl font-bold">
                  {completed.objectivesDone}/{completed.objectivesTotal}
                </dd>
              </div>
            </dl>
            <p className="text-muted">{t.result.demo}</p>
            <StoreButtons t={t} order={storeOrder(currentPlatform())} />
            <button type="button" onClick={() => setCompleted(null)} className="self-start text-sm underline underline-offset-4">
              {t.result.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
