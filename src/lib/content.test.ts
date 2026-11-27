import { describe, it, expect } from "vitest";
import { PUBLIC_EVENTS, PUBLIC_ACCOUNTS } from "../content";
import { MEMBERSHIP, PARTNERS, contactConfig } from "../data";
describe("public content boundaries", () => {
  it("requires approval for event publication", () => {
    expect(
      PUBLIC_EVENTS.every(
        (e) => e.approval && e.publicationStatus === "published",
      ),
    ).toBe(true);
  });
  it("hides unresolved social destinations", () => {
    expect(PUBLIC_ACCOUNTS.map((a) => a.platform)).toEqual([
      "Instagram",
      "Facebook",
    ]);
  });
  it("uses 18+ eligibility and avoids an unconfirmed induction mandate", () => {
    expect(MEMBERSHIP.whoCanJoin).toContain("18 and over");
  });
  it("publishes the club's confirmed direct contact details", () => {
    expect(contactConfig.email).toBe("menengairc@gmail.com");
    expect(contactConfig.phones).toEqual([
      "+254 718 220049",
      "+254 710 733421",
    ]);
  });
  it("publishes the medical outreach as completed with its supplied measures", () => {
    const medicalCamp = PUBLIC_EVENTS.find(
      (event) => event.slug === "medical-camp-2026",
    );
    expect(medicalCamp?.status).toBe("completed");
    expect(medicalCamp?.partners).toHaveLength(18);
    expect(
      medicalCamp?.impact?.map(({ value, label }) => [value, label]),
    ).toEqual([
      ["320", "People served"],
      ["15", "Blood donations"],
      ["18", "Cervical cancer screenings"],
      ["18", "Partner organisations"],
      ["70+", "Volunteers"],
    ]);
    expect(medicalCamp?.video?.src).toBe(
      "/videos/President-Wajiku-Medical-Camp.mp4",
    );
    expect(medicalCamp?.images).toHaveLength(12);
    expect(medicalCamp?.image).toBe(
      "/images/events/medical-camp-2026/medical-camp-2026-consultation-table.webp",
    );
    expect(medicalCamp?.report?.href).toBe(
      "/reports/rac-menengai-free-medical-outreach-partners-report-2026.pdf",
    );
    for (const name of medicalCamp?.partners ?? []) {
      expect(
        PARTNERS.find((partner) => partner.name === name),
        `${name} is missing from the site-wide partner list`,
      ).toBeTruthy();
    }
  });
});
