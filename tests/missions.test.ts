import { describe, expect, it } from "vitest";
import { DEFAULT_MISSIONS, mergeMissions, sanitizeOverride } from "@/lib/missions";

describe("misiones", () => {
  it("trae Bogotá, Medellín, Barranquilla y Cali jugables y las demás como próximamente", () => {
    const missions = mergeMissions({});
    expect(missions.map((m) => m.id)).toEqual(["bogota", "medellin", "barranquilla", "cali", "cucuta", "ibague", "pereira", "san_andres", "cartagena", "santa_marta"]);
    expect(missions.slice(0, 4).every((m) => m.status === "playable")).toBe(true);
    expect(missions.slice(4).every((m) => m.status === "soon")).toBe(true);
  });

  it("aplica lo editado en /admin sobre los valores por defecto", () => {
    const missions = mergeMissions({ bogota: { title: "Nueva", photoUrl: "https://x.public.blob.vercel-storage.com/missions/a.jpg" } });
    expect(missions[0].title).toBe("Nueva");
    expect(missions[0].mission).toBe(DEFAULT_MISSIONS[0].mission);
    expect(missions[0].photoUrl).toContain("https://");
  });

  it("una misión sin nivel no se puede marcar como jugable", () => {
    expect(mergeMissions({ cucuta: { status: "playable" } }).find((m) => m.id === "cucuta")?.status).toBe("soon");
  });

  it("descarta campos desconocidos, textos vacíos y fotos que no son https", () => {
    const clean = sanitizeOverride({ title: "  ", levelId: "hack", status: "otro", photoUrl: "javascript:alert(1)", mission: "x".repeat(900) });
    expect(clean).toEqual({ mission: "x".repeat(400) });
  });
});

describe("delincuentes por mapa", () => {
  it("vienen 5 por defecto y en /admin se pueden poner de 1 a 8", () => {
    expect(DEFAULT_MISSIONS.every((m) => m.suspects === 5)).toBe(true);
    expect(sanitizeOverride({ suspects: "7" }).suspects).toBe(7);
    expect(sanitizeOverride({ suspects: "0" }).suspects).toBeUndefined();
    expect(sanitizeOverride({ suspects: "9" }).suspects).toBeUndefined();
    expect(sanitizeOverride({ suspects: "2.5" }).suspects).toBeUndefined();
    expect(mergeMissions({ bogota: { suspects: 3 } })[0].suspects).toBe(3);
  });
});
