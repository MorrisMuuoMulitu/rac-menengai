import { Component, type ReactNode } from "react";
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="container section" role="alert">
          <h1>The page could not load.</h1>
          <p>
            Reload the page, or contact the club at{" "}
            <a href="mailto:menengairc@gmail.com">menengairc@gmail.com</a>.
          </p>
          <button
            className="btn btn-primary btn-md"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </main>
      );
    return this.props.children;
  }
}
