// Misiones (mapas) del juego: lo que muestra el tablero de misiones en Unity y
// lo que se edita en /admin. Los valores por defecto viven aquí; lo que se
// cambie en /admin se guarda en el Blob (missions/missions.json) y se mezcla
// encima. El juego nunca depende de que exista ese archivo.

export type MissionStatus = "playable" | "soon";

export interface Mission {
  id: string;
  /** Nivel de Unity que se juega (solo en las jugables). */
  levelId: string | null;
  status: MissionStatus;
  order: number;
  city: string;
  title: string;
  titleEn: string;
  mission: string;
  missionEn: string;
  description: string;
  descriptionEn: string;
  /** Foto de la tarjeta (Blob público); null mientras no se suba. */
  photoUrl: string | null;
  /** Cuántos delincuentes hay que capturar en el mapa (se cambia en /admin). */
  suspects: number;
}

/** Delincuentes por mapa: de 1 a 8 (el juego trae 8 listos en cada mapa). */
export const MIN_SUSPECTS = 1;
export const MAX_SUSPECTS = 8;
export const DEFAULT_SUSPECTS = 5;

/** Campos que se pueden cambiar desde /admin. */
export const EDITABLE_FIELDS = ["title", "titleEn", "mission", "missionEn", "description", "descriptionEn", "status"] as const;
export type EditableField = (typeof EDITABLE_FIELDS)[number];
export type MissionOverride = Partial<Pick<Mission, EditableField | "photoUrl" | "suspects">>;

export const DEFAULT_MISSIONS: Mission[] = [
  {
    id: "bogota",
    levelId: "bogota_plaza_central",
    status: "playable",
    order: 1,
    city: "Bogotá",
    title: "Misión Bogotá: Plaza Central",
    titleEn: "Mission Bogotá: Central Plaza",
    mission: "Cinco sospechosos andan sueltos en la Plaza Central. ¡Captúralos antes de que se acabe el tiempo!",
    missionEn: "Five suspects are loose in the Central Plaza. Catch them before time runs out!",
    description: "Entre la catedral, los edificios de piedra y las palomas, sigue las pistas y cuídate de las trampas.",
    descriptionEn: "Among the cathedral, the stone buildings and the pigeons, follow the clues and watch out for traps.",
    photoUrl: null,
    suspects: DEFAULT_SUSPECTS,
  },
  {
    id: "medellin",
    levelId: "medellin_comuna13",
    status: "playable",
    order: 2,
    city: "Medellín",
    title: "Misión Medellín: Comuna 13",
    titleEn: "Mission Medellín: Comuna 13",
    mission: "Persigue a los sospechosos entre escaleras eléctricas, grafitis y casas de colores.",
    missionEn: "Chase the suspects through escalators, graffiti and colorful houses.",
    description: "Calles en subida, terrazas y atajos por toda la montaña.",
    descriptionEn: "Uphill streets, rooftops and shortcuts all over the hill.",
    photoUrl: null,
    suspects: DEFAULT_SUSPECTS,
  },
  {
    id: "barranquilla",
    levelId: "barranquilla_malecon",
    status: "playable",
    order: 3,
    city: "Barranquilla",
    title: "Misión Barranquilla: Gran Malecón",
    titleEn: "Mission Barranquilla: Grand Boardwalk",
    mission: "Atrapa a la banda que se esconde entre la multitud del malecón, junto a la rueda de Chicharrón.",
    missionEn: "Catch the gang hiding in the boardwalk crowd, next to the big Ferris wheel.",
    description: "El río Magdalena, la brisa y mucha gente: ojo con quién se te escapa.",
    descriptionEn: "The Magdalena River, the breeze and lots of people: don't let anyone slip away.",
    photoUrl: null,
    suspects: DEFAULT_SUSPECTS,
  },
  {
    id: "cali",
    levelId: "cali_cristo_rey",
    status: "playable",
    order: 4,
    city: "Cali",
    title: "Misión Cali: Cristo Rey",
    titleEn: "Mission Cali: Cristo Rey",
    mission: "Sube al cerro y captura a los sospechosos antes de que bajen a la ciudad.",
    missionEn: "Climb the hill and catch the suspects before they get back down to the city.",
    description: "Senderos, miradores y toda Cali a tus pies.",
    descriptionEn: "Trails, viewpoints and all of Cali at your feet.",
    photoUrl: null,
    suspects: DEFAULT_SUSPECTS,
  },
  {
    id: "cucuta",
    levelId: null,
    status: "soon",
    order: 5,
    city: "Cúcuta",
    title: "Misión Cúcuta: Puente y Malecón",
    titleEn: "Mission Cúcuta: Bridge and Boardwalk",
    mission: "Los sospechosos se mueven entre el comercio y el puente. ¡No dejes que crucen!",
    missionEn: "The suspects move between the shops and the bridge. Don't let them cross!",
    description: "Calor, mercado, el templo histórico y calles llenas de gente.",
    descriptionEn: "Heat, a busy market, the historic temple and crowded streets.",
    photoUrl: null,
    suspects: DEFAULT_SUSPECTS,
  },
  {
    id: "ibague",
    levelId: null,
    status: "soon",
    order: 6,
    city: "Ibagué",
    title: "Misión Ibagué: Ciudad Musical",
    titleEn: "Mission Ibagué: Musical City",
    mission: "Sigue el ritmo de las pistas entre el conservatorio y el Panóptico.",
    missionEn: "Follow the beat of the clues between the conservatory and the Panopticon.",
    description: "Parques, guitarras y montañas verdes alrededor de la plaza.",
    descriptionEn: "Parks, guitars and green mountains around the square.",
    photoUrl: null,
    suspects: DEFAULT_SUSPECTS,
  },
  {
    id: "pereira",
    levelId: null,
    status: "soon",
    order: 7,
    city: "Pereira",
    title: "Misión Pereira: Bolívar Desnudo",
    titleEn: "Mission Pereira: Naked Bolívar",
    mission: "Atrapa a la banda entre el viaducto, la plaza y los cafetales.",
    missionEn: "Catch the gang between the viaduct, the square and the coffee farms.",
    description: "El Eje Cafetero: subidas, miradores y aroma a café.",
    descriptionEn: "The Coffee Region: hills, viewpoints and the smell of coffee.",
    photoUrl: null,
    suspects: DEFAULT_SUSPECTS,
  },
  {
    id: "san_andres",
    levelId: null,
    status: "soon",
    order: 8,
    city: "San Andrés",
    title: "Misión San Andrés: Mar de Siete Colores",
    titleEn: "Mission San Andrés: Sea of Seven Colors",
    mission: "Persigue a los sospechosos por la playa, el muelle y el mar en lancha o moto acuática.",
    missionEn: "Chase the suspects across the beach, the pier and the sea by boat or jet ski.",
    description: "Palmeras, arena blanca y el mar más azul de Colombia.",
    descriptionEn: "Palm trees, white sand and the bluest sea in Colombia.",
    photoUrl: null,
    suspects: DEFAULT_SUSPECTS,
  },
  {
    id: "cartagena",
    levelId: null,
    status: "soon",
    order: 9,
    city: "Cartagena",
    title: "Misión Cartagena: Ciudad Amurallada",
    titleEn: "Mission Cartagena: Walled City",
    mission: "Captura a los sospechosos entre balcones, murallas y el Castillo San Felipe.",
    missionEn: "Catch the suspects among balconies, city walls and San Felipe Castle.",
    description: "Calles de colores, coches de caballos y la Torre del Reloj.",
    descriptionEn: "Colorful streets, horse carriages and the Clock Tower.",
    photoUrl: null,
    suspects: DEFAULT_SUSPECTS,
  },
  {
    id: "santa_marta",
    levelId: null,
    status: "soon",
    order: 10,
    city: "Santa Marta",
    title: "Misión Santa Marta: Bahía y Sierra",
    titleEn: "Mission Santa Marta: Bay and Sierra",
    mission: "Atrapa a la banda entre la bahía, el camellón y el camino a la Sierra.",
    missionEn: "Catch the gang between the bay, the seafront and the trail to the Sierra.",
    description: "Mar, montaña y la ciudad más antigua de Colombia.",
    descriptionEn: "Sea, mountains and the oldest city in Colombia.",
    photoUrl: null,
    suspects: DEFAULT_SUSPECTS,
  },
];

