import { STORE_LINKS, type StoreId } from "@/config/stores";
import type { Dictionary } from "@/i18n/dictionaries";

interface StoreButtonsProps {
  t: Dictionary;
  // Orden de prioridad (ver lib/platform.ts). Por defecto, el de escritorio.
  order?: StoreId[];
}

// Botones hacia la versión completa. Una tienda sin enlace configurado se
// muestra deshabilitada como «Próximamente»: nunca un enlace inventado.
export default function StoreButtons({ t, order = ["appStore", "googlePlay", "roblox"] }: StoreButtonsProps) {
  const links = order.map((id) => STORE_LINKS.find((link) => link.id === id)!);
  return (
    <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {links.map((link, index) => {
        const label = t.stores[link.id];
        const base = "flex min-h-12 items-center justify-center rounded-full px-6 text-base font-semibold";
        return (
          <li key={link.id}>
            {link.url ? (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${base} ${index === 0 ? "bg-accent text-accent-ink" : "border border-foreground/40 text-foreground"}`}
              >
                {label}
              </a>
            ) : (
              <span className={`${base} cursor-not-allowed border border-foreground/20 text-muted`} aria-disabled="true">
                {label} · {t.stores.comingSoon}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
