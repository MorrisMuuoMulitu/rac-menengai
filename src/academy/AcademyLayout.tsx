import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import { AccountChip } from "./AccountChip";
import { AccountProvider, useAccount } from "./account";
import { lazy } from "react";

/* The sign-in SDK is its own chunk and nothing else waits for it. */
const ClerkBridge = lazy(() => import("./clerk"));

function AcademyIdentity() {
  const account = useAccount();
  return account.signedIn ? (
    <AccountChip tone="light" />
  ) : (
    <Link className="academy-header-signin" to="/membership/sign-in">
      Sign in
    </Link>
  );
}

export default function AcademyLayout() {
  return (
    <AccountProvider>
      <Suspense fallback={null}>
        <ClerkBridge />
      </Suspense>
      <div className="academy-workspace">
        <header className="academy-topbar">
          <Link className="academy-wordmark" to="/membership/academy">
            <strong>Menengai</strong>
            <span>Member Academy</span>
          </Link>
          <nav aria-label="Academy">
            <Link to="/membership/academy">My learning</Link>
            <Link to="/leadership">Club leadership</Link>
            <Link to="/membership">Club website</Link>
          </nav>
          <AcademyIdentity />
        </header>
        <Outlet />
      </div>
    </AccountProvider>
  );
}
