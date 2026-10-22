import { describe, expect, it } from "vitest";
import { validateStoreUrl } from "@/config/stores";

describe("validateStoreUrl", () => {
  it("acepta enlaces https de la tienda correcta", () => {
    expect(validateStoreUrl("appStore", "https://apps.apple.com/co/app/id123")).toBe("https://apps.apple.com/co/app/id123");
    expect(validateStoreUrl("googlePlay", "https://play.google.com/store/apps/details?id=com.x")).not.toBeNull();
    expect(validateStoreUrl("roblox", "https://www.roblox.com/games/1/x")).not.toBeNull();
  });

  it("devuelve null si falta, no es https o es de otro dominio", () => {
    expect(validateStoreUrl("appStore", undefined)).toBeNull();
    expect(validateStoreUrl("appStore", "   ")).toBeNull();
    expect(validateStoreUrl("appStore", "http://apps.apple.com/app")).toBeNull();
    expect(validateStoreUrl("googlePlay", "https://apps.apple.com/app")).toBeNull();
    expect(validateStoreUrl("roblox", "no es una url")).toBeNull();
  });
});
