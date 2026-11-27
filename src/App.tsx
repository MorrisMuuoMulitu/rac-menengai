/**
 * App — layout + route table. One primary CTA label everywhere:
 * "Attend a fellowship".
 */
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { Suspense, lazy, type ComponentType } from "react";
import {
  AnnouncementBar,
  Footer,
  Header,
  ScrollToTop,
} from "./components/layout";
import EventsPage, { EventDetail } from "./pages/Events";
import Partnerships from "./pages/Partnerships";
import Privacy from "./pages/Privacy";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import DistrictPage from "./pages/District";
import RotaryPage from "./pages/Rotary";
import ProjectsPage from "./pages/Projects";
import ProjectDetailPage from "./pages/ProjectDetail";
import AwardsPage from "./pages/Awards";
import LeadershipPage from "./pages/Leadership";
import MembershipPage from "./pages/Membership";
import OrientationPage from "./pages/Orientation";
import ContactPage from "./pages/Contact";
import LearnPage from "./pages/Learn";
import NotFoundPage from "./pages/NotFound";
import AcademyLayout from "./academy/AcademyLayout";
import AcademyPage from "./pages/Academy";
import AcademyLessonPage from "./pages/AcademyLesson";
import ReviewQueuePage from "./pages/ReviewQueue";
import LearnerProgressPage from "./pages/LearnerProgress";
import VerifyCertificatePage from "./pages/VerifyCertificate";
import EnquiriesPage from "./pages/Enquiries";
import AcademySearchPage from "./pages/AcademySearch";
import AuthRouteBoundary from "./academy/AuthRouteBoundary";

const AUTH_CHUNK_TIMEOUT = 10_000;
function lazyAuth<T extends { default: ComponentType }>(
  load: () => Promise<T>,
) {
  return lazy(() =>
    Promise.race([
      load(),
      new Promise<never>((_, reject) =>
        window.setTimeout(
          () =>
            reject(
              new Error("The secure sign-in screen took too long to load."),
            ),
          AUTH_CHUNK_TIMEOUT,
        ),
      ),
    ]),
  );
}

const SignInPage = lazyAuth(() =>
  import("./academy/AuthPage").then((module) => ({
    default: module.SignInPage,
  })),
);
const SignUpPage = lazyAuth(() =>
  import("./academy/AuthPage").then((module) => ({
    default: module.SignUpPage,
  })),
);
const SsoCallbackPage = lazyAuth(() =>
  import("./academy/AuthPage").then((module) => ({
    default: module.SsoCallbackPage,
  })),
);

export default function App() {
  /*
   * The academy shell renders its own header and a plain footer. Officer pages
   * live inside that shell too, so matching only "/membership/academy" gave
   * them two stacked headers and the full marketing footer.
   */
  const learning =
    /^\/membership\/(academy|queue|learners|enquiries)(\/|$)/.test(
      useLocation().pathname,
    );
  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {!learning && <AnnouncementBar />}
      {!learning && <Header />}
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about/district-9215" element={<DistrictPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/rotary" element={<RotaryPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/awards" element={<AwardsPage />} />
          <Route path="/leadership" element={<LeadershipPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/verify" element={<VerifyCertificatePage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/membership/orientation" element={<OrientationPage />} />
          <Route element={<AcademyLayout />}>
            <Route path="/membership/academy" element={<AcademyPage />} />
            <Route
              path="/membership/academy/search"
              element={<AcademySearchPage />}
            />
            <Route
              path="/membership/academy/:step"
              element={<AcademyLessonPage />}
            />
            <Route path="/membership/queue" element={<ReviewQueuePage />} />
            <Route
              path="/membership/learners"
              element={<LearnerProgressPage />}
            />
            <Route path="/membership/enquiries" element={<EnquiriesPage />} />
          </Route>
          {/* Its own chunk, so Clerk is fetched only when someone signs in. */}
          <Route
            path="/membership/sign-in"
            element={
              <AuthRouteBoundary>
                <Suspense
                  fallback={
                    <div className="academy-loading" role="status">
                      <p>Preparing secure sign-in…</p>
                    </div>
                  }
                >
                  <SignInPage />
                </Suspense>
              </AuthRouteBoundary>
            }
          />
          <Route
            path="/membership/register"
            element={
              <AuthRouteBoundary>
                <Suspense
                  fallback={
                    <div className="academy-loading" role="status">
                      <p>Preparing account creation…</p>
                    </div>
                  }
                >
                  <SignUpPage />
                </Suspense>
              </AuthRouteBoundary>
            }
          />
          <Route
            path="/membership/sso-callback"
            element={
              <AuthRouteBoundary>
                <Suspense
                  fallback={
                    <div className="academy-loading" role="status">
                      <p>Completing secure sign-in…</p>
                    </div>
                  }
                >
                  <SsoCallbackPage />
                </Suspense>
              </AuthRouteBoundary>
            }
          />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {learning ? (
        <footer className="academy-simple-footer">
          <Link to="/">Rotaract Club of Menengai</Link>
          <Link to="/privacy">Privacy</Link>
          <a
            href="https://www.impelweb.studio/"
            target="_blank"
            rel="noreferrer"
          >
            Designed by Impel Web
          </a>
        </footer>
      ) : (
        <Footer />
      )}
    </>
  );
}
