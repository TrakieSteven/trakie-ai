'use client';

import StatsStrip from './StatsStrip';
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

      <StatsStrip />

      <div className="manifesto">
        <p className="manifesto-text">
          Humans weren&apos;t built for repetitive data entry. We were built to innovate, connect, and grow. Trakie handles the clipboard so you can get back to the floor.
        </p>
      </div>

      <HowItWorks />

      <section className="vogue-demo-section">
        <h2 className="vogue-demo-title">Experience trakie.ai</h2>
        <p className="vogue-demo-subtitle">Join NYC&apos;s most sophisticated dispensaries</p>
        <button className="vogue-demo-button" onClick={() => onNavigate('receive')}>
          View Live Demo
        </button>
      </section>

      <style>{`
        .manifesto {
          padding: 56px 24px;
          text-align: center;
        }
        .manifesto-text {
          font-family: var(--font-bodoni), 'Bodoni Moda', serif;
          font-size: clamp(20px, 4vw, 32px);
          font-weight: 400;
          font-style: italic;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.5;
          max-width: 600px;
          margin: 0 auto;
          letter-spacing: 0.2px;
        }
        @media (max-width: 480px) {
          .manifesto {
            padding: 40px 20px;
          }
        }
      `}</style>
    </>
  );
}
