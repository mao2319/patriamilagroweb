"use client";

import { useCallback, useState } from "react";
import StoreButtons from "@/components/StoreButtons";
import UnityGame from "@/components/game/UnityGame";
import type { Dictionary } from "@/i18n/dictionaries";
import { currentPlatform, storeOrder } from "@/lib/platform";
import { formatDuration, type GameEvent } from "@/lib/unityBridge";

type Completed = Extract<GameEvent, { type: "levelCompleted" }>;

// El juego y lo que pasa alrededor: cuando el nivel termina, la invitación a
// la versión completa (con la tienda del dispositivo primero), debajo del
// juego para no tapar el festejo ni el resumen que muestra Unity. La lógica de la
// partida sigue en Unity; aquí solo se reacciona a su aviso.
export default function GameExperience({ t, buildUrl, buildVersion }: { t: Dictionary; buildUrl: string; buildVersion?: string }) {
  const [completed, setCompleted] = useState<Completed | null>(null);

  const onGameEvent = useCallback((event: GameEvent) => {
    if (event.type === "levelCompleted") setCompleted(event);
  }, []);

  return (
    <div className="relative">
      <UnityGame t={t} buildUrl={buildUrl} buildVersion={buildVersion} onGameEvent={onGameEvent} />

      {completed && (
        // Debajo del juego, sin taparlo: el resumen y el festejo los muestra Unity.
        <section className="mt-6 flex flex-col gap-4 rounded-3xl bg-surface p-6 sm:p-8" aria-labelledby="resultado-titulo">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="resultado-titulo" className="text-2xl font-black">
              {t.result.title}
            </h2>
            <p className="text-sm text-muted">
              {t.result.score}: <strong className="text-foreground">{completed.score.toLocaleString("es-CO")}</strong> · {t.result.time}:{" "}
              <strong className="text-foreground">{formatDuration(completed.timeSeconds)}</strong> · {t.result.objectives}:{" "}
              <strong className="text-foreground">
                {completed.objectivesDone}/{completed.objectivesTotal}
              </strong>
            </p>
          </div>
          <p className="text-muted">{t.result.demo}</p>
          <StoreButtons t={t} order={storeOrder(currentPlatform())} />
          <button type="button" onClick={() => setCompleted(null)} className="self-start text-sm underline underline-offset-4">
            {t.result.dismiss}
          </button>
        </section>
      )}
    </div>
  );
}
