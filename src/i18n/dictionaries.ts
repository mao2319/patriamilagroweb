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
    back: "Volver al inicio",
    loading: "Cargando la Plaza Central…",
    loadingSlow: "La carga está tardando más de lo normal. Si tu conexión es lenta, espera un poco más o vuelve a intentarlo.",
    error: "No pudimos cargar el juego. Revisa tu conexión e inténtalo de nuevo.",
    retry: "Intentar de nuevo",
    unsupported: "Tu navegador o dispositivo no puede ejecutar el juego web (necesita WebGL 2). Prueba con Chrome, Edge, Firefox o Safari actualizados, o espera la versión para iPhone y Android.",
    rotate: "Gira tu teléfono para jugar en horizontal.",
    canvasLabel: "Juego Firme por la Patria",
    focusHint: "Haz clic en el juego para usar el teclado y el ratón.",
    fullscreen: "Pantalla completa",
  },
  result: {
    title: "¡Misión cumplida!",
    time: "Tiempo",
    score: "Puntaje",
    objectives: "Capturados",
    demo: "La demo web incluye un nivel. Continúa la aventura en la versión completa:",
    close: "Volver al juego",
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
    back: "Back to home",
    loading: "Loading the Central Plaza…",
    loadingSlow: "Loading is taking longer than usual. If your connection is slow, wait a little longer or try again.",
    error: "We couldn't load the game. Check your connection and try again.",
    retry: "Try again",
    unsupported: "Your browser or device can't run the web game (it needs WebGL 2). Try an up-to-date Chrome, Edge, Firefox or Safari, or wait for the iPhone and Android version.",
    rotate: "Turn your phone to play in landscape.",
    canvasLabel: "Firme por la Patria game",
    focusHint: "Click the game to use the keyboard and mouse.",
    fullscreen: "Full screen",
  },
  result: {
    title: "Mission accomplished!",
    time: "Time",
    score: "Score",
    objectives: "Caught",
    demo: "The web demo includes one level. Continue the adventure in the full version:",
    close: "Back to the game",
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
