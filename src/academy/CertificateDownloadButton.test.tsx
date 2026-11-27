// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CertificateDownloadButton } from "./CertificateDownloadButton";

const download = vi.hoisted(() => vi.fn());
vi.mock("./certificate-pdf", () => ({ downloadCertificatePdf: download }));

afterEach(() => {
  cleanup();
  download.mockReset();
});

describe("CertificateDownloadButton", () => {
  it("downloads the completed certificate directly from the learner portal", async () => {
    download.mockResolvedValue(undefined);
    render(
      <CertificateDownloadButton
        name="Amina Wanjiru"
        photo={null}
        completedAt="2026-11-27T09:30:00.000Z"
        score={18}
        total={20}
        certificateNumber="RACMNG-2026-2027-01"
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Download certificate" }),
    );
    await vi.waitFor(() =>
      expect(download).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        "Amina Wanjiru",
      ),
    );
  });
});
