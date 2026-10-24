"use client";

import { useActionState, useState } from "react";
import { requestAd, type AdRequestState } from "@/app/pauta/actions";
import type { Dictionary } from "@/i18n/dictionaries";

const field =
  "w-full rounded-xl border-2 border-foreground/20 bg-background px-3 py-2.5 text-foreground placeholder:text-muted focus:border-accent focus:outline-none";

// Solicitud de pauta: empresa, ciudad y logo; al enviarla se abre WhatsApp con todo listo.
export default function AdRequestForm({ t }: { t: Dictionary }) {
  const form = t.home.ads.form;
  const [state, action, pending] = useActionState<AdRequestState, FormData>(requestAd, {});
  const [preview, setPreview] = useState<string | null>(null);

  if (state.ok && state.whatsapp) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border-2 border-game-green bg-background/60 p-5" role="status">
        <p className="text-lg font-semibold">{form.done}</p>
        <a
          href={state.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="game-button inline-flex min-h-14 items-center rounded-2xl border-4 border-white bg-game-green px-8 font-display text-2xl uppercase tracking-wide text-white"
        >
          {form.openWhatsapp}
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4 rounded-2xl border-2 border-foreground/15 bg-background/60 p-5">
      <p className="font-display text-2xl">{form.title}</p>
      <div className="flex flex-col gap-1">
        <label htmlFor="pauta-empresa" className="text-sm font-semibold">
          {form.company}
        </label>
        <input
          id="pauta-empresa"
          name="company"
          required
          minLength={2}
          maxLength={80}
          autoComplete="organization"
          placeholder={form.companyHint}
          className={field}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="pauta-ciudad" className="text-sm font-semibold">
          {form.city}
        </label>
        <input
          id="pauta-ciudad"
          name="city"
          required
          minLength={2}
          maxLength={60}
          autoComplete="address-level2"
          placeholder={form.cityHint}
          className={field}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="pauta-logo" className="text-sm font-semibold">
          {form.logo}
        </label>
        <div className="flex items-center gap-3">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element -- vista previa local del logo elegido
            <img src={preview} alt="" className="h-12 w-12 rounded-lg border-2 border-white bg-white object-contain" />
          )}
          <input
            id="pauta-logo"
            name="logo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="min-w-0 text-sm text-muted file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-game-blue file:px-4 file:py-2 file:font-bold file:text-white"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
          />
        </div>
        <p className="text-xs text-muted">{form.logoHint}</p>
      </div>
      {/* Campo trampa para robots: oculto para las personas. */}
      <input type="text" name="sitio" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <button
        type="submit"
        disabled={pending}
        className="game-button inline-flex min-h-14 items-center justify-center rounded-2xl border-4 border-white bg-accent px-6 font-display text-2xl uppercase tracking-wide text-accent-ink disabled:opacity-60"
      >
        {pending ? form.sending : form.submit}
      </button>
      {state.message && (
        <p role="alert" className="text-danger">
          {state.message}
        </p>
      )}
    </form>
  );
}
