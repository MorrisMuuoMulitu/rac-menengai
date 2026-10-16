/**
 * Real sign-in and registration pages.
 *
 * These used to be Clerk's modal, a floating overlay that decides for itself
 * whether to mount. When it declined there was nothing to see: the button did
 * nothing, with no error on the page and nothing in the console. A page cannot
 * fail that quietly.
 *
 * Both live in one lazily-loaded chunk so Clerk stays off every other route.
 */

import { ClerkProvider, SignIn, SignUp } from "@clerk/react";
import { ArrowLeft, IdCard, ShieldCheck } from "lucide-react";
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

function Unavailable() {
  return (
    <p className="academy-notice info">
      Accounts are not switched on for this deployment. Ask the membership team
      for the passcode course instead.
    </p>
  );
}

function AuthShell({
  title,
  lead,
  points,
  children,
  alternate,
}: {
  title: string;
  lead: string;
  points: { icon: React.ReactNode; text: string }[];
  children: React.ReactNode;
  alternate: React.ReactNode;
}) {
  return (
    <section className="academy-signin-page">
      <div className="container academy-signin-page-inner">
        <Link className="academy-signin-page-back" to="/membership/academy">
          <ArrowLeft size={15} aria-hidden="true" /> Back to the course
        </Link>
        <h1>{title}</h1>
        <p>{lead}</p>
        <ul className="academy-auth-points">
          {points.map((point) => (
            <li key={point.text}>
              {point.icon}
              {point.text}
            </li>
          ))}
        </ul>
        {children}
        <p className="academy-hint">{alternate}</p>
      </div>
    </section>
  );
}

export function SignInPage() {
  return (
    <>
      <PageMeta
        title="Sign in"
        description="Sign in to the Rotaract Club of Menengai membership academy."
        robots="noindex"
      />
      <AuthShell
        title="Sign in to save your progress"
        lead="Your place in the course, your marked answers and your proposal are kept against your account, so you can stop and come back on any device."
        points={[
          {
            icon: <ShieldCheck size={16} aria-hidden="true" />,
            text: "Marked on the club’s server, not in your browser",
          },
          {
            icon: <IdCard size={16} aria-hidden="true" />,
            text: "Only the club’s membership team can see your answers",
          },
        ]}
        alternate={
          <>
            No account yet?{" "}
            <Link to="/membership/register">Create one</Link> — it is free and
            takes a minute.
          </>
        }
      >
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
          <Unavailable />
        )}
      </AuthShell>
    </>
  );
}

export function SignUpPage() {
  return (
    <>
      <PageMeta
        title="Create your academy account"
        description="Register for the Rotaract Club of Menengai membership academy and track your progress through the course."
        robots="noindex"
      />
      <AuthShell
        title="Create your account"
        lead="An account is what makes the course yours. Your place is saved, your answers are marked on the club’s server, and the membership team can see how far you have come."
        points={[
          {
            icon: <ShieldCheck size={16} aria-hidden="true" />,
            text: "We ask for a name and an email address. Nothing else.",
          },
          {
            icon: <IdCard size={16} aria-hidden="true" />,
            text: "Finishing the course unlocks the joining steps",
          },
        ]}
        alternate={
          <>
            Already registered?{" "}
            <Link to="/membership/sign-in">Sign in instead</Link>.
          </>
        }
      >
        {PUBLISHABLE_KEY ? (
          <ClerkProvider
            publishableKey={PUBLISHABLE_KEY}
            appearance={APPEARANCE}
            signInFallbackRedirectUrl="/membership/academy"
            signUpFallbackRedirectUrl="/membership/academy"
          >
            <SignUp routing="hash" />
          </ClerkProvider>
        ) : (
          <Unavailable />
        )}
      </AuthShell>
    </>
  );
}
