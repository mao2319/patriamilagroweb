import { describe, expect, it } from "vitest";
import { activeSeason, sanitizeSeasons, suggestedDates, SEASON_THEMES } from "@/lib/seasons";

describe("temas de temporada", () => {
  it("activa el tema habilitado cuyas fechas incluyen el día", () => {
    const settings = sanitizeSeasons({
      halloween: { enabled: true, start: "2026-10-15", end: "2026-11-01" },
      navidad: { enabled: false, start: "2026-10-01", end: "2027-01-06" },
    });
    expect(activeSeason(settings, "2026-10-23")).toBe("halloween");
    expect(activeSeason(settings, "2026-11-02")).toBeNull();
    expect(activeSeason(settings, "2026-12-24")).toBeNull();
  });

  it("descarta temas desconocidos y fechas inválidas", () => {
    const settings = sanitizeSeasons({ pascua: { enabled: true, start: "2026-04-01", end: "2026-04-10" }, navidad: { enabled: true, start: "mañana", end: "2026-12-31" } });
    expect(settings).toEqual({});
  });

  it("la Navidad sugerida termina en enero del año siguiente", () => {
    const navidad = SEASON_THEMES.find((theme) => theme.id === "navidad")!;
    expect(suggestedDates(navidad, "2026-10-23")).toEqual({ start: "2026-12-01", end: "2027-01-06" });
  });
});
