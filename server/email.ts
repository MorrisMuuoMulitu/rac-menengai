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

interface BrandedEmailInput {
  eyebrow: string;
  title: string;
  lead: string;
  details?: { label: string; value: string }[];
  message?: string;
  cta?: { label: string; href: string };
  footer?: string;
}

function brandedEmail(input: BrandedEmailInput): string {
  const details = input.details?.length
    ? `<table role="presentation" style="border-collapse:collapse;width:100%;margin:22px 0;border-top:1px solid #d8d2c6">
        ${input.details
          .map(
            (item) => `<tr>
              <td style="padding:10px 12px 10px 0;color:#5d686d;font-size:13px;vertical-align:top;width:34%">${escapeHtml(item.label)}</td>
              <td style="padding:10px 0;color:#172330;font-size:14px;vertical-align:top;border-bottom:1px solid #ebe5d9">${escapeHtml(item.value)}</td>
            </tr>`,
          )
          .join("")}
      </table>`
    : "";
  const message = input.message
    ? `<div style="margin:22px 0;padding:16px 18px;border-left:3px solid #bd164b;background:#f8f3e9;color:#354248;font-size:14px;line-height:1.7;white-space:pre-wrap">${escapeHtml(input.message)}</div>`
    : "";
  const cta = input.cta
    ? `<p style="margin:26px 0"><a href="${escapeHtml(input.cta.href)}" style="display:inline-block;background:#bd164b;color:#fff;text-decoration:none;font-weight:700;padding:13px 21px;border-radius:3px">${escapeHtml(input.cta.label)}</a></p>`
    : "";

  return `<div style="margin:0;padding:28px 12px;background:#eeede8;font-family:Arial,Helvetica,sans-serif;color:#354248">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
      <tr><td align="center">
        <div style="width:100%;max-width:620px;background:#fffdf8;border-top:7px solid #090e18;text-align:left">
          <div style="padding:24px 30px 18px;border-bottom:1px solid #d8d2c6">
            <img src="https://rotaractmenengai.org/images/branding/rotaract-menengai-lockup.webp" alt="Rotaract Club of Menengai" width="190" style="display:block;width:190px;max-width:100%;height:auto;border:0">
          </div>
          <div style="padding:30px">
            <p style="margin:0 0 10px;color:#bd164b;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">${escapeHtml(input.eyebrow)}</p>
            <h1 style="margin:0 0 16px;color:#172330;font-size:30px;line-height:1.12">${escapeHtml(input.title)}</h1>
            <p style="margin:0;color:#4f5c61;font-size:15px;line-height:1.7">${escapeHtml(input.lead)}</p>
            ${details}
            ${message}
            ${cta}
            <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #d8d2c6;color:#68727a;font-size:12px;line-height:1.6">${escapeHtml(input.footer ?? "Rotaract Club of Menengai · Nakuru, Kenya · Service Above Self")}</p>
          </div>
          <div style="padding:16px 30px;background:#090e18;color:#c8d2cf;font-size:11px;line-height:1.6">Rotaract Club of Menengai · Rotary District 9215<br>Thursday fellowship · 5:00–7:00 PM EAT · Nakuru Athletic Club</div>
        </div>
      </td></tr>
    </table>
  </div>`;
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
  const html = brandedEmail({
    eyebrow: "Menengai Academy · Membership",
    title: "New membership application",
    lead: `${name} has submitted an application for the membership team to review.`,
    details: [
      { label: "Applicant", value: name },
      { label: "Email", value: input.applicantEmail },
      { label: "Location", value: location || "Not provided" },
      { label: "Assessment", value: `${input.score}/${input.total}` },
      { label: "Submitted", value: `${submitted} EAT` },
    ],
    cta: { label: "Open the review queue", href: input.queueUrl },
    footer:
      "The queue is private. Sign in with an approved reviewer email to read it.",
  });
  return { subject, text, html };
}

