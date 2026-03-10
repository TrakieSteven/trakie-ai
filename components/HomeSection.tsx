'use client';

import StatsCarousel from './StatsCarousel';

interface HomeSectionProps {
  onNavigate: (section: string) => void;
}

export default function HomeSection({ onNavigate }: HomeSectionProps) {
  return (
    <>
      <section className="vogue-hero">
        <h1 className="vogue-hero-title">CANNABIS RETAIL</h1>
        <h2 className="vogue-hero-subtitle">INTELLIGENCE</h2>
        <p className="vogue-hero-tagline">
          <span>INSTANT INVENTORY RECOGNITION</span> &bull;{' '}
          <span>PREDICTIVE RESTOCKING</span> &bull;{' '}
          <span>AUTOMATED COMPLIANCE</span>
        </p>
      </section>

      <section className="vogue-features">
        <div className="vogue-pyramid">
          <div className="vogue-pyramid-row">
            <div className="vogue-feature-card" style={{ '--delay': 1 } as React.CSSProperties}>
              <div className="vogue-feature-icon">📸</div>
              <h3 className="vogue-feature-title">Instant Recognition</h3>
              <p className="vogue-feature-description">
                Computer vision trained on 50,000+ SKUs. Scan labels, auto-fill everything. Zero manual entry.
              </p>
            </div>
            <div className="vogue-feature-card" style={{ '--delay': 2 } as React.CSSProperties}>
              <div className="vogue-feature-icon">📊</div>
              <h3 className="vogue-feature-title">Predictive Restocking</h3>
              <p className="vogue-feature-description">
                AI-powered velocity analytics. Algorithmic alerts prevent stockouts before they happen.
              </p>
            </div>
          </div>
          <div className="vogue-pyramid-row">
            <div className="vogue-feature-card" style={{ '--delay': 3 } as React.CSSProperties}>
              <div className="vogue-feature-icon">🧠</div>
              <h3 className="vogue-feature-title">AI Budtender</h3>
              <p className="vogue-feature-description">
                Smart product recommendations. Sample attribution modeling. Turn your team into revenue machines.
              </p>
            </div>
            <div className="vogue-feature-card" style={{ '--delay': 4 } as React.CSSProperties}>
              <div className="vogue-feature-icon">🛡️</div>
              <h3 className="vogue-feature-title">METRC Integration</h3>
              <p className="vogue-feature-description">
                Full compliance automation. Prevent fines. Real-time state reporting built in.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsCarousel />

      <section className="vogue-demo-section">
        <h2 className="vogue-demo-title">Experience Trakie</h2>
        <p className="vogue-demo-subtitle">Join NYC&apos;s most sophisticated dispensaries</p>
        <button className="vogue-demo-button" onClick={() => onNavigate('receive')}>
          View Live Demo
        </button>
      </section>
    </>
  );
}
