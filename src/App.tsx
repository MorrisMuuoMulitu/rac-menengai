/**
 * App — layout + route table. One primary CTA label everywhere:
 * "Attend a fellowship".
 */
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
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

const SignInPage = lazy(() =>
  import("./academy/AuthPage").then((module) => ({
    default: module.SignInPage,
  })),
);
const SignUpPage = lazy(() =>
  import("./academy/AuthPage").then((module) => ({
    default: module.SignUpPage,
  })),
);

export default function App() {
  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
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
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/membership/orientation" element={<OrientationPage />} />
          <Route element={<AcademyLayout />}>
            <Route path="/membership/academy" element={<AcademyPage />} />
            <Route
              path="/membership/academy/:step"
              element={<AcademyLessonPage />}
            />
            <Route path="/membership/queue" element={<ReviewQueuePage />} />
          </Route>
          {/* Its own chunk, so Clerk is fetched only when someone signs in. */}
          <Route
            path="/membership/sign-in"
            element={
              <Suspense
                fallback={
                  <div className="academy-loading" role="status">
                    <p>Loading sign-in…</p>
                  </div>
                }
              >
                <SignInPage />
              </Suspense>
            }
          />
          <Route
            path="/membership/register"
            element={
              <Suspense
                fallback={
                  <div className="academy-loading" role="status">
                    <p>Loading registration…</p>
                  </div>
                }
              >
                <SignUpPage />
              </Suspense>
            }
          />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
