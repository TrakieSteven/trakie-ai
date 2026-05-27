'use client';

import StatsStrip from './StatsStrip';
import HeroDemo from './HeroDemo';
import HowItWorks from './HowItWorks';
import OnlineListing from './OnlineListing';
import MenuScore from './MenuScore';
import FadeUp from './FadeUp';

interface HomeSectionProps {
  onNavigate: (section: string) => void;
}

export default function HomeSection({ onNavigate }: HomeSectionProps) {
  return (
    <>
      <section className="vogue-hero">
        <div className="hero-ext-badge">
          <svg className="hero-ext-badge-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3a9 9 0 019 9h-9V3z" fill="#C9A85C" opacity="0.85"/>
            <path d="M3 12a9 9 0 019-9v9H3z" fill="#C9A85C" opacity="0.55"/>
            <path d="M12 21a9 9 0 01-9-9h9v9z" fill="#C9A85C" opacity="0.35"/>
            <circle cx="12" cy="12" r="3" fill="#0D1F0D" stroke="#C9A85C" strokeWidth="1.2"/>
          </svg>
          <span>Chrome Extension · Runs Inside Dutchie</span>
        </div>
        <h1 className="vogue-hero-title">Receive inventory</h1>
        <h2 className="vogue-hero-subtitle">in 60 seconds.</h2>
        <p className="vogue-hero-tagline">
          A Chrome extension that lives inside Dutchie.
        </p>

        <HeroDemo />
      </section>

      <FadeUp>
        <StatsStrip />
      </FadeUp>

      <FadeUp>
        <div className="manifesto">
          <p className="manifesto-text">
            Built for innovation, not data entry. Trakie handles the paperwork so you can get back to the floor.
          </p>
        </div>
      </FadeUp>

      <FadeUp>
        <HowItWorks />
      </FadeUp>

      <FadeUp>
        <OnlineListing />
      </FadeUp>

      <FadeUp>
        <MenuScore />
      </FadeUp>

      <FadeUp>
        <section className="control">
          <span className="control-eyebrow">You Stay In Control</span>
          <h2 className="control-title">The human has final say.</h2>
          <div className="control-rule" />
          <p className="control-body">
            Trakie handles the data entry. You review every field, confirm every match, and approve before anything saves to Dutchie. Compliance stays where it belongs — with you.
          </p>
        </section>
      </FadeUp>

      <FadeUp>
        <section className="compare">
          <div className="compare-inner">
            <div className="compare-card compare-manual">
              <div className="compare-icon-row">
                <span className="compare-x">&#10005;</span>
                <span className="compare-card-label">Manual</span>
              </div>
              <ul className="compare-list">
                <li>Line-by-line data entry</li>
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
      </FadeUp>

      <FadeUp>
        <div className="founder">
          <p className="founder-text">
            Built by a former dispensary inventory lead — 7× faster than his team.
          </p>
        </div>
      </FadeUp>

      <FadeUp>
        <section className="vogue-demo-section">
          <h2 className="vogue-demo-title">Experience trakie.ai</h2>
          <p className="vogue-demo-subtitle">Join NYC&apos;s most sophisticated dispensaries</p>
          <div className="vogue-demo-cta-row">
            <button
              type="button"
              className="vogue-demo-button"
              onClick={() => onNavigate('demo')}
              aria-label="View live receiving demo"
            >
              View Live Demo
            </button>
            <button
              type="button"
              className="vogue-demo-button vogue-demo-button-secondary"
              onClick={() => onNavigate('contact')}
              title="Chrome Web Store listing coming soon — join the waitlist"
              aria-label="Add to Chrome — coming soon, join the waitlist"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="vogue-chrome-icon">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 8.8h8.5M12 8.8L7.8 16M12 8.8L15 14.2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
              Add to Chrome — Coming Soon
            </button>
          </div>
          <p className="vogue-demo-helper">Chrome Web Store listing coming soon. Join the waitlist and we&apos;ll notify you.</p>
        </section>
      </FadeUp>

      <style>{`
        .vogue-demo-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
          align-items: center;
        }
        .vogue-demo-button-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: 1px solid rgba(201, 168, 92, 0.35);
          box-shadow: none;
          animation: none;
          padding: 22px 36px;
          font-size: 15px;
          letter-spacing: 2px;
        }
        .vogue-demo-button-secondary:hover {
          background: rgba(201, 168, 92, 0.12);
          color: #E0C27A;
          transform: none;
          box-shadow: none;
          border-color: rgba(201, 168, 92, 0.6);
        }
        .vogue-chrome-icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }
        .vogue-demo-helper {
          margin-top: 18px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.55);
          letter-spacing: 0.3px;
        }
        @media (max-width: 600px) {
          .vogue-demo-cta-row {
            flex-direction: column;
            gap: 12px;
          }
          .vogue-demo-button-secondary {
            font-size: 13px;
            padding: 18px 28px;
          }
        }

        .hero-ext-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          margin-bottom: 24px;
          background: rgba(201, 168, 92, 0.08);
          border: 1px solid rgba(201, 168, 92, 0.35);
          border-radius: 999px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #C9A85C;
          opacity: 0;
          transform: translateY(-10px);
          animation: heroExtBadgeEnter 1s ease 0.15s forwards;
        }
        .hero-ext-badge-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
        @keyframes heroExtBadgeEnter {
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .hero-ext-badge {
            font-size: 10px;
            letter-spacing: 1.5px;
            padding: 6px 12px;
            margin-bottom: 18px;
          }
          .hero-ext-badge-icon {
            width: 13px;
            height: 13px;
          }
        }

        .manifesto {
          padding: 56px 24px;
          text-align: center;
        }
        .manifesto-text {
          font-family: var(--font-bodoni), 'Bodoni Moda', serif;
          font-size: clamp(20px, 4vw, 32px);
          font-weight: 400;
          font-style: italic;
          color: #C9A961;
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

        /* ── Control / Trust ── */
        .control {
          padding: 100px 24px 80px;
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }
        .control-eyebrow {
          font-family: var(--font-outfit), sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #C9A961;
          display: block;
          margin-bottom: 16px;
        }
        .control-title {
          font-family: var(--font-bodoni), 'Bodoni Moda', serif;
          font-size: clamp(30px, 5.5vw, 48px);
          font-weight: 400;
          color: #FAFAF8;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        .control-rule {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #C9A961, transparent);
          margin: 24px auto 36px;
        }
        .control-body {
          font-family: var(--font-outfit), sans-serif;
          font-size: 20px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.85);
          max-width: 620px;
          margin: 0 auto;
        }
        @media (max-width: 480px) {
          .control {
            padding: 72px 20px 56px;
          }
          .control-body {
            font-size: 17px;
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
          font-size: 20px;
          font-weight: 600;
          color: #FAFAF8;
          letter-spacing: -0.2px;
        }
        .compare-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .compare-list li {
          font-family: var(--font-outfit), sans-serif;
          font-size: 17px;
          color: rgba(255,255,255,0.85);
          padding-left: 18px;
          position: relative;
          line-height: 1.5;
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
          font-size: 17px;
          font-weight: 400;
          color: rgba(255,255,255,0.72);
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.6;
          letter-spacing: 0.2px;
        }
        @media (max-width: 480px) {
          .founder {
            padding: 36px 20px 44px;
          }
          .founder-text {
            font-size: 15px;
          }
        }
      `}</style>
    </>
  );
}
