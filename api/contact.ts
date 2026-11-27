import { CLUB_ORIGIN, trustedSiteOrigins } from "../server/site-origin.js";
import { createActorResolver } from "../server/academy-auth.js";
import {
  createPostgresContactRepository,
  type ContactRepository,
} from "../server/contact-db.js";
import {
  contactEnquiryEmail,
  createResendEmailSender,
} from "../server/email.js";
import { validateContact, type Enquiry } from "../src/lib/contact.js";

declare const process: { env: Record<string, string | undefined> };

interface Request {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface Response {
  status(code: number): Response;
  json(body: unknown): void;
  setHeader(key: string, value: string): void;
}

const DEFAULT_CONTACT_RECIPIENTS = [
  "menengairc@gmail.com",
  "morrismulitu@gmail.com",
] as const;

const getHeader = (request: Request, key: string) => {
  const value = request.headers[key];
  return Array.isArray(value) ? value[0] : value;
};

async function hash(text: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

let repository: ContactRepository | null = null;
let repositoryUrl = "";
const resolveActor = createActorResolver(process.env);

function contactRepository(): ContactRepository | null {
  const connectionString =
    process.env.DATABASE_URL ?? process.env.DATABASE_URL_UNPOOLED;
  if (!connectionString) return null;
  if (!repository || repositoryUrl !== connectionString) {
    repository = createPostgresContactRepository(connectionString);
    repositoryUrl = connectionString;
  }
  return repository;
}

export default async function handler(req: Request, res: Response) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  const store = contactRepository();
  if (!store)
    return res
      .status(503)
      .json({ error: "The club’s contact service is not connected yet." });

  if (req.method === "GET") {
    const actor = await resolveActor(req);
    if (!actor?.reviewer)
      return res
        .status(403)
        .json({ error: "Enquiries are for club officers." });
    return res.status(200).json({
      signedIn: true,
      enquiries: await store.listEnquiries(),
    });
  }

  if (req.method === "DELETE") {
    const origin = getHeader(req, "origin");
    const permitted = process.env.SITE_ORIGIN ?? CLUB_ORIGIN;
    if (!origin || !trustedSiteOrigins(permitted).has(origin))
      return res.status(403).json({ error: "Origin not allowed." });
    const actor = await resolveActor(req);
    if (!actor?.reviewer)
      return res
        .status(403)
        .json({ error: "Enquiries are for club officers." });
    const id = new URL(
      req.url ?? "/api/contact",
      "https://example.com",
    ).searchParams.get("id");
    if (!id || !/^[0-9a-f-]{36}$/i.test(id))
      return res.status(400).json({ error: "Choose an enquiry." });
    const deleted = await store.deleteEnquiry(id);
    return deleted
      ? res.status(200).json({ deleted: true })
      : res.status(404).json({ error: "Enquiry not found." });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const origin = getHeader(req, "origin");
  const permitted = process.env.SITE_ORIGIN ?? CLUB_ORIGIN;
  if (!origin || !trustedSiteOrigins(permitted).has(origin))
    return res.status(403).json({ error: "Origin not allowed." });
  if (!getHeader(req, "content-type")?.startsWith("application/json"))
    return res.status(415).json({ error: "Use application/json." });
  if (
    !req.body ||
    typeof req.body !== "object" ||
    JSON.stringify(req.body).length > 12000
  )
    return res.status(400).json({ error: "Invalid enquiry." });

  const body = req.body as Partial<Enquiry>;
  if (
    ["name", "contact", "interest", "message", "company"].some(
      (key) =>
        body[key as keyof Enquiry] !== undefined &&
        typeof body[key as keyof Enquiry] !== "string",
    )
  )
    return res.status(400).json({ error: "Invalid enquiry fields." });

  const enquiry: Enquiry = {
    name: body.name ?? "",
    contact: body.contact ?? "",
    interest: body.interest ?? "",
    message: body.message ?? "",
    consent: body.consent === true,
    company: body.company ?? "",
  };
  if (enquiry.company)
    return res.status(400).json({ error: "Invalid enquiry." });
  const errors = validateContact(enquiry);
  if (Object.keys(errors).length)
    return res
      .status(422)
      .json({ error: "Check your enquiry.", fields: errors });

  try {
    const ip =
      getHeader(req, "x-vercel-forwarded-for") ??
      getHeader(req, "x-forwarded-for") ??
      "unknown";
    const ipHash = await hash(ip.split(",")[0].trim());
    const requests = await store.consumeRateLimit(`contact:${ipHash}`);
    if (requests > 5) {
      res.setHeader("Retry-After", "3600");
      return res
        .status(429)
        .json({ error: "Too many enquiries. Please try again later." });
    }

    const saved = await store.saveEnquiry({ ...enquiry, ipHash });
    let delivered = false;
    const sender = createResendEmailSender(process.env);
    const configuredRecipients =
      process.env.CONTACT_TO?.split(",")
        .map((address) => address.trim())
        .filter(Boolean) ?? [];
    const recipients = [
      ...new Set([...DEFAULT_CONTACT_RECIPIENTS, ...configuredRecipients]),
    ];
    if (sender && recipients?.length) {
      try {
        await sender({
          to: recipients,
          ...contactEnquiryEmail(enquiry),
          replyTo: enquiry.contact.includes("@")
            ? enquiry.contact.trim()
            : undefined,
          idempotencyKey: `contact-enquiry-${saved.id}`,
        });
        delivered = true;
      } catch {
        /* The enquiry stays available to officers if email delivery fails. */
      }
    }
    return res.status(200).json({ received: true, delivered });
  } catch {
    return res
      .status(503)
      .json({ error: "Your message could not be stored. Please try again." });
  }
}
