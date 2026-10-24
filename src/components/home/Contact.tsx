import { CONTACT } from "@/config/contact";
import type { Dictionary } from "@/i18n/dictionaries";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

// Creador del juego y cómo contactarlo (correo y WhatsApp con un mensaje listo).
export default function Contact({ t }: { t: Dictionary }) {
  const whatsapp = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(t.footer.whatsappMessage)}`;
  const item = "flex h-full min-h-20 items-center gap-3 rounded-2xl border-2 border-foreground/15 bg-surface px-4 py-3";
  const badge = "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-white p-2 text-white";
  return (
    <ul className="grid auto-rows-fr gap-3 sm:grid-cols-3">
      <li className={`${item} relative`}>
        <span className="absolute -top-3 right-3 rotate-3 rounded-full border-2 border-white bg-accent px-3 py-0.5 font-display text-sm uppercase tracking-wide text-accent-ink shadow-[0_3px_0_rgba(0,0,0,0.3)]">
          {CONTACT.studio}
        </span>
        <span className={`${badge} bg-game-violet`}>
          <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
          </svg>
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.footer.creatorLabel}</span>
          <span className="font-bold">{CONTACT.creator}</span>
        </span>
      </li>
      <li>
        <a href={`mailto:${CONTACT.email}`} className={`${item} hover:border-accent`}>
          <span className={`${badge} bg-game-blue`}>
            <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.footer.emailLabel}</span>
            <span className="truncate text-sm font-bold sm:text-[0.95rem]" title={CONTACT.email}>
              {CONTACT.email}
            </span>
          </span>
        </a>
      </li>
      <li>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${item} hover:border-accent`}>
          <span className={`${badge} bg-game-green`}>
            <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
              <path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3 3z" />
              <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z" />
            </svg>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.footer.whatsappLabel}</span>
            <span className="font-bold">{CONTACT.whatsappDisplay}</span>
          </span>
        </a>
      </li>
    </ul>
  );
}
