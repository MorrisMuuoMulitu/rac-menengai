import { afterEach, describe, expect, it, vi } from "vitest";
import {
  applicationEmail,
  contactEnquiryEmail,
  createResendEmailSender,
  learnerDeletionAdminEmail,
  learnerRecordDeletedEmail,
} from "./email";

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

  it("uses the branded email shell for website enquiries", () => {
    const message = contactEnquiryEmail({
      name: "Amina",
      contact: "amina@example.com",
      interest: "Join the club",
      message: "I would like to visit a Thursday fellowship.",
    });
    expect(message.subject).toContain("website enquiry");
    expect(message.html).toContain("Rotaract Club of Menengai");
    expect(message.html).toContain("amina@example.com");
    expect(message.text).toContain("I would like to visit");
  });

  it("confirms a learner deletion to the learner and the acting officer", () => {
    const deletedAt = "2026-11-27T15:00:00.000Z";
    const learner = learnerRecordDeletedEmail({
      learnerName: "Amina Wanjiru",
      deletedAt,
      contactEmail: "menengairc@gmail.com",
    });
    const admin = learnerDeletionAdminEmail({
      learnerName: "Amina Wanjiru",
      learnerEmail: "amina@example.com",
      deletedAt,
    });
    expect(learner.html).toContain("Your learner record was deleted");
    expect(learner.html).toContain("Sign-in account");
    expect(admin.html).toContain("Learner record deleted");
    expect(admin.html).toContain("Progress, attempts, notes and application");
  });

  it("is unavailable when the provider key is missing", () => {
    expect(createResendEmailSender({})).toBeNull();
  });
});
