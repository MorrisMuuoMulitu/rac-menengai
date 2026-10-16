import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { AccountProvider } from "./account";
import { lazy } from "react";

/* The sign-in SDK is its own chunk and nothing else waits for it. */
const ClerkBridge = lazy(() => import("./clerk"));

export default function AcademyLayout() {
  return (
    <AccountProvider>
      <Suspense fallback={null}>
        <ClerkBridge />
      </Suspense>
      <Outlet />
    </AccountProvider>
  );
}
