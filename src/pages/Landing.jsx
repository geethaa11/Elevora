import React, { useEffect, useState } from 'react';
import { Hero } from '../components/landing/Hero';
import { Discover } from '../components/landing/Discover';
import { Build } from '../components/landing/Build';
import { Grow } from '../components/landing/Grow';
import { JoinUs } from '../components/landing/JoinUs';
import { FinalCta } from '../components/landing/FinalCta';
import { ScrollRail } from '../components/landing/ScrollRail';

import { LoadingScreen } from '../components/motion/LoadingScreen';
import { CursorTrail } from '../components/motion/CursorTrail';
import { TwinklingStars } from '../components/motion/TwinklingStars';
import { ScrollStarLine } from '../components/motion/ScrollStarLine';
import { Marquee } from '../components/motion/Marquee';

export function Landing() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = ['home', 'discover', 'build', 'grow', 'mentors'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full bg-background text-neutral-50 overflow-hidden">
      <LoadingScreen />
      <CursorTrail />
      <TwinklingStars />
      <ScrollStarLine />
      
      <ScrollRail activeSection={activeSection} />
      
      <div className="relative z-10">
        <Hero />
        <Discover />
        <Build />
        <Grow />
        <JoinUs />
        <Marquee />
        <FinalCta />
      </div>
    </div>
  );
}
