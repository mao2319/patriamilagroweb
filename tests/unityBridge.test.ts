import { describe, expect, it } from "vitest";
import { formatDuration, parseGameEvent } from "@/lib/unityBridge";

describe("parseGameEvent", () => {
  it("acepta los eventos válidos del juego", () => {
    expect(parseGameEvent({ type: "ready" })).toEqual({ type: "ready" });
    expect(
      parseGameEvent({ type: "levelCompleted", levelId: "bogota_plaza_central", timeSeconds: 258.4, score: 5240, objectivesDone: 3, objectivesTotal: 3 }),
    ).toMatchObject({ type: "levelCompleted", score: 5240 });
    expect(parseGameEvent({ type: "levelFailed", levelId: "bogota_plaza_central", reason: "TimeUp" })).toMatchObject({ reason: "TimeUp" });
  });

  it("descarta lo que no es válido", () => {
    expect(parseGameEvent(null)).toBeNull();
    expect(parseGameEvent("ready")).toBeNull();
    expect(parseGameEvent({ type: "otro" })).toBeNull();
    expect(parseGameEvent({ type: "levelCompleted", levelId: "<script>", timeSeconds: 1, score: 1, objectivesDone: 1, objectivesTotal: 1 })).toBeNull();
    expect(parseGameEvent({ type: "levelCompleted", levelId: "a", timeSeconds: -1, score: 1, objectivesDone: 1, objectivesTotal: 1 })).toBeNull();
    expect(parseGameEvent({ type: "levelCompleted", levelId: "a", timeSeconds: 1, score: 1.5, objectivesDone: 1, objectivesTotal: 1 })).toBeNull();
    expect(parseGameEvent({ type: "levelCompleted", levelId: "a", timeSeconds: 1, score: 1, objectivesDone: 4, objectivesTotal: 3 })).toBeNull();
    expect(parseGameEvent({ type: "levelFailed", levelId: "a", reason: "<b>" })).toBeNull();
  });
});

describe("formatDuration", () => {
  it("muestra minutos y segundos", () => {
    expect(formatDuration(258.4)).toBe("4:18");
    expect(formatDuration(5)).toBe("0:05");
    expect(formatDuration(-3)).toBe("0:00");
  });
});
