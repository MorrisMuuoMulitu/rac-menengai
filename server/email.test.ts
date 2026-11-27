import { afterEach, describe, expect, it, vi } from "vitest";
import { applicationEmail, createResendEmailSender } from "./email";

afterEach(() => vi.unstubAllGlobals());

describe("academy email", () => {
  it("builds a useful application notice without private answers", () => {
    const message = applicationEmail({
      applicantName: "Amina Wanjiru",
      applicantEmail: "amina@example.com",
      location: "Nakuru",
      score: 18,
      total: 20,
      submittedAt: "2026-11-27T11:00:00.000Z",
      queueUrl: "https://rotaractmenengai.org/membership/queue",
    });

    expect(message.subject).toBe(
      "Rotaract Club of Menengai: new membership application from Amina Wanjiru",
    );
    expect(message.text).toContain("Amina Wanjiru");
    expect(message.text).toContain("18/20");
    expect(message.text).not.toContain("motivation");
    expect(message.html).toContain("Open the review queue");
  });

  it("sends through Resend with an idempotency key", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "email_123" }),
    });
    vi.stubGlobal("fetch", fetcher);
    const send = createResendEmailSender({
      RESEND_API_KEY: "re_test",
      ACADEMY_EMAIL_FROM: "Rotaract Club of Menengai <academy@example.com>",
    });
    expect(send).toBeTruthy();

    await send!({
      to: ["morrismulitu@gmail.com"],
      subject: "New application",
      text: "Application received.",
      idempotencyKey: "application-submitted-123",
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    const [, options] = fetcher.mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer re_test");
    expect(options.headers["Idempotency-Key"]).toBe(
      "application-submitted-123",
    );
    expect(JSON.parse(options.body)).toMatchObject({
      from: "Rotaract Club of Menengai <academy@example.com>",
      to: ["morrismulitu@gmail.com"],
    });
  });

  it("is unavailable when the provider key is missing", () => {
    expect(createResendEmailSender({})).toBeNull();
  });
});
