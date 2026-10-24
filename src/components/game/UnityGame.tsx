"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { listenGameEvents, type GameEvent } from "@/lib/unityBridge";
import type { Dictionary } from "@/i18n/dictionaries";

// Carga el build WebGL de Unity dentro de la página (sin enviar al usuario a
// la página técnica de Unity). El progreso es el que reporta Unity, sin
// inventar porcentajes. Si el navegador no soporta WebGL 2, lo dice y no carga.

interface UnityInstance {
  SetFullscreen(fullscreen: number): void;
  Quit(): Promise<void>;
}

declare global {
  interface Window {
    createUnityInstance?: (canvas: HTMLCanvasElement, config: Record<string, unknown>, onProgress: (progress: number) => void) => Promise<UnityInstance>;
  }
}

type Status = "loading" | "ready" | "error";

const BUILD_NAME = "firme";
const SLOW_AFTER_MS = 25_000;

let webgl2: boolean | null = null;

function supportsWebGL2(): boolean {
  if (webgl2 === null) {
    try {
      webgl2 = Boolean(document.createElement("canvas").getContext("webgl2"));
    } catch {
      webgl2 = false;
    }
  }
  return webgl2;
}

const noSubscribe = () => () => undefined;

interface UnityGameProps {
  t: Dictionary;
  buildUrl: string;
  /** Huella de la build: evita que el navegador mezcle archivos de builds distintas. */
  buildVersion?: string;
  onGameEvent?: (event: GameEvent) => void;
}

export default function UnityGame({ t, buildUrl, buildVersion, onGameEvent }: UnityGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<UnityInstance | null>(null);
  // En el servidor se asume soporte; en el navegador se comprueba de verdad.
  const supported = useSyncExternalStore(noSubscribe, supportsWebGL2, () => true);
  const [status, setStatus] = useState<Status>("loading");
  const [progress, setProgress] = useState(0);
  const [slow, setSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!onGameEvent) return;
    return listenGameEvents(onGameEvent);
  }, [onGameEvent]);

  useEffect(() => {
    if (!supported) return;
    let cancelled = false;
    const slowTimer = window.setTimeout(() => setSlow(true), SLOW_AFTER_MS);

    const version = buildVersion ? `?v=${buildVersion}` : "";
    const script = document.createElement("script");
    script.src = `${buildUrl}/Build/${BUILD_NAME}.loader.js${version}`;
    script.async = true;
    script.onerror = () => !cancelled && setStatus("error");
    script.onload = () => {
      const canvas = canvasRef.current;
      if (cancelled || !canvas || !window.createUnityInstance) {
        if (!cancelled) setStatus("error");
        return;
      }
      window
        .createUnityInstance(
          canvas,
          {
            dataUrl: `${buildUrl}/Build/${BUILD_NAME}.data.br${version}`,
            frameworkUrl: `${buildUrl}/Build/${BUILD_NAME}.framework.js.br${version}`,
            codeUrl: `${buildUrl}/Build/${BUILD_NAME}.wasm.br${version}`,
            streamingAssetsUrl: `${buildUrl}/StreamingAssets`,
            companyName: "Capital Games",
            productName: "Firme por la Patria",
            productVersion: "0.1",
            // Sin el banner de errores de Unity: el portal muestra los suyos.
            showBanner: () => undefined,
          },
          (value) => !cancelled && setProgress(value),
        )
        .then((instance) => {
          if (cancelled) {
            void instance.Quit();
            return;
          }
          instanceRef.current = instance;
          setStatus("ready");
          canvas.focus();
        })
        .catch(() => !cancelled && setStatus("error"));
    };
    document.body.appendChild(script);

    return () => {
      cancelled = true;
      window.clearTimeout(slowTimer);
      script.remove();
      const instance = instanceRef.current;
      instanceRef.current = null;
      if (instance) void instance.Quit().catch(() => undefined);
    };
  }, [buildUrl, buildVersion, attempt, supported]);

  const retry = useCallback(() => {
    setStatus("loading");
    setProgress(0);
    setSlow(false);
    setAttempt((value) => value + 1);
  }, []);
  const fullscreen = useCallback(() => instanceRef.current?.SetFullscreen(1), []);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="relative aspect-video max-h-[100svh] w-full overflow-hidden rounded-2xl bg-black">
        {supported && (
          <canvas
            key={attempt}
            ref={canvasRef}
            id="unity-canvas"
            tabIndex={0}
            aria-label={t.play.canvasLabel}
            className="block h-full w-full touch-none outline-none"
            onPointerDown={(event) => event.currentTarget.focus()}
          />
        )}

        {supported && status === "loading" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface p-6 text-center" role="status" aria-live="polite">
            <p className="text-lg font-semibold">{t.play.loading}</p>
            <div className="h-3 w-full max-w-sm overflow-hidden rounded-full bg-background" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
              <div className="h-full bg-accent transition-[width]" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
            <p className="text-sm text-muted">{Math.round(progress * 100)}%</p>
            {slow && <p className="max-w-md text-sm text-muted">{t.play.loadingSlow}</p>}
          </div>
        ) : null}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface p-6 text-center" role="alert">
            <p className="max-w-md text-lg">{t.play.error}</p>
            <button type="button" onClick={retry} className="min-h-12 rounded-full bg-accent px-6 font-bold text-accent-ink">
              {t.play.retry}
            </button>
          </div>
        )}

        {!supported && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface p-6 text-center" role="alert">
            <p className="max-w-md text-lg">{t.play.unsupported}</p>
          </div>
        )}

        {/* En el celular el juego va en horizontal. */}
        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-background/95 p-6 text-center text-lg font-semibold pointer-coarse:portrait:flex">
          {t.play.rotate}
        </div>
      </div>

      {status === "ready" && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <span>{t.play.focusHint}</span>
          <button type="button" onClick={fullscreen} className="min-h-11 rounded-full border border-foreground/30 px-5 font-semibold text-foreground">
            {t.play.fullscreen}
          </button>
        </div>
      )}
    </div>
  );
}
