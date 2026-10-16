/**
 * Who is asking, and are they allowed to review applications.
 *
 * Reviewer status is decided by the server from a verified email address on a
 * signed-in session. It is never read from the browser, from a header the
 * caller controls, or from local storage.
 */

import { createClerkClient } from "@clerk/backend";

export interface Actor {
  userId: string;
  email: string | null;
  displayName: string | null;
  reviewer: boolean;
}

export interface AuthRequest {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export function reviewerAllowlist(value: string | undefined): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter((entry) => entry.includes("@")),
  );
}

/**
 * The user object arrives camelCase from `@clerk/backend` and snake_case from
 * the REST API directly. Both are accepted, because reading only one shape
 * means a future change to the SDK silently resolves nobody as an officer.
 */
interface ClerkEmail {
  id: string;
  emailAddress?: string;
  email_address?: string;
  verification?: { status?: string } | null;
}

export interface ClerkUser {
  primaryEmailAddressId?: string | null;
  primary_email_address_id?: string | null;
  emailAddresses?: ClerkEmail[];
  email_addresses?: ClerkEmail[];
  firstName?: string | null;
  first_name?: string | null;
  lastName?: string | null;
  last_name?: string | null;
  username?: string | null;
}

function addressesOf(user: ClerkUser): ClerkEmail[] {
  return user.emailAddresses ?? user.email_addresses ?? [];
}

function choosePrimary(user: ClerkUser): ClerkEmail | null {
  const addresses = addressesOf(user);
  const primaryId =
    user.primaryEmailAddressId ?? user.primary_email_address_id ?? null;
  return addresses.find((address) => address.id === primaryId) ?? addresses[0] ?? null;
}

function readAddress(entry: ClerkEmail | null): string | null {
  const value = entry?.emailAddress ?? entry?.email_address;
  return typeof value === "string" && value.trim()
    ? value.trim().toLowerCase()
    : null;
}

/** The account's primary address, verified or not. Used for display and contact. */
export function primaryEmail(user: ClerkUser): string | null {
  return readAddress(choosePrimary(user));
}

/**
 * The primary address only when Clerk has confirmed it. Officer status is
 * decided on this one: an unconfirmed address is a claim, not evidence.
 */
export function verifiedPrimaryEmail(user: ClerkUser): string | null {
  const chosen = choosePrimary(user);
  if (!chosen) return null;
  if ((chosen.verification ?? {}).status !== "verified") return null;
  return readAddress(chosen);
}

export function displayNameFor(user: ClerkUser): string | null {
  const name = [user.firstName ?? user.first_name, user.lastName ?? user.last_name]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(" ")
    .trim();
  if (name) return name;
  return user.username?.trim() || null;
}

export type ActorResolver = (request: AuthRequest) => Promise<Actor | null>;

/**
 * Build the resolver from the environment. Returns a resolver that always
 * declines when Clerk is not configured, so the site degrades to
 * "sign-in unavailable" instead of trusting an unauthenticated caller.
 */
export function createActorResolver(
  env: Record<string, string | undefined>,
): ActorResolver {
  const secretKey = env.CLERK_SECRET_KEY;
  /*
   * The publishable key is not optional here. This instance serves its
   * Frontend API from a custom domain, and without the key the SDK cannot work
   * out which host to verify tokens against — `authenticateRequest` throws
   * "Publishable key is missing" and every request looks signed out.
   */
  const publishableKey =
    env.CLERK_PUBLISHABLE_KEY ?? env.VITE_CLERK_PUBLISHABLE_KEY;
  const allowed = reviewerAllowlist(env.ACADEMY_REVIEWER_EMAILS);
  if (!secretKey || !publishableKey) return async () => null;
  const clerk = createClerkClient({ secretKey, publishableKey });

  return async function resolveActor(request: AuthRequest) {
    try {
      const state = await clerk.authenticateRequest(
        request as unknown as Parameters<typeof clerk.authenticateRequest>[0],
        {},
      );
      if (!state.isSignedIn) return null;
      const auth = state.toAuth();
      if (!auth?.userId) return null;
      const user = (await clerk.users.getUser(auth.userId)) as ClerkUser;
      const email = primaryEmail(user);
      const verified = verifiedPrimaryEmail(user);
      return {
        userId: auth.userId,
        email,
        displayName: displayNameFor(user),
        reviewer: verified !== null && allowed.has(verified),
      };
    } catch {
      /*
       * Swallowing this is what hid a broken sign-in for hours: requests came
       * back signed out and looked like a client problem. Log it, so the next
       * misconfiguration shows up in the deployment logs.
       */
      console.error("[academy] clerk authentication failed");
      return null;
    }
  };
}
