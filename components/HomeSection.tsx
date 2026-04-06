'use client';

import StatsCarousel from './StatsCarousel';
import HeroDemo from './HeroDemo';
import HowItWorks from './HowItWorks';

interface HomeSectionProps {
  onNavigate: (section: string) => void;
}

export default function HomeSection({ onNavigate }: HomeSectionProps) {
  return (
    <>
      <section className="vogue-hero">
        <h1 className="vogue-hero-title">Receive inventory</h1>
        <h2 className="vogue-hero-subtitle">in 60 seconds.</h2>
        <p className="vogue-hero-tagline">
          <span>INSTANT INVENTORY RECOGNITION</span> &bull;{' '}
          <span>PREDICTIVE RESTOCKING</span> &bull;{' '}
          <span>AUTOMATED COMPLIANCE</span>
        </p>

        <HeroDemo />
      </section>

      <StatsCarousel />

      <HowItWorks />

      <section className="vogue-demo-section">
        <h2 className="vogue-demo-title">Experience trakie.ai</h2>
        <p className="vogue-demo-subtitle">Join NYC&apos;s most sophisticated dispensaries</p>
        <button className="vogue-demo-button" onClick={() => onNavigate('receive')}>
          View Live Demo
        </button>
      </section>
    </>
  );
}