const MAX_TEXT = 400;

/** Limpia lo que llega de /admin: solo campos conocidos, texto recortado y estado válido. */
export function sanitizeOverride(input: Record<string, unknown>): MissionOverride {
  const clean: MissionOverride = {};
  for (const field of EDITABLE_FIELDS) {
    const value = input[field];
    if (typeof value !== "string") continue;
    if (field === "status") {
      if (value === "playable" || value === "soon") clean.status = value;
      continue;
    }
    const text = value.trim().slice(0, MAX_TEXT);
    if (text) clean[field] = text;
  }
  if (typeof input.photoUrl === "string" && /^https:\/\//.test(input.photoUrl)) clean.photoUrl = input.photoUrl;
  const suspects = typeof input.suspects === "string" ? Number(input.suspects) : input.suspects;
  if (typeof suspects === "number" && Number.isInteger(suspects) && suspects >= MIN_SUSPECTS && suspects <= MAX_SUSPECTS) clean.suspects = suspects;
  return clean;
}

/** Los valores por defecto con lo editado encima. Una misión sin nivel nunca queda «jugable». */
export function mergeMissions(overrides: Record<string, MissionOverride>): Mission[] {
  return DEFAULT_MISSIONS.map((mission) => {
    const merged = { ...mission, ...sanitizeOverride((overrides[mission.id] ?? {}) as Record<string, unknown>) };
    if (!merged.levelId) merged.status = "soon";
    return merged;
  }).sort((a, b) => a.order - b.order);
}
