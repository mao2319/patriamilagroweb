import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

// Un icono y un color por tarjeta, en el mismo orden que los textos.
const STYLES: { color: string; icon: ReactNode }[] = [
  {
    // Esposas.
    color: "#3cc13b",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
        <circle cx="7" cy="14" r="4.5" />
        <circle cx="17" cy="14" r="4.5" />
        <path d="M10.5 11.5c.5-2 1-3 1.5-3s1 1 1.5 3M7 9.5V7M17 9.5V7" />
      </svg>
    ),
  },
  {
    // Señal de peligro.
    color: "#e8456b",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
        <path d="M10.3 3.9 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
  },
  {
    // Avión.
    color: "#2f80ed",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
        <path d="M2 13.5 22 4l-5.5 16-4-6.5z" />
        <path d="M12.5 13.5 22 4" />
      </svg>
    ),
  },
  {
    // Pantalla y celular.
    color: "#f59e0b",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
        <rect x="2" y="4" width="14" height="10" rx="1.5" />
        <path d="M6 18h6M9 14v4" />
        <rect x="17" y="9" width="5" height="11" rx="1" />
      </svg>
    ),
  },
];

// «Cómo se juega»: tarjetas con icono grande en una ficha de color.
export default function Features({ t }: { t: Dictionary }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {t.home.features.map((feature, index) => {
        const style = STYLES[index % STYLES.length];
        return (
          <li
            key={feature.title}
            className="relative flex flex-col gap-3 overflow-hidden rounded-3xl border-2 bg-surface p-6"
            style={{
              borderColor: `${style.color}88`,
              backgroundImage: `linear-gradient(160deg, ${style.color}33 0%, transparent 60%)`,
            }}
          >
            <span
              className="flex h-16 w-16 -rotate-6 items-center justify-center rounded-2xl border-4 border-white p-3 text-white shadow-[0_6px_0_rgba(0,0,0,0.3)]"
              style={{ backgroundColor: style.color }}
            >
              {style.icon}
            </span>
            <h3 className="font-display text-2xl">{feature.title}</h3>
            <p className="text-foreground/85">{feature.text}</p>
          </li>
        );
      })}
    </ul>
  );
}
