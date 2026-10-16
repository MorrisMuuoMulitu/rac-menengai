import { CLUB_ORIGIN, trustedSiteOrigins } from "./site-origin.js";
import { FULL_COURSE } from "./course.js";
export interface CourseRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}
export interface CourseResponse {
  status(code: number): CourseResponse;
  setHeader(key: string, value: string): void;
  json(body: unknown): void;
}
const COOKIE = "rac_orientation";
const MAX_AGE = 4 * 60 * 60;
const hex = (bytes: ArrayBuffer) =>
  Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
const header = (req: CourseRequest, name: string) => {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
};
async function digest(value: string) {
  return hex(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
  );
}
function equal(a: string, b: string) {
  let different = a.length ^ b.length;
  for (let i = 0; i < a.length; i++)
    different |= a.charCodeAt(i) ^ (b.charCodeAt(i) || 0);
  return different === 0;
}
export function createOrientationHandler(
  env: Record<string, string | undefined>,
  now = Date.now,
) {
  const attempts = new Map<string, { count: number; expires: number }>();
  const origin = env.SITE_ORIGIN ?? CLUB_ORIGIN;
  const permittedOrigins = trustedSiteOrigins(origin);
  const secure = origin.startsWith("https://") ? "; Secure" : "";
  const cookie = (value: string, age: number) =>
    `${COOKIE}=${value}; Path=/api/orientation; HttpOnly; SameSite=Strict; Max-Age=${age}${secure}`;
  async function key() {
    return crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(
        `${env.ORIENTATION_SESSION_SECRET}:${await digest(env.ORIENTATION_PASSCODE!)}`,
      ),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"],
    );
  }
  async function session(req: CourseRequest) {
    const value = header(req, "cookie")
      ?.split(";")
      .map((v) => v.trim())
      .find((v) => v.startsWith(`${COOKIE}=`))
      ?.slice(COOKIE.length + 1);
    if (!value || !/^\d{10}\.[a-f0-9]{32}\.[a-f0-9]{64}$/.test(value))
      return false;
    const [expiry, nonce, signature] = value.split(".");
    if (
      Number(expiry) <= Math.floor(now() / 1000) ||
      Number(expiry) > Math.floor(now() / 1000) + MAX_AGE
    )
      return false;
    const bytes = Uint8Array.from(signature.match(/../g)!, (byte) =>
      parseInt(byte, 16),
    );
    const verified = await crypto.subtle.verify(
      "HMAC",
      await key(),
      bytes,
      new TextEncoder().encode(`${expiry}.${nonce}`),
    );
    return verified ? Number(expiry) * 1000 : false;
  }
  return async (req: CourseRequest, res: CourseResponse) => {
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Vary", "Cookie");
    if (!["GET", "POST", "DELETE"].includes(req.method ?? "")) {
      res.setHeader("Allow", "GET, POST, DELETE");
      return res.status(405).json({ error: "Method not allowed." });
    }
    if (req.method !== "GET" && !permittedOrigins.has(header(req, "origin") ?? ""))
      return res.status(403).json({ error: "Origin not allowed." });
    if (req.method === "DELETE") {
      res.setHeader("Set-Cookie", cookie("", 0));
      return res.status(200).json({ locked: true });
    }
    if (
      !env.ORIENTATION_PASSCODE ||
      env.ORIENTATION_PASSCODE.length < 12 ||
      !env.ORIENTATION_SESSION_SECRET ||
      env.ORIENTATION_SESSION_SECRET.length < 32
    )
      return res.status(503).json({
        error: "Course access is not configured yet. Ask the membership team.",
      });
    if (req.method === "GET") {
      const expiresAt = await session(req);
      if (!expiresAt)
        return res
          .status(401)
          .json({ error: "A course passcode is required." });
      return res.status(200).json({ course: FULL_COURSE, expiresAt });
    }
    if (!header(req, "content-type")?.startsWith("application/json"))
      return res.status(415).json({ error: "Use application/json." });
    const body = req.body as { passcode?: unknown } | undefined;
    if (
      !body ||
      typeof body.passcode !== "string" ||
      body.passcode.length > 128
    )
      return res.status(400).json({ error: "Enter a valid passcode." });
    const ip = await digest(
      header(req, "x-forwarded-for")?.split(",")[0].trim() ?? "unknown",
    );
    for (const [key, record] of attempts)
      if (record.expires <= now()) attempts.delete(key);
    if (attempts.size >= 2000 && !attempts.has(ip))
      return res.status(429).json({ error: "Please try again later." });
    const record = attempts.get(ip) ?? {
      count: 0,
      expires: now() + 15 * 60 * 1000,
    };
    if (record.count >= 5) {
      res.setHeader(
        "Retry-After",
        String(Math.ceil((record.expires - now()) / 1000)),
      );
      return res
        .status(429)
        .json({ error: "Too many attempts. Try again in 15 minutes." });
    }
    record.count++;
    attempts.set(ip, record);
    if (
      !equal(
        await digest(body.passcode),
        await digest(env.ORIENTATION_PASSCODE),
      )
    )
      return res
        .status(401)
        .json({ error: "That passcode did not unlock the course." });
    attempts.delete(ip);
    const expiry = Math.floor(now() / 1000) + MAX_AGE;
    const nonce = hex(crypto.getRandomValues(new Uint8Array(16)).buffer);
    const payload = `${expiry}.${nonce}`;
    const signature = hex(
      await crypto.subtle.sign(
        "HMAC",
        await key(),
        new TextEncoder().encode(payload),
      ),
    );
    res.setHeader("Set-Cookie", cookie(`${payload}.${signature}`, MAX_AGE));
    return res
      .status(200)
      .json({ course: FULL_COURSE, expiresAt: expiry * 1000 });
  };
}
