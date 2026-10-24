// Textos del portal, separados de los componentes. Español por defecto; el
// inglés se activa con el idioma del navegador o eligiéndolo. Para sumar un
// idioma basta agregar su diccionario con las mismas claves.

export type Locale = "es" | "en";
export const DEFAULT_LOCALE: Locale = "es";
export const LOCALES: Locale[] = ["es", "en"];

const es = {
  meta: {
    title: "Firme por la Patria Game — Demo web",
    description: "Elige tu mapa y tu misión, persigue y captura a los sospechosos en una aventura por una Colombia ficticia. Juega gratis en tu navegador.",
  },
  home: {
    title: "Firme por la Patria Game",
    lead: "Elige tu mapa y tu misión por las ciudades de Colombia: sigue las pistas, esquiva las trampas y captura a los delincuentes antes de que se acabe el tiempo.",
    play: "Jugar gratis",
    seeMissions: "Ver misiones",
    missionsTitle: "Elige tu misión",
    missionsLead: "Cada ciudad es un mapa con su propia misión. Bogotá, Medellín, Barranquilla y Cali ya están listas; las demás vienen en camino.",
    missionReady: "Disponible",
    missionSoon: "Próximamente",
    missionPlay: "Jugar esta misión",
    howTo: "Cómo se juega",
    features: [
      { title: "Persecuciones", text: "Encuentra pistas y alcanza a cada sospechoso antes de que escape." },
      { title: "Trampas", text: "Los delincuentes dejan huecos, redes y bombas. Desactívalas o esquívalas." },
      { title: "Apoyo aéreo", text: "Pide una patrulla, el helicóptero o el avión para acorralarlos." },
      { title: "Escritorio y celular", text: "Teclado y ratón, o controles táctiles en tu teléfono." },
    ],
    fullVersion: "La versión completa llega a iPhone, Android y Roblox.",
    finalCta: "¿Listo para la primera misión?",
    ads: {
      eyebrow: "Para marcas y negocios",
      byCompany: "Una propuesta de",
      title: "Pauta con nosotros dentro del juego",
      lead: "Pon tu marca en las calles de Bogotá, Medellín, Barranquilla y Cali: los jugadores la ven mientras persiguen sospechosos, manejan y recorren cada mapa.",
      billboard: "Tu marca aquí",
      formats: [
        { title: "Vallas y pantallas", text: "En edificios, plazas y avenidas de los mapas, a la vista en cada persecución." },
        { title: "Vehículos con tu marca", text: "Buses, taxis y carros pintados con tu logo, que además se pueden manejar." },
        { title: "Artículos en la tienda", text: "Gorras, camisetas y accesorios de tu marca para vestir al personaje." },
        { title: "Misiones y temporadas", text: "Un mapa, una misión o un tema de temporada patrocinado por tu marca." },
      ],
      cta: "Quiero pautar",
      email: "Escribir por correo",
      whatsappMessage: "¡Hola, Mauricio! Quiero pautar mi marca dentro de Firme por la Patria Game.",
      emailSubject: "Pauta con Capital Games Colombia en Firme por la Patria Game",
      form: {
        title: "Pide tu presupuesto",
        company: "Nombre de la empresa",
        companyHint: "Ej.: Hamburguesas El Parque",
        city: "Ciudad",
        cityHint: "Ej.: Bogotá",
        logo: "Logo",
        logoHint: "JPG, PNG o WebP, máximo 1 MB. Si no lo tienes a mano, lo envías después por el chat.",
        submit: "Enviar por WhatsApp",
        sending: "Preparando…",
        done: "¡Listo! Abre WhatsApp y envía el mensaje: ya lleva tu empresa, tu ciudad y tu logo.",
        openWhatsapp: "Abrir WhatsApp",
      },
    },
  },
  play: {
    title: "Firme por la Patria Game",
    back: "Volver al inicio",
    loading: "Cargando el juego…",
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
    dismiss: "Ocultar",
  },
  stores: {
    appStore: "Descargar para iPhone y iPad",
    googlePlay: "Descargar para Android",
    roblox: "Jugar en Roblox",
    comingSoon: "Próximamente",
  },
  footer: {
    fiction: "Personajes, lugares y hechos son ficticios. Cualquier parecido con personas reales es coincidencia.",
    creatorLabel: "Creador del juego",
    emailLabel: "Correo",
    whatsappLabel: "WhatsApp",
    whatsappMessage: "¡Hola, Mauricio! Vi Firme por la Patria Game y quiero más información.",
  },
};

