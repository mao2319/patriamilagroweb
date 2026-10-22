import { describe, expect, it } from "vitest";
import { detectPlatform, storeOrder } from "@/lib/platform";
import { pickLocale } from "@/i18n/dictionaries";

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1";
const IPAD_AS_MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15";
const ANDROID = "Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36";
const WINDOWS = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36";

describe("detectPlatform", () => {
  it("reconoce iOS, iPad que se presenta como Mac, Android y escritorio", () => {
    expect(detectPlatform({ userAgent: IPHONE })).toBe("ios");
    expect(detectPlatform({ userAgent: IPAD_AS_MAC, maxTouchPoints: 5 })).toBe("ios");
    expect(detectPlatform({ userAgent: IPAD_AS_MAC, maxTouchPoints: 0 })).toBe("desktop");
    expect(detectPlatform({ userAgent: ANDROID })).toBe("android");
    expect(detectPlatform({ userAgent: "", uaPlatform: "Android" })).toBe("android");
    expect(detectPlatform({ userAgent: WINDOWS })).toBe("desktop");
  });

  it("sin pistas es desconocida", () => {
    expect(detectPlatform({})).toBe("unknown");
  });
});

describe("storeOrder", () => {
  it("prioriza la tienda del dispositivo y muestra todas en los demás casos", () => {
    expect(storeOrder("ios")[0]).toBe("appStore");
    expect(storeOrder("android")[0]).toBe("googlePlay");
    expect(storeOrder("unknown")).toHaveLength(3);
  });
});

describe("pickLocale", () => {
  it("usa el idioma del navegador si existe y español por defecto", () => {
    expect(pickLocale("en-US,en;q=0.9")).toBe("en");
    expect(pickLocale(["fr-FR", "es-CO"])).toBe("es");
    expect(pickLocale("de-DE")).toBe("es");
    expect(pickLocale(null)).toBe("es");
  });
});
