/**
 * Home — the conversion-first narrative. Exactly one h1 (in <Hero>).
 */
import { PageMeta } from '../components/ui';
import {
  FeaturedImpact,
  FinalCta,
  Hero,
  LeadershipPreview,
  OpportunitySection,
  PartnersStrip,
  RotaryBand,
  Services,
  StoriesPreview,
  TrustBar,
} from '../components/home';

export default function HomePage() {
  return (
    <>
      <PageMeta
        title="Rotaract Club of Menengai — Service Above Self"
        description="Young professionals and students in Nakuru, Kenya serving through projects and fellowship. Attend a fellowship this Thursday, 5:30–6:30 PM."
      />
      <Hero />
      <TrustBar />
      <Services />
      <FeaturedImpact />
      <OpportunitySection />
      <LeadershipPreview />
      <StoriesPreview />
      <PartnersStrip />
      <RotaryBand />
      <FinalCta />
    </>
  );
}