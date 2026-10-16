import { CLUB_ORIGIN, trustedSiteOrigins } from "../server/site-origin.js";
declare const process: { env: Record<string, string | undefined> };
async function hash(text: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
import { validateContact, enquiryText, type Enquiry } from "../src/lib/contact.js";
interface Request {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
}
interface Response {
  status: (code: number) => Response;
  json: (body: unknown) => void;
  setHeader: (key: string, value: string) => void;
}
const getHeader = (req: Request, key: string) => {
  const value = req.headers[key];
  return Array.isArray(value) ? value[0] : value;
};
export default async function handler(req: Request, res: Response) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const origin = getHeader(req, "origin");
  const permitted =
    process.env.SITE_ORIGIN ?? CLUB_ORIGIN;
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
  const {
    RESEND_API_KEY,
    CONTACT_FROM,
    CONTACT_TO,
    UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN,
  } = process.env;
  if (
    !RESEND_API_KEY ||
    !CONTACT_FROM ||
    !CONTACT_TO ||
    !UPSTASH_REDIS_REST_URL ||
    !UPSTASH_REDIS_REST_TOKEN
  )
    return res
      .status(503)
      .json({
        error: "Direct delivery is unavailable. Please email the club.",
      });
  try {
    const ip =
      getHeader(req, "x-vercel-forwarded-for") ??
      getHeader(req, "x-forwarded-for") ??
      "unknown";
    const key = `menengai:enquiry:${await hash(ip.split(",")[0].trim())}`;
    const limit = await fetch(UPSTASH_REDIS_REST_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        "EVAL",
        "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],3600) end; return n",
        "1",
        key,
      ]),
      signal: AbortSignal.timeout(5000),
    });
    const value = (await limit.json()) as { result?: number };
    if (!limit.ok || typeof value.result !== "number")
      throw new Error("Rate limit unavailable");
    if (value.result > 5) {
      res.setHeader("Retry-After", "3600");
      return res
        .status(429)
        .json({ error: "Too many enquiries. Please try again later." });
    }
    const id = await hash(
      JSON.stringify(enquiry) + new Date().toISOString().slice(0, 10),
    );
    const delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": id,
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        subject: `Menengai enquiry: ${enquiry.interest.replace(/[\r\n]/g, " ")}`,
        text: enquiryText(enquiry),
        ...(enquiry.contact.includes("@")
          ? { reply_to: enquiry.contact.trim() }
          : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    const result = (await delivery.json()) as { id?: string };
    if (!delivery.ok || !result.id) throw new Error("Delivery rejected");
    return res.status(200).json({ delivered: true });
  } catch {
    return res
      .status(502)
      .json({
        error: "Your message was not sent. Please retry or email the club.",
      });
  }
}
