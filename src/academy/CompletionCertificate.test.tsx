// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CompletionCertificate } from "./CompletionCertificate";

const download = vi.hoisted(() => vi.fn());
vi.mock("./certificate-pdf", () => ({ downloadCertificatePdf: download }));

afterEach(cleanup);

describe("completion certificate", () => {
  it("lets the learner change and save the printed name", () => {
    const save = vi.fn();
    render(
      <CompletionCertificate
        name="Amina Wanjiru"
        email="amina@example.com"
        photo={null}
        completedAt="2026-11-27T09:30:00.000Z"
        score={18}
        total={20}
        certificateNumber="RACMNG-2026-2027-01"
        busy={false}
        onSave={save}
      />,
    );

    const input = screen.getByLabelText(/Name on certificate/i);
    fireEvent.change(input, { target: { value: "Amina W. Mwangi" } });
    fireEvent.click(
      screen.getByRole("button", { name: "Save certificate details" }),
    );

    expect(save).toHaveBeenCalledWith("Amina W. Mwangi", null);
    expect(screen.getByText(/This records completion/)).toBeTruthy();
  });

  it("downloads a generated certificate PDF", async () => {
    download.mockResolvedValue(undefined);
    render(
      <CompletionCertificate
        name="Wanjiku Nguru"
        email="wanjikunguru9@gmail.com"
        photo={null}
        completedAt="2026-11-27T11:09:42.272Z"
        score={20}
        total={20}
        certificateNumber="RACMNG-2026-2027-01"
        busy={false}
        onSave={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Download PDF" }));

    await waitFor(() =>
      expect(download).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        "Wanjiku Nguru",
      ),
    );
  });

  it("shows a saved certificate portrait", () => {
    render(
      <CompletionCertificate
        name="Wanjiku Nguru"
        email="wanjikunguru9@gmail.com"
        photo="data:image/jpeg;base64,cGhvdG8="
        completedAt="2026-11-27T11:09:42.272Z"
        score={20}
        total={20}
        certificateNumber="RACMNG-2026-2027-01"
        busy={false}
        onSave={vi.fn()}
      />,
    );

    expect(screen.getByAltText("Portrait of Wanjiku Nguru")).toBeTruthy();
  });

  it("shows the president's signature and role", () => {
    render(
      <CompletionCertificate
        name="Amina Wanjiru"
        email="amina@example.com"
        photo={null}
        completedAt="2026-11-27T09:30:00.000Z"
        score={18}
        total={20}
        certificateNumber="RACMNG-2026-2027-01"
        busy={false}
        onSave={vi.fn()}
      />,
    );

    expect(
      screen.getByAltText("Signature of Wanjiku Nguru, President"),
    ).toBeTruthy();
    expect(
      screen.getAllByText("President, Rotaract Club of Menengai"),
    ).toHaveLength(2);
    expect(screen.getByAltText("Thee Magicals, the club mantra")).toBeTruthy();
    expect(screen.getAllByText("RACMNG-2026-2027-01")).toHaveLength(
      2,
    );
    expect(
      screen.getAllByLabelText("QR code to verify this certificate"),
    ).toHaveLength(1);
  });
});
