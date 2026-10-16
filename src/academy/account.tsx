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
  /** Ends the session, or null when no provider is configured. */
  signOut: (() => Promise<void>) | null;
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
  signOut: null,
};

const AccountContext = createContext<Account>(ANONYMOUS);
const PublisherContext = createContext<(account: Account) => void>(() => {});

export function useAccount(): Account {
  return useContext(AccountContext);
}

/** Used by the sign-in bridge to publish real state. */
export function useAccountPublisher() {
  return useContext(PublisherContext);
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account>(ANONYMOUS);
  return (
    <AccountContext.Provider value={account}>
      <PublisherContext.Provider value={setAccount}>
        {children}
      </PublisherContext.Provider>
    </AccountContext.Provider>
  );
}
