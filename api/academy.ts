/**
 * Vercel function for the membership academy.
 *
 * Dependencies are built on first request rather than at import time, so a
 * deployment missing its database or Clerk key returns a clear error instead
 * of failing to load the function at all.
 */

declare const process: { env: Record<string, string | undefined> };

import { createAcademyHandler } from "../server/academy.js";
import { createActorResolver } from "../server/academy-auth.js";
import {
  createPostgresRepository,
  type AcademyRepository,
} from "../server/academy-db.js";

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

let repository: AcademyRepository | null = null;
let academy: ReturnType<typeof createAcademyHandler> | null = null;
let blocked: string | null = null;

function build() {
  if (blocked) return null;
  if (academy) return academy;
  if (!repository) {
    const connectionString =
      process.env.DATABASE_URL ?? process.env.DATABASE_URL_UNPOOLED;
    if (!connectionString) {
      blocked =
        "Learning records are not connected on this deployment yet. Ask the membership team for the passcode course.";
      return null;
    }
    repository = createPostgresRepository(connectionString);
  }
  academy = createAcademyHandler(process.env, {
    resolveActor: createActorResolver(process.env),
    repository,
  });
  return academy;
}

export default async function handler(req: Request, res: Response) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  const academy = build();
  if (!academy)
    return res.status(503).json({ error: blocked, signedIn: false });
  return academy(req, res);
}
