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
  /** True when this deployment has a sign-in provider configured. */
  available: boolean;
  signedIn: boolean;
  name: string | null;
  email: string | null;
  /** Short-lived session token for the API. Resolves to null when signed out. */
  token: () => Promise<string | null>;
  /** Opens the sign-in surface, or null when no provider is configured. */
  signIn: (() => void) | null;
}

export const ANONYMOUS: Account = {
  available: false,
  signedIn: false,
  name: null,
  email: null,
  token: async () => null,
  signIn: null,
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
