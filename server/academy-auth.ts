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

type ClerkUser = {
  primaryEmailAddressId?: string | null;
  emailAddresses?: { id: string; emailAddress: string }[];
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
};

export function primaryEmail(user: ClerkUser): string | null {
  const addresses = user.emailAddresses ?? [];
  const primary = addresses.find(
    (address) => address.id === user.primaryEmailAddressId,
  );
  const chosen = primary ?? addresses[0];
  return chosen ? chosen.emailAddress.trim().toLowerCase() : null;
}

export function displayNameFor(user: ClerkUser): string | null {
  const name = [user.firstName, user.lastName]
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
  const allowed = reviewerAllowlist(env.ACADEMY_REVIEWER_EMAILS);
  if (!secretKey) return async () => null;
  const clerk = createClerkClient({ secretKey });

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
      return {
        userId: auth.userId,
        email,
        displayName: displayNameFor(user),
        reviewer: email !== null && allowed.has(email),
      };
    } catch {
      return null;
    }
  };
}
