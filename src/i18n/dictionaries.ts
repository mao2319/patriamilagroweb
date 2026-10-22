// Textos del portal, separados de los componentes. Español por defecto; el
// inglés se activa con el idioma del navegador o eligiéndolo. Para sumar un
// idioma basta agregar su diccionario con las mismas claves.

export type Locale = "es" | "en";
export const DEFAULT_LOCALE: Locale = "es";
export const LOCALES: Locale[] = ["es", "en"];

const es = {
  meta: {
    title: "Firme por la Patria — Demo web",
    description: "Persigue y captura a los sospechosos en una aventura voxel por una Colombia ficticia. Juega gratis el primer nivel en tu navegador.",
  },
  home: {
    kicker: "Demo web gratuita · 1 nivel",
    title: "Firme por la Patria",
    lead: "Recorre la Plaza Central, sigue las pistas, esquiva las trampas de los delincuentes y captúralos antes de que se acabe el tiempo.",
    play: "Jugar gratis",
    howTo: "Cómo se juega",
    features: [
      { title: "Persecuciones", text: "Encuentra pistas y alcanza a cada sospechoso antes de que escape." },
      { title: "Trampas", text: "Los delincuentes dejan trampas en el mapa. Desactívalas o evítalas." },
      { title: "Escritorio y celular", text: "Teclado y ratón, o controles táctiles en tu teléfono." },
    ],
    fullVersion: "La versión completa llega a iPhone, Android y Roblox.",
  },
  play: {
    title: "Misión Bogotá: Plaza Central",
    pending: "El juego se integra aquí en la Fase 4. Por ahora esta página reserva su lugar.",
    back: "Volver al inicio",
  },
  stores: {
    appStore: "Descargar para iPhone y iPad",
    googlePlay: "Descargar para Android",
    roblox: "Jugar en Roblox",
    comingSoon: "Próximamente",
  },
  footer: {
    fiction: "Personajes, lugares y hechos son ficticios. Cualquier parecido con personas reales es coincidencia.",
  },
};

export type Dictionary = typeof es;

const en: Dictionary = {
  meta: {
    title: "Firme por la Patria — Web demo",
    description: "Chase and catch the suspects in a voxel adventure through a fictional Colombia. Play the first level free in your browser.",
  },
  home: {
    kicker: "Free web demo · 1 level",
    title: "Firme por la Patria",
    lead: "Explore the Central Plaza, follow the clues, dodge the criminals' traps and catch them before time runs out.",
    play: "Play free",
    howTo: "How to play",
    features: [
      { title: "Chases", text: "Find clues and catch each suspect before they get away." },
      { title: "Traps", text: "Criminals leave traps on the map. Defuse or avoid them." },
      { title: "Desktop and mobile", text: "Keyboard and mouse, or touch controls on your phone." },
    ],
    fullVersion: "The full version is coming to iPhone, Android and Roblox.",
  },
  play: {
    title: "Mission Bogotá: Central Plaza",
    pending: "The game is embedded here in Phase 4. For now this page holds its place.",
    back: "Back to home",
  },
  stores: {
    appStore: "Download for iPhone and iPad",
    googlePlay: "Download for Android",
    roblox: "Play on Roblox",
    comingSoon: "Coming soon",
  },
  footer: {
    fiction: "Characters, places and events are fictional. Any resemblance to real people is coincidental.",
  },
};

const DICTIONARIES: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

// Elige el idioma a partir de Accept-Language o navigator.languages.
export function pickLocale(preferred: readonly string[] | string | null | undefined): Locale {
  const list = typeof preferred === "string" ? preferred.split(",") : (preferred ?? []);
  for (const entry of list) {
    const code = entry.trim().slice(0, 2).toLowerCase();
    if ((LOCALES as string[]).includes(code)) return code as Locale;
  }
  return DEFAULT_LOCALE;
}
