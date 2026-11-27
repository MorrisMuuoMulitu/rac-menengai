import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

/**
 * Auth is intentionally lazy-loaded, but a broken provider or stale CDN chunk
 * must never strand a learner on a spinner. Keep the recovery message inside
 * the academy shell so it works on both the sign-in and registration routes.
 */
export default class AuthRouteBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("Academy authentication route failed", error, info);
    }
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <section className="academy-signin-page" aria-labelledby="auth-error-title">
        <div className="container academy-signin-page-inner academy-auth-error">
          <Link className="academy-signin-page-back" to="/membership/academy">
            ← Back to the course
          </Link>
          <p className="academy-eyebrow">Secure account access</p>
          <h1 id="auth-error-title">Sign-in is taking a break</h1>
          <p>
            We could not load the secure account screen. Your course content is
            still available to explore, and the membership team can help you
            save your progress while access is restored.
          </p>
          <div className="academy-auth-error-actions">
            <button
              className="btn btn-primary btn-lg"
              type="button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
            <Link className="btn btn-secondary btn-md" to="/membership/academy">
              Continue without an account
            </Link>
          </div>
          <p className="academy-hint">
            If this keeps happening, contact the membership team before creating
            another account.
          </p>
        </div>
      </section>
    );
  }
}
