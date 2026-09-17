/**
 * App — layout + route table. One primary CTA label everywhere:
 * "Attend a fellowship".
 */
import { Routes, Route } from 'react-router-dom';
import { AnnouncementBar, Footer, Header, ScrollToTop } from './components/layout';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ProjectsPage from './pages/Projects';
import ProjectDetailPage from './pages/ProjectDetail';
import AwardsPage from './pages/Awards';
import LeadershipPage from './pages/Leadership';
import NewsPage from './pages/News';
import MembershipPage from './pages/Membership';
import ContactPage from './pages/Contact';
import NotFoundPage from './pages/NotFound';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/awards" element={<AwardsPage />} />
          <Route path="/leadership" element={<LeadershipPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}