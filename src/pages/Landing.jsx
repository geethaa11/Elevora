import React, { useEffect, useState } from 'react';
import { Hero } from '../components/landing/Hero';
import { Discover } from '../components/landing/Discover';
import { Build } from '../components/landing/Build';
import { Grow } from '../components/landing/Grow';
import { JoinUs } from '../components/landing/JoinUs';
import { FinalCta } from '../components/landing/FinalCta';
import { ScrollRail } from '../components/landing/ScrollRail';
import { CursorGlow } from '../components/landing/CursorGlow';
import { SmoothScroll } from '../components/landing/SmoothScroll';
import { Scene } from '../components/landing/Scene'; // We will create this

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
    <SmoothScroll>
      <div className="relative w-full bg-background text-neutral-50 overflow-hidden">
        {/* Fixed 3D Canvas Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Scene />
        </div>

        <CursorGlow />
        <ScrollRail activeSection={activeSection} />
        
        {/* Foreground Content - Made transparent to show 3D */}
        <div className="relative z-10 pointer-events-none [&>*]:pointer-events-auto">
          <Hero />
          <Discover />
          <Build />
          <Grow />
          <JoinUs />
          <FinalCta />
        </div>
      </div>
    </SmoothScroll>
  );
}
