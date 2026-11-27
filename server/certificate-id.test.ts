import { describe, expect, it } from "vitest";
import { CERTIFICATE_NUMBER_PATTERN } from "../shared/rotaract-academy/progress";
import { createCertificateNumber } from "./certificate-id";

describe("certificate numbers", () => {
  it("uses the full July-to-June Rotary year", () => {
    expect(createCertificateNumber("2026-11-27T11:09:42.272Z", 1)).toMatch(
      /^RACMNG-2026-2027-/,
    );
    expect(createCertificateNumber("2026-06-30T12:00:00.000Z", 1)).toMatch(
      /^RACMNG-2025-2026-/,
    );
    expect(createCertificateNumber("2026-07-01T12:00:00.000Z", 1)).toMatch(
      /^RACMNG-2026-2027-/,
    );
  });

  it("uses a zero-padded sequential number", () => {
    expect(createCertificateNumber("2026-11-27T11:09:42.272Z", 1)).toBe(
      "RACMNG-2026-2027-01",
    );
    expect(createCertificateNumber("2026-11-27T11:09:42.272Z", 27)).toBe(
      "RACMNG-2026-2027-27",
    );
    expect(createCertificateNumber("2026-11-27T11:09:42.272Z", 100)).toMatch(
      CERTIFICATE_NUMBER_PATTERN,
    );
  });
});