export type Dictionary = typeof es;

const en: Dictionary = {
  meta: {
    title: "Firme por la Patria Game — Web demo",
    description: "Pick your map and mission, chase and catch the suspects in an adventure through a fictional Colombia. Play free in your browser.",
  },
  home: {
    title: "Firme por la Patria Game",
    lead: "Pick your map and your mission across the cities of Colombia: follow the clues, dodge the traps and catch the criminals before time runs out.",
    play: "Play free",
    seeMissions: "See missions",
    missionsTitle: "Choose your mission",
    missionsLead: "Each city is a map with its own mission. Bogotá, Medellín, Barranquilla and Cali are ready; the rest are on the way.",
    missionReady: "Available",
    missionSoon: "Coming soon",
    missionPlay: "Play this mission",
    howTo: "How to play",
    features: [
      { title: "Chases", text: "Find clues and catch each suspect before they get away." },
      { title: "Traps", text: "Criminals leave holes, nets and bombs. Defuse or dodge them." },
      { title: "Air support", text: "Call a patrol, the helicopter or the jet to corner them." },
      { title: "Desktop and mobile", text: "Keyboard and mouse, or touch controls on your phone." },
    ],
    fullVersion: "The full version is coming to iPhone, Android and Roblox.",
    finalCta: "Ready for your first mission?",
    ads: {
      eyebrow: "For brands and businesses",
      byCompany: "Brought to you by",
      title: "Advertise with us inside the game",
      lead: "Put your brand on the streets of Bogotá, Medellín, Barranquilla and Cali: players see it while they chase suspects, drive and explore every map.",
      billboard: "Your brand here",
      formats: [
        { title: "Billboards and screens", text: "On buildings, squares and avenues of the maps, in sight during every chase." },
        { title: "Branded vehicles", text: "Buses, taxis and cars painted with your logo, which players can also drive." },
        { title: "Items in the shop", text: "Caps, shirts and accessories of your brand to dress up the character." },
        { title: "Missions and seasons", text: "A map, a mission or a seasonal theme sponsored by you." },
      ],
      cta: "I want to advertise",
      email: "Write by email",
      whatsappMessage: "Hi Mauricio! I want to advertise my brand inside Firme por la Patria Game.",
      emailSubject: "Advertising with Capital Games Colombia in Firme por la Patria Game",
      form: {
        title: "Get a quote",
        company: "Company name",
        companyHint: "E.g.: Park Burgers",
        city: "City",
        cityHint: "E.g.: Bogotá",
        logo: "Logo",
        logoHint: "JPG, PNG or WebP, up to 1 MB. If you don't have it handy, send it later in the chat.",
        submit: "Send via WhatsApp",
        sending: "Preparing…",
        done: "Done! Open WhatsApp and send the message: it already has your company, city and logo.",
        openWhatsapp: "Open WhatsApp",
      },
    },
  },
  play: {
    title: "Firme por la Patria Game",
    back: "Back to home",
    loading: "Loading the game…",
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
    dismiss: "Hide",
  },
  stores: {
    appStore: "Download for iPhone and iPad",
    googlePlay: "Download for Android",
    roblox: "Play on Roblox",
    comingSoon: "Coming soon",
  },
  footer: {
    fiction: "Characters, places and events are fictional. Any resemblance to real people is coincidental.",
    creatorLabel: "Game creator",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp",
    whatsappMessage: "Hi Mauricio! I saw Firme por la Patria Game and would like more information.",
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
