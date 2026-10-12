/**
 * App — layout + route table. One primary CTA label everywhere:
 * "Attend a fellowship".
 */
import { Routes, Route } from "react-router-dom";
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
import NotFoundPage from "./pages/NotFound";

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
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
