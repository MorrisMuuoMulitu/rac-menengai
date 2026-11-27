// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import VerifyCertificatePage from "./VerifyCertificate";
import { AcademyError } from "../lib/academy";

const verify = vi.hoisted(() => vi.fn());
vi.mock("../lib/academy", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/academy")>()),
  verifyCertificate: verify,
}));

afterEach(() => {
  cleanup();
  verify.mockReset();
});

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <VerifyCertificatePage />
    </MemoryRouter>,
  );
}

describe("certificate verification", () => {
  it("shows the public certificate record without private learner data", async () => {
    verify.mockResolvedValue({
      valid: true,
      certificate: {
        number: "RACMNG-2026-2027-01",
        name: "Wanjiku Nguru",
        completedAt: "2026-11-27T11:09:42.272Z",
        courseTitle: "Rotaract, from the ground up",
        issuedBy: "Rotaract Club of Menengai",
        president: "Wanjiku Nguru",
        rotaryYear: "2026-2027",
      },
    });

    renderAt("/verify?number=RACMNG-2026-2027-01");

    expect(await screen.findByText("Wanjiku Nguru")).toBeTruthy();
    expect(screen.getByText("Verified")).toBeTruthy();
    expect(screen.getByText("RACMNG-2026-2027-01")).toBeTruthy();
    expect(screen.getByText(/27 November 2026/)).toBeTruthy();
    expect(screen.queryByText(/wanjikunguru9@gmail.com/)).toBeNull();
  });

  it("rejects an unknown certificate number", async () => {
    verify.mockRejectedValue(new AcademyError("Certificate not found.", 404));

    renderAt("/verify?number=RACMNG-2026-2027-99");

    expect(await screen.findByText("Certificate not found")).toBeTruthy();
  });
});
