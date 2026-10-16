import { describe, it, expect } from "vitest";
import { CLUB_ORIGIN, LEGACY_ORIGIN, trustedSiteOrigins } from "./site-origin";
describe("custom domain origin migration", () => {
  it("accepts the club domain and its existing Vercel alias", () => {
    for (const origin of [CLUB_ORIGIN, LEGACY_ORIGIN]) {
      const trusted = trustedSiteOrigins(origin);
      expect(trusted.has(CLUB_ORIGIN)).toBe(true);
      expect(trusted.has(LEGACY_ORIGIN)).toBe(true);
      expect(trusted.has("https://rotaractmenengai.org.evil.example")).toBe(false);
    }
  });
  it("keeps explicitly configured local or other origins isolated", () => {
    expect([...trustedSiteOrigins("http://localhost:5173")]).toEqual(["http://localhost:5173"]);
  });
});
