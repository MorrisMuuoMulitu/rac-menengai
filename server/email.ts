export interface EmailMessage {
  to: string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  idempotencyKey?: string;
}

export type EmailSender = (message: EmailMessage) => Promise<{ id: string }>;

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );
}

/** Keep line breaks and header injection out of subjects. */
function subjectLine(value: string): string {
  return value
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, 180);
}

export function applicationEmail(input: {
  applicantName: string;
  applicantEmail: string;
  location: string;
  score: number;
  total: number;
  submittedAt: string;
  queueUrl: string;
}): Omit<EmailMessage, "to" | "idempotencyKey"> {
  const name = input.applicantName.trim();
  const location = input.location.trim();
  const submitted = new Date(input.submittedAt).toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  });
  const subject = subjectLine(
    `Rotaract Club of Menengai: new membership application from ${name}`,
  );
  const text = [
    "Rotaract Club of Menengai · Menengai Academy",
    "",
    `${name} has submitted a membership application.`,
    "",
    `Email: ${input.applicantEmail}`,
    `Location: ${location || "Not provided"}`,
    `Course assessment: ${input.score}/${input.total}`,
    `Submitted: ${submitted} EAT`,
    "",
    `Review the application: ${input.queueUrl}`,
    "",
    "The queue is private. Sign in with an approved reviewer email to read it.",
  ].join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;color:#222b31;line-height:1.6;max-width:620px;margin:0 auto">
      <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#bd164b;font-weight:700;margin:0 0 14px">Rotaract Club of Menengai · Menengai Academy</p>
      <h1 style="font-size:28px;line-height:1.15;margin:0 0 18px">New membership application</h1>
      <p><strong>${escapeHtml(name)}</strong> has submitted an application for review.</p>
      <table style="border-collapse:collapse;width:100%;margin:20px 0">
        <tr><td style="padding:7px 0;color:#68727a">Email</td><td style="padding:7px 0"><strong>${escapeHtml(input.applicantEmail)}</strong></td></tr>
        <tr><td style="padding:7px 0;color:#68727a">Location</td><td style="padding:7px 0">${escapeHtml(location || "Not provided")}</td></tr>
        <tr><td style="padding:7px 0;color:#68727a">Assessment</td><td style="padding:7px 0">${input.score}/${input.total}</td></tr>
        <tr><td style="padding:7px 0;color:#68727a">Submitted</td><td style="padding:7px 0">${escapeHtml(submitted)} EAT</td></tr>
      </table>
      <p style="margin:24px 0"><a href="${escapeHtml(input.queueUrl)}" style="display:inline-block;background:#bd164b;color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:8px">Open the review queue</a></p>
      <p style="font-size:13px;color:#68727a">The queue is private. Sign in with an approved reviewer email to read it.</p>
    </div>
  `;
  return { subject, text, html };
}

export function createResendEmailSender(
  env: Record<string, string | undefined>,
): EmailSender | null {
  const apiKey = env.RESEND_API_KEY;
  const from =
    env.ACADEMY_EMAIL_FROM ??
    env.CONTACT_FROM ??
    "Rotaract Club of Menengai <academy@rotaractmenengai.org>";
  if (!apiKey) return null;

  return async function sendEmail(message) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(message.idempotencyKey
          ? { "Idempotency-Key": message.idempotencyKey }
          : {}),
      },
      body: JSON.stringify({
        from,
        to: message.to,
        subject: message.subject,
        text: message.text,
        ...(message.html ? { html: message.html } : {}),
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    const result = (await response.json()) as { id?: string };
    if (!response.ok || !result.id) throw new Error("Email delivery rejected");
    return { id: result.id };
  };
}
