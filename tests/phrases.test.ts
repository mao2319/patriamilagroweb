import { describe, expect, it } from "vitest";
import { MAX_PHRASE_LENGTH, MAX_PHRASES, phraseLines, sanitizePhrases } from "@/lib/phrases";

describe("frases de los delincuentes", () => {
  it("una por línea, sin vacías ni repetidas", () => {
    expect(phraseLines("¡Hola, {nombre}!\n\n  ¡Quieto!  \n¡Quieto!")).toEqual(["¡Hola, {nombre}!", "¡Quieto!"]);
  });

  it("descarta llaves que no sean {nombre} y corta las largas", () => {
    expect(phraseLines("¡{0} cayó!\n¡{otro}!\n¡Bien, {nombre}!")).toEqual(["¡Bien, {nombre}!"]);
    expect(phraseLines("a".repeat(400))[0]).toHaveLength(MAX_PHRASE_LENGTH);
  });

  it("guarda un máximo y tolera datos raros", () => {
    const many = Array.from({ length: 100 }, (_, i) => `Frase ${i}`).join("\n");
    expect(phraseLines(many)).toHaveLength(MAX_PHRASES);
    expect(sanitizePhrases(null)).toEqual({ capture: [], approach: [] });
    expect(sanitizePhrases({ capture: ["Uno", 3], approach: "Dos" })).toEqual({ capture: ["Uno"], approach: ["Dos"] });
  });
});
