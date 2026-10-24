// Iconos de las plataformas de la versión completa (glifos simples en un solo
// color, para los botones de las tiendas).

export function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16.37 12.6c.03 2.87 2.52 3.82 2.55 3.84-.02.07-.4 1.36-1.31 2.69-.79 1.15-1.61 2.3-2.9 2.32-1.27.02-1.68-.75-3.13-.75-1.45 0-1.9.73-3.1.78-1.25.05-2.2-1.25-2.99-2.39-1.62-2.35-2.86-6.63-1.2-9.52.83-1.43 2.3-2.34 3.9-2.36 1.22-.02 2.37.82 3.12.82.74 0 2.14-1.02 3.6-.87.62.03 2.34.25 3.45 1.88-.09.06-2.06 1.2-2.04 3.58M14.01 5.6c.66-.8 1.1-1.9.98-3-.95.04-2.1.63-2.78 1.43-.61.7-1.15 1.83-1 2.9 1.06.09 2.14-.53 2.8-1.33" />
    </svg>
  );
}

export function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.86 3.22A11.4 11.4 0 0 0 12 8.08c-1.78 0-3.46.4-4.92 1.06L5.22 5.92a.38.38 0 0 0-.66.38L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52M7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5m10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5" />
    </svg>
  );
}

export function RobloxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M5.16 1 1 18.84 18.84 23 23 5.16zm8.93 13.23-4.32-1.02 1.02-4.32 4.32 1.02z" />
    </svg>
  );
}
