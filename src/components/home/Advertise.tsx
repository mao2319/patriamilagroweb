import AdRequestForm from "@/components/home/AdRequestForm";
import { CONTACT } from "@/config/contact";
import type { Dictionary } from "@/i18n/dictionaries";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

// Un ícono por formato de pauta: valla, vehículo, artículo y misión.
const icons = [
  <svg key="valla" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <rect x="3" y="4" width="18" height="10" rx="1.5" />
    <path d="M8 14v6M16 14v6M7 9h10" />
  </svg>,
  <svg key="bus" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <rect x="4" y="3" width="16" height="14" rx="2" />
    <path d="M4 11h16M8 21v-4M16 21v-4M7.5 14h1M15.5 14h1" />
  </svg>,
  <svg key="gorra" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="M4 15a8 8 0 0 1 16 0z" />
    <path d="M12 15h9" />
  </svg>,
  <svg key="mision" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" />
  </svg>,
];
const badges = ["bg-game-pink", "bg-game-blue", "bg-game-orange", "bg-game-green"];

// «Pauta con nosotros»: formatos de publicidad dentro del juego y solicitud de presupuesto.
export default function Advertise({ t }: { t: Dictionary }) {
  const ads = t.home.ads;
  const email = `mailto:${CONTACT.email}?subject=${encodeURIComponent(ads.emailSubject)}`;
  return (
    <section id="paute" aria-labelledby="paute-titulo" className="mx-auto w-full max-w-6xl scroll-mt-6 px-4 py-14 sm:px-8">
      <div className="grid gap-10 rounded-[2rem] border-4 border-accent bg-surface p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="w-fit -rotate-1 rounded-full border-2 border-white bg-game-pink px-4 py-1 font-display text-sm uppercase tracking-wide text-white">
              {ads.eyebrow}
            </p>
            <h2 id="paute-titulo" className="font-display text-4xl text-balance sm:text-5xl">
              {ads.title}
            </h2>
            <p className="flex flex-wrap items-center gap-2 text-lg">
              <span className="text-muted">{ads.byCompany}</span>
              <span className="rounded-lg border-2 border-accent px-2.5 py-0.5 font-display text-xl tracking-wide text-accent">{CONTACT.company}</span>
            </p>
            <p className="max-w-xl text-lg text-muted">{ads.lead}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {ads.formats.map((format, i) => (
              <li key={format.title} className="flex gap-3 rounded-2xl border-2 border-foreground/15 bg-background/60 p-4">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-white p-2 text-white ${badges[i % badges.length]}`}
                >
                  {icons[i % icons.length]}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-bold">{format.title}</span>
                  <span className="text-sm text-muted">{format.text}</span>
                </span>
              </li>
            ))}
          </ul>
          <a href={email} className="w-fit font-semibold underline underline-offset-4 hover:text-accent">
            {ads.email}
          </a>
        </div>

        <div className="flex flex-col gap-6">
          {/* Valla de muestra, como las que aparecen en los mapas. */}
          <div aria-hidden="true" className="mx-auto flex w-full max-w-sm flex-col items-center">
            <div className="relative w-full rotate-[-2deg] rounded-2xl border-[6px] border-white bg-[repeating-linear-gradient(135deg,#f59e0b_0_18px,#fbbf24_18px_36px)] p-3 shadow-[0_10px_0_rgba(0,0,0,0.35)]">
              <div className="flex aspect-[16/9] flex-col items-center justify-center gap-1 rounded-lg bg-[radial-gradient(ellipse_at_top,#8b5cf6_0%,#3b2a9c_70%)] text-center">
                <span className="font-display text-4xl uppercase leading-none text-white sm:text-5xl">{ads.billboard}</span>
                <span className="font-display text-lg text-accent">Firme por la Patria Game</span>
              </div>
            </div>
            <div className="flex w-2/3 justify-between">
              <span className="h-20 w-3 rounded-b bg-foreground/40" />
              <span className="h-20 w-3 rounded-b bg-foreground/40" />
            </div>
          </div>
          <AdRequestForm t={t} />
        </div>
      </div>
    </section>
  );
}
