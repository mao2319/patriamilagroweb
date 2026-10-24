import { describe, expect, it } from "vitest";
import { cleanName, nameProblem, validCountry, validId } from "@/lib/ranking";

describe("ranking", () => {
  it("revisa los nombres con las mismas reglas del juego", () => {
    expect(nameProblem("ab")).toBe("short");
    expect(nameProblem("x".repeat(17))).toBe("long");
    expect(nameProblem("Juan $$$")).toBe("chars");
    expect(nameProblem("el MalParido")).toBe("rude");
    expect(nameProblem("  Capitán   Andrés ")).toBeNull();
    expect(cleanName("  Capitán   Andrés ")).toBe("Capitán Andrés");
  });

  it("acepta solo ids y países con forma válida", () => {
    expect(validId("123e4567-e89b-42d3-a456-426614174000")).toBe(true);
    expect(validId("1; drop table players")).toBe(false);
    expect(validCountry("CO")).toBe("CO");
    expect(validCountry("col")).toBeNull();
  });
});
