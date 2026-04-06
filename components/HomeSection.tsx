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

      {/* Manual vs Trakie Comparison */}
      <section className="compare">
        <div className="compare-inner">
          <div className="compare-card compare-manual">
            <div className="compare-icon-row">
              <span className="compare-x">&#10005;</span>
              <span className="compare-card-label">Manual</span>
            </div>
            <ul className="compare-list">
              <li>Clipboard &amp; spreadsheet</li>
              <li>45 minutes per shipment</li>
              <li>Typos &amp; miskeys</li>
              <li>METRC copy-paste errors</li>
            </ul>
          </div>
          <div className="compare-card compare-trakie">
            <div className="compare-icon-row">
              <span className="compare-check">&#10003;</span>
              <span className="compare-card-label">Trakie</span>
            </div>
            <ul className="compare-list">
              <li>Phone scan &amp; done</li>
              <li>60 seconds per shipment</li>
              <li>Zero typos</li>
              <li>METRC auto-verified</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Founder Line */}
      <div className="founder">
        <p className="founder-text">
          Built by a former dispensary inventory lead who processed shipments 7x faster than his team.
        </p>
      </div>

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

        /* ── Comparison ── */
        .compare {
          padding: 80px 24px;
          max-width: 760px;
          margin: 0 auto;
        }
        .compare-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .compare-card {
          border-radius: 14px;
          padding: 28px 24px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .compare-manual {
          background: rgba(255,255,255,0.02);
        }
        .compare-trakie {
          background: rgba(74,222,128,0.03);
          border-color: rgba(74,222,128,0.15);
        }
        .compare-icon-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .compare-x {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(239,68,68,0.12);
          color: #ef4444;
          font-size: 13px;
          flex-shrink: 0;
        }
        .compare-check {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(74,222,128,0.12);
          color: #4ade80;
          font-size: 14px;
          flex-shrink: 0;
        }
        .compare-card-label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #FAFAF8;
          letter-spacing: -0.2px;
        }
        .compare-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .compare-list li {
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          padding-left: 16px;
          position: relative;
          line-height: 1.4;
        }
        .compare-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 7px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
        }
        .compare-trakie .compare-list li::before {
          background: rgba(74,222,128,0.4);
        }

        @media (max-width: 560px) {
          .compare {
            padding: 56px 16px;
          }
          .compare-inner {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .compare-card {
            padding: 22px 20px;
          }
        }

        /* ── Founder Line ── */
        .founder {
          padding: 48px 24px 56px;
          text-align: center;
        }
        .founder-text {
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: rgba(255,255,255,0.3);
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.6;
          letter-spacing: 0.2px;
        }
        @media (max-width: 480px) {
          .founder {
            padding: 36px 20px 44px;
          }
          .founder-text {
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
}