export function contactEnquiryEmail(input: {
  name: string;
  contact: string;
  interest: string;
  message: string;
}): Omit<EmailMessage, "to" | "idempotencyKey"> {
  const subject = subjectLine(
    `Rotaract Club of Menengai website enquiry: ${input.interest}`,
  );
  const text = [
    "Rotaract Club of Menengai · Website enquiry",
    "",
    `Name: ${input.name}`,
    `Reply to: ${input.contact}`,
    `Topic: ${input.interest}`,
    "",
    input.message,
  ].join("\n");
  return {
    subject,
    text,
    html: brandedEmail({
      eyebrow: "Website enquiry",
      title: input.interest,
      lead: `${input.name} sent a message through the club website.`,
      details: [
        { label: "Name", value: input.name },
        { label: "Reply to", value: input.contact },
        { label: "Topic", value: input.interest },
      ],
      message: input.message,
      footer:
        "Reply directly to the sender using the contact details above. The enquiry is also stored in the officer dashboard.",
    }),
  };
}

export function learnerRecordDeletedEmail(input: {
  learnerName: string;
  deletedAt: string;
  contactEmail: string;
}): Omit<EmailMessage, "to" | "idempotencyKey"> {
  const deleted = new Date(input.deletedAt).toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  });
  return {
    subject: subjectLine("Rotaract Club of Menengai: academy record deleted"),
    text: [
      "Rotaract Club of Menengai · Menengai Academy",
      "",
      `${input.learnerName}, your Menengai Academy learner record was deleted by a club administrator on ${deleted} EAT.`,
      "",
      "This removes your course progress, assessment attempts, learner details and any membership application held in the academy.",
      "Your sign-in account has not been deleted.",
      "",
      `If you did not expect this, contact ${input.contactEmail}.`,
    ].join("\n"),
    html: brandedEmail({
      eyebrow: "Menengai Academy · Learner record",
      title: "Your learner record was deleted",
      lead: `${input.learnerName}, a club administrator deleted your Menengai Academy record on ${deleted} EAT.`,
      details: [
        { label: "Record", value: "Academy learner record" },
        { label: "Deleted", value: `${deleted} EAT` },
        { label: "Sign-in account", value: "Not deleted" },
      ],
      footer: `If you did not expect this action, contact ${input.contactEmail}.`,
    }),
  };
}

export function learnerDeletionAdminEmail(input: {
  learnerName: string;
  learnerEmail: string;
  deletedAt: string;
}): Omit<EmailMessage, "to" | "idempotencyKey"> {
  const deleted = new Date(input.deletedAt).toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  });
  return {
    subject: subjectLine(
      `Rotaract Club of Menengai: learner deleted — ${input.learnerName}`,
    ),
    text: [
      "Rotaract Club of Menengai · Learner administration",
      "",
      `You deleted the academy learner record for ${input.learnerName} (${input.learnerEmail}).`,
      `Time: ${deleted} EAT`,
      "",
      "Progress, attempts, notes and any membership application were deleted. The person's sign-in account was not changed.",
    ].join("\n"),
    html: brandedEmail({
      eyebrow: "Learner administration",
      title: "Learner record deleted",
      lead: "This confirms the deletion you completed in the Menengai Academy dashboard.",
      details: [
        { label: "Learner", value: input.learnerName },
        { label: "Learner email", value: input.learnerEmail },
        { label: "Deleted", value: `${deleted} EAT` },
        {
          label: "Removed",
          value: "Progress, attempts, notes and application",
        },
        { label: "Sign-in account", value: "Unchanged" },
      ],
      footer: "This is an automated record of an administrator action.",
    }),
  };
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
    const result = (await response.json()) as {
      id?: string;
      message?: string;
      name?: string;
    };
    if (!response.ok || !result.id) {
      console.error("Resend rejected email delivery", {
        status: response.status,
        name: result.name,
        message: result.message,
      });
      throw new Error(`Email delivery rejected (${response.status})`);
    }
    return { id: result.id };
  };
}
