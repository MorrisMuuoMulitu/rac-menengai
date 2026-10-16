/**
 * The sign-in bridge.
 *
 * This is the only file in the project that imports a sign-in SDK, and it is
 * loaded by itself so that every other page stays on its own budget. It
 * publishes account state into `account.tsx`, which is what the pages actually
 * read.
 */

import { useEffect, useMemo } from "react";
import { ClerkProvider, useAuth, useUser } from "@clerk/react";
import { useAccountPublisher, type Account } from "./account";

const PUBLISHABLE_KEY = String(
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? "",
).trim();

const APPEARANCE = {
  variables: {
    colorPrimary: "#bd164b",
    colorText: "#222b31",
    colorTextSecondary: "#43536b",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#222b31",
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif",
    borderRadius: "10px",
  },
  elements: {
    card: "academy-clerk-card",
    headerTitle: "academy-clerk-title",
    formButtonPrimary: "academy-clerk-button",
  },
} as const;

function Publisher() {
  const publish = useAccountPublisher();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const value = useMemo<Account>(
    () => ({
      ready: isLoaded,
      available: isLoaded,
      signedIn: Boolean(isLoaded && isSignedIn),
      name: user?.fullName ?? user?.username ?? null,
      email: user?.primaryEmailAddress?.emailAddress ?? null,
      token: async () => {
        /* Never make the page wait for Clerk: signed out is the honest answer
           until it has loaded, and the caller re-asks when `ready` flips. */
        if (!isLoaded || !isSignedIn) return null;
        try {
          return (await getToken()) ?? null;
        } catch {
          return null;
        }
      },
    }),
    [isLoaded, isSignedIn, getToken, user],
  );

  useEffect(() => {
    publish(value);
  }, [publish, value]);

  return null;
}

export default function ClerkBridge() {
  if (!PUBLISHABLE_KEY) return null;
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={APPEARANCE}
      afterSignOutUrl="/membership/academy"
      signInFallbackRedirectUrl="/membership/academy"
      signUpFallbackRedirectUrl="/membership/academy"
    >
      <Publisher />
    </ClerkProvider>
  );
}
