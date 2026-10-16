/**
 * A real sign-in page.
 *
 * The academy used to open Clerk's modal from a button. That modal is a
 * floating overlay that decides for itself whether to mount, and when it
 * declined there was nothing to see: the button did nothing, with no error on
 * the page and nothing in the console. A page cannot fail that quietly — if it
 * is broken, it is visibly broken.
 *
 * This file is loaded as its own chunk so Clerk still stays off every other
 * page's critical path.
 */

import { ClerkProvider, SignIn } from "@clerk/react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PageMeta } from "../components/ui";
import "../academy.css";

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
} as const;

export default function SignInPage() {
  return (
    <>
      <PageMeta
        title="Sign in"
        description="Sign in to the Rotaract Club of Menengai membership academy."
        robots="noindex"
      />
      <section className="academy-signin-page">
        <div className="container academy-signin-page-inner">
          <Link className="academy-signin-page-back" to="/membership/academy">
            <ArrowLeft size={15} aria-hidden="true" /> Back to the course
          </Link>
          <h1>Sign in to save your progress</h1>
          <p>
            Your place in the course, your marked answers and your proposal are
            kept against your account, so you can stop and come back on any
            device.
          </p>
          {PUBLISHABLE_KEY ? (
            <ClerkProvider
              publishableKey={PUBLISHABLE_KEY}
              appearance={APPEARANCE}
              signInFallbackRedirectUrl="/membership/academy"
              signUpFallbackRedirectUrl="/membership/academy"
            >
              <SignIn routing="hash" />
            </ClerkProvider>
          ) : (
            <p className="academy-notice info">
              Sign-in is not configured on this deployment. Ask the membership
              team for the passcode course instead.
            </p>
          )}
          <p className="academy-hint">
            Questions about your account? Talk to the membership team at a
            fellowship.
          </p>
        </div>
      </section>
    </>
  );
}
