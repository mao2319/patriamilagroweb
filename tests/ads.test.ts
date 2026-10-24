import { describe, expect, it } from "vitest";
import { activeAds, DEFAULT_AD_SPACES, LOBBY_LEVEL, normalizeCity, safeLink, sanitizeAd, type Ad } from "@/lib/ads";

const base: Ad = {
  id: "pauta-prueba-1",
  company: "Hamburguesas El Parque",
  logoUrl: "https://x.public.blob.vercel-storage.com/pautas/logo.png",
  link: "https://instagram.com/elparque",
  start: "2026-10-01",
  end: "2026-10-31",
  missions: [],
  cities: [],
  billboards: 2,
  facades: 1,
  lobby: 1,
  enabled: true,
};

describe("pautas publicitarias", () => {
  it("se ven solo entre las fechas de inicio y fin", () => {
    expect(activeAds([base], "bogota", null, "2026-10-24")).toHaveLength(1);
    expect(activeAds([base], "bogota", null, "2026-11-01")).toHaveLength(0);
    expect(activeAds([base], "bogota", null, "2026-09-30")).toHaveLength(0);
  });

  it("se ven solo en los mapas elegidos (sin mapas: en todos)", () => {
    const medellin = { ...base, missions: ["medellin"] };
    expect(activeAds([medellin], "medellin", null, "2026-10-24")).toHaveLength(1);
    expect(activeAds([medellin], "bogota", null, "2026-10-24")).toHaveLength(0);
  });

  it("se ven solo para los jugadores de las ciudades elegidas (sin importar tildes)", () => {
    const bogota = { ...base, cities: ["Bogotá"] };
    expect(activeAds([bogota], "cali", "Bogota", "2026-10-24")).toHaveLength(1);
    expect(activeAds([bogota], "cali", "Medellín", "2026-10-24")).toHaveLength(0);
    expect(activeAds([bogota], "cali", null, "2026-10-24")).toHaveLength(0);
    expect(normalizeCity("  BOGOTÁ ")).toBe("bogota");
  });

  it("las pausadas o sin logo no salen", () => {
    expect(activeAds([{ ...base, enabled: false }], null, null, "2026-10-24")).toHaveLength(0);
  });

  it("en el lobby salen las que tienen vallas de lobby, sin importar los mapas", () => {
    const medellin: Ad = { ...base, missions: ["medellin"] };
    expect(activeAds([medellin], LOBBY_LEVEL, null, "2026-10-24")).toHaveLength(1);
    expect(activeAds([{ ...medellin, lobby: 0 }], LOBBY_LEVEL, null, "2026-10-24")).toHaveLength(0);
    expect(activeAds([{ ...base, logoUrl: null }], null, null, "2026-10-24")).toHaveLength(0);
  });

  it("descarta datos inválidos y arregla el link", () => {
    expect(sanitizeAd({ ...base, end: "2026-09-01" })).toBeNull();
    expect(sanitizeAd({ ...base, company: "" })).toBeNull();
    expect(sanitizeAd({ ...base, logoUrl: "https://otro.com/logo.png" })?.logoUrl).toBeNull();
    expect(safeLink("instagram.com/marca")).toBe("https://instagram.com/marca");
    expect(safeLink("javascript:alert(1)")).toBe("");
  });

  it("cada pauta ocupa sus vallas y fachadas (por defecto 2 y 1; las guardadas antes también)", () => {
    expect(DEFAULT_AD_SPACES).toEqual({ billboards: 2, facades: 1, lobby: 1 });
    expect(sanitizeAd({ ...base, lobby: undefined })).toMatchObject({ lobby: 1 });
    expect(sanitizeAd({ ...base, lobby: "3" })).toMatchObject({ lobby: 3 });
    expect(sanitizeAd({ ...base, lobby: 9 })).toMatchObject({ lobby: 1 });
    expect(sanitizeAd({ ...base, billboards: undefined, facades: undefined })).toMatchObject({ billboards: 2, facades: 1 });
    expect(sanitizeAd({ ...base, billboards: "4", facades: "0" })).toMatchObject({ billboards: 4, facades: 0 });
    expect(sanitizeAd({ ...base, billboards: 11, facades: 2.5, lobby: -1 })).toMatchObject(DEFAULT_AD_SPACES);
    expect(sanitizeAd({ ...base, billboards: -1, facades: "dos", lobby: "x" })).toMatchObject(DEFAULT_AD_SPACES);
  });
});
