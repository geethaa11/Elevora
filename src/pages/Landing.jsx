import React from 'react';
import { Hero } from '../components/landing/Hero';
import { FeatureHighlights } from '../components/landing/FeatureHighlights';
import { HowItWorks } from '../components/landing/HowItWorks';
import { AiTeamMatchingSection } from '../components/landing/AiTeamMatchingSection';
import { HackathonSection } from '../components/landing/HackathonSection';
import { MentorSection } from '../components/landing/MentorSection';
import { FinalCta } from '../components/landing/FinalCta';
import { Footer } from '../components/layout/Footer';

export function Landing() {
  return (
    <div className="relative w-full bg-[#0D0D0F] text-neutral-50 overflow-x-hidden min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Feature Highlights (4 Cards) */}
      <FeatureHighlights />

      {/* 3. How Elevora Works (4-Step Connected Timeline) */}
      <HowItWorks />

      {/* 4. AI Team Matching Showcase */}
      <AiTeamMatchingSection />

      {/* 5. Hackathon Discovery Section */}
      <HackathonSection />

      {/* 6. Mentor Guidance Section */}
      <MentorSection />

      {/* 7. Final Closing CTA */}
      <FinalCta />

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}

export default Landing;
