/**
 * Account state, with no sign-in library attached.
 *
 * The academy pages and the rest of the app import this file. It carries no
 * dependency on Clerk, so the course can be server-rendered and read by
 * anyone. A small lazily-loaded bridge writes real account state in when a
 * sign-in provider is configured — see `clerk.tsx`.
 */

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface Account {
  /**
   * False only while a configured sign-in provider is still starting up. When
   * no provider is configured there is nothing to wait for, so it is true.
   */
  ready: boolean;
  /** True when this deployment has a sign-in provider configured. */
  available: boolean;
  signedIn: boolean;
  name: string | null;
  email: string | null;
  /** Short-lived session token for the API. Resolves to null when signed out. */
  token: () => Promise<string | null>;
}

const HAS_SIGN_IN_PROVIDER = Boolean(
  String(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? "").trim(),
);

export const ANONYMOUS: Account = {
  ready: !HAS_SIGN_IN_PROVIDER,
  available: false,
  signedIn: false,
  name: null,
  email: null,
  token: async () => null,
};

const AccountContext = createContext<Account>(ANONYMOUS);
const PublisherContext = createContext<(account: Account) => void>(() => {});
const SignInSlotContext = createContext<HTMLElement | null>(null);
const SetSignInSlotContext = createContext<
  (node: HTMLElement | null) => void
>(() => {});

export function useAccount(): Account {
  return useContext(AccountContext);
}

/** Used by the sign-in bridge to publish real state. */
export function useAccountPublisher() {
  return useContext(PublisherContext);
}

/** The element the sign-in button is rendered into. Read by the bridge. */
export function useSignInSlot() {
  return useContext(SignInSlotContext);
}

/**
 * Marks where the sign-in button goes.
 *
 * Clerk's `<SignInButton>` has to *render* inside `<ClerkProvider>` — handing
 * the element around through context puts it in the tree outside the provider
 * and throws. So the page renders this mount point and the bridge portals the
 * button into it, which keeps the button inside the provider and Clerk out of
 * the main bundle.
 */
export function SignInSlot() {
  const setSlot = useContext(SetSignInSlotContext);
  return <span className="academy-signin-slot" ref={setSlot} />;
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account>(ANONYMOUS);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  return (
    <AccountContext.Provider value={account}>
      <PublisherContext.Provider value={setAccount}>
        <SignInSlotContext.Provider value={slot}>
          <SetSignInSlotContext.Provider value={setSlot}>
            {children}
          </SetSignInSlotContext.Provider>
        </SignInSlotContext.Provider>
      </PublisherContext.Provider>
    </AccountContext.Provider>
  );
}
