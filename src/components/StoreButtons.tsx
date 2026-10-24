import type { ReactNode } from "react";
import { AndroidIcon, AppleIcon, RobloxIcon } from "@/components/home/BrandIcons";
import { STORE_LINKS, type StoreId } from "@/config/stores";
import type { Dictionary } from "@/i18n/dictionaries";

interface StoreButtonsProps {
  t: Dictionary;
  // Orden de prioridad (ver lib/platform.ts). Por defecto, el de escritorio.
  order?: StoreId[];
}

const ICONS: Record<StoreId, (className: string) => ReactNode> = {
  appStore: (className) => <AppleIcon className={className} />,
  googlePlay: (className) => <AndroidIcon className={className} />,
  roblox: (className) => <RobloxIcon className={className} />,
};

// Botones hacia la versión completa, con el icono de cada plataforma. Una
// tienda sin enlace configurado se muestra deshabilitada como «Próximamente»:
// nunca un enlace inventado.
export default function StoreButtons({ t, order = ["appStore", "googlePlay", "roblox"] }: StoreButtonsProps) {
  const links = order.map((id) => STORE_LINKS.find((link) => link.id === id)!);
  return (
    <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {links.map((link) => {
        const label = t.stores[link.id];
        const base = "flex min-h-16 items-center gap-3 rounded-2xl border-2 px-5 py-2 text-left";
        const content = (
          <>
            {ICONS[link.id]("h-8 w-8 shrink-0")}
            <span className="flex flex-col leading-tight">
              <span className="text-base font-bold">{label}</span>
              {!link.url && <span className="text-xs font-semibold uppercase tracking-wide text-accent">{t.stores.comingSoon}</span>}
            </span>
          </>
        );
        return (
          <li key={link.id}>
            {link.url ? (
              <a href={link.url} target="_blank" rel="noopener noreferrer" className={`${base} border-foreground bg-black text-foreground hover:bg-black/70`}>
                {content}
              </a>
            ) : (
              <span className={`${base} cursor-not-allowed border-foreground/25 bg-black/30 text-foreground/80`} aria-disabled="true">
                {content}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
