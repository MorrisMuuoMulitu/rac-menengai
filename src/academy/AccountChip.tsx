/**
 * Who is signed in, and the way out.
 *
 * Signing in used to leave no trace on the page — no name, no address, no way
 * to sign out — which made it reasonable to wonder whether it had worked at
 * all.
 */

import { LogOut } from "lucide-react";
import { useAccount } from "./account";

function initials(name: string | null, email: string | null): string {
  const source = (name ?? email ?? "").trim();
  if (!source) return "?";
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  if (parts.length >= 2)
    return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function AccountChip({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const account = useAccount();
  if (!account.signedIn) return null;

  return (
    <div className={`account-chip ${tone}`}>
      <span className="account-chip-avatar" aria-hidden="true">
        {initials(account.name, account.email)}
      </span>
      <span className="account-chip-who">
        <strong>{account.name ?? "Signed in"}</strong>
        {account.email ? <small>{account.email}</small> : null}
      </span>
      {account.signOut ? (
        <button
          type="button"
          className="account-chip-signout"
          onClick={() => void account.signOut?.()}
        >
          <LogOut size={14} aria-hidden="true" /> Sign out
        </button>
      ) : null}
    </div>
  );
}
