'use client';

import { useEffect, useRef, useState } from 'react';

const PRODUCT_TITLE = 'Sunset Sherbert · Indica Flower · 3.5g';
const PRODUCT_DESCRIPTION =
  'Sunset Sherbert is an indica-dominant hybrid with a sweet berry-candy aroma and smooth, mellow finish. Euphoric and deeply relaxing — an evening favorite for winding down. Sun-grown by Revert Cannabis, New York. THC 22.70% · CBD 0.065%.';
const PRODUCT_IMAGE = '/product-photos/flower8.avif';

type Stage = 'idle' | 'title' | 'desc' | 'image' | 'claiming' | 'claimed';

export default function OnlineListing() {
  const sectionRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState<Stage>('idle');
  const [titleText, setTitleText] = useState('');
  const [descText, setDescText] = useState('');

  // Trigger animation when scrolled into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && stage === 'idle') {
          setStage('title');
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stage]);

  // Animation sequencer
  useEffect(() => {
    if (stage === 'title') {
      let i = 0;
      const id = setInterval(() => {
        i += 1;
        setTitleText(PRODUCT_TITLE.slice(0, i));
        if (i >= PRODUCT_TITLE.length) {
          clearInterval(id);
          setTimeout(() => setStage('desc'), 350);
        }
      }, 45);
      return () => clearInterval(id);
    }
    if (stage === 'desc') {
      let i = 0;
      const id = setInterval(() => {
        i += 3;
        setDescText(PRODUCT_DESCRIPTION.slice(0, i));
        if (i >= PRODUCT_DESCRIPTION.length) {
          clearInterval(id);
          setTimeout(() => setStage('image'), 400);
        }
      }, 18);
      return () => clearInterval(id);
    }
    if (stage === 'image') {
      const t = setTimeout(() => setStage('claiming'), 900);
      return () => clearTimeout(t);
    }
    if (stage === 'claiming') {
      const t = setTimeout(() => setStage('claimed'), 700);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const imageVisible = stage === 'image' || stage === 'claiming' || stage === 'claimed';
  const buttonReady = stage === 'image' || stage === 'claiming' || stage === 'claimed';

  return (
    <section ref={sectionRef} className="ol-section">
      <div className="ol-inner">
        <span className="ol-eyebrow">Online Listings</span>
        <h2 className="ol-title">One click. Live on Dutchie.</h2>
        <div className="ol-rule" />
        <p className="ol-body">
          Every item gets a polished online title, a professional description, and the best product image — ready before you are. Review and claim; your menu updates in real time.
        </p>

        {/* Dutchie Online details mockup */}
        <div className="ol-mockup">
          <div className="ol-tabs">
            <span className="ol-tab">Details</span>
            <span className="ol-tab">Location details</span>
            <span className="ol-tab ol-tab-active">
              Online details
              <span className="ol-tab-underline" />
            </span>
            <span className="ol-tab">Online settings</span>
          </div>

          <div className="ol-fields">
            <div className="ol-field">
              <span className="ol-field-label">Available online:</span>
              <div className="ol-field-value">
                <span className="ol-toggle">
                  <span className="ol-toggle-dot">✓</span>
                </span>
                <span className="ol-toggle-label">ENABLED</span>
              </div>
            </div>

            <div className="ol-field">
              <span className="ol-field-label">Online title:</span>
              <div className={`ol-input ol-input-title ${titleText ? 'has-value' : ''}`}>
                <span>{titleText}</span>
                {stage === 'title' && <span className="ol-caret" />}
              </div>
            </div>

            <div className="ol-field">
              <span className="ol-field-label">Online description:</span>
              <div className={`ol-input ol-input-desc ${descText ? 'has-value' : ''}`}>
                <span>{descText}</span>
                {stage === 'desc' && <span className="ol-caret" />}
                <span className="ol-charcount">{descText.length}/2500</span>
              </div>
            </div>

            <div className="ol-field">
              <span className="ol-field-label">Product images:</span>
              <div className={`ol-image ${imageVisible ? 'filled' : ''}`}>
                {imageVisible ? (
                  <img src={PRODUCT_IMAGE} alt="Sunset Sherbert" />
                ) : (
                  <div className="ol-image-placeholder">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="9" cy="9" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                    <span>Searching product images…</span>
                  </div>
                )}
              </div>
            </div>

            <div className="ol-claim-row">
              <button
                type="button"
                className={`ol-claim-btn ${buttonReady ? 'ready' : ''} ${stage === 'claimed' ? 'done' : ''}`}
                disabled={!buttonReady || stage === 'claimed'}
              >
                {stage === 'claimed' ? (
                  <>
                    <span className="ol-claim-check">✓</span> Claimed & live
                  </>
                ) : stage === 'claiming' ? (
                  'Claiming…'
                ) : (
                  'Claim online listing'
                )}
              </button>
              <span className="ol-claim-hint">You approve before anything publishes.</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ol-section {
          padding: 100px 24px 80px;
          max-width: 880px;
          margin: 0 auto;
        }
        .ol-inner {
          text-align: center;
        }
        .ol-eyebrow {
          font-family: var(--font-outfit), sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #C9A961;
          display: block;
          margin-bottom: 16px;
        }
        .ol-title {
          font-family: var(--font-bodoni), 'Bodoni Moda', serif;
          font-size: clamp(30px, 5.5vw, 48px);
          font-weight: 400;
          color: #FAFAF8;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        .ol-rule {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #C9A961, transparent);
          margin: 24px auto 36px;
        }
        .ol-body {
          font-family: var(--font-outfit), sans-serif;
          font-size: 20px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.85);
          max-width: 640px;
          margin: 0 auto 56px;
        }

        /* ── Mockup card ─────────────────────────────── */
        .ol-mockup {
          background: #ffffff;
          border-radius: 12px;
          padding: 28px 32px 32px;
          text-align: left;
          box-shadow:
            0 0 0 1px rgba(201, 169, 97, 0.15),
            0 30px 80px rgba(0, 0, 0, 0.55),
            0 0 120px rgba(201, 168, 92, 0.05);
          max-width: 720px;
          margin: 0 auto;
          color: #111827;
          font-family: var(--font-outfit), sans-serif;
        }

        .ol-tabs {
          display: flex;
          gap: 28px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 28px;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .ol-tabs::-webkit-scrollbar { display: none; }
        .ol-tab {
          padding-bottom: 12px;
          white-space: nowrap;
          position: relative;
        }
        .ol-tab-active {
          color: #111827;
          font-weight: 700;
        }
        .ol-tab-underline {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 2px;
          background: #EF4444;
          border-radius: 1px;
        }

        .ol-fields {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .ol-field {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 18px;
          align-items: start;
        }
        .ol-field-label {
          font-size: 14px;
          color: #4b5563;
          padding-top: 10px;
          font-weight: 500;
        }
        .ol-field-value {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 6px;
        }
        .ol-toggle {
          width: 44px;
          height: 22px;
          border-radius: 999px;
          background: #3B82F6;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 3px;
        }
        .ol-toggle-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          color: #3B82F6;
          font-size: 11px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ol-toggle-label {
          font-size: 13px;
          font-weight: 700;
          color: #3B82F6;
          letter-spacing: 0.5px;
        }

        .ol-input {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 12px 14px;
          font-size: 15px;
          color: #111827;
          background: #ffffff;
          min-height: 44px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          line-height: 1.5;
        }
        .ol-input.has-value {
          border-color: rgba(59, 130, 246, 0.35);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.06);
        }
        .ol-input-title {
          font-weight: 600;
        }
        .ol-input-desc {
          min-height: 110px;
          padding-bottom: 28px;
        }
        .ol-charcount {
          position: absolute;
          bottom: 8px;
          right: 12px;
          font-size: 12px;
          color: #9ca3af;
          font-variant-numeric: tabular-nums;
        }
        .ol-caret {
          display: inline-block;
          width: 1.5px;
          height: 1.1em;
          background: #3B82F6;
          vertical-align: text-bottom;
          margin-left: 2px;
          animation: olBlink 0.6s step-end infinite;
        }
        @keyframes olBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .ol-image {
          background: #f3f4f6;
          border: 1px dashed #d1d5db;
          border-radius: 6px;
          min-height: 130px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: all 0.4s ease;
        }
        .ol-image.filled {
          background: #ffffff;
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.05);
          padding: 10px;
          animation: olImageIn 0.5s ease both;
        }
        @keyframes olImageIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .ol-image img {
          max-height: 150px;
          max-width: 100%;
          object-fit: contain;
        }
        .ol-image-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #9ca3af;
          font-size: 13px;
        }
        .ol-image-placeholder svg {
          opacity: 0.5;
        }

        /* Claim row */
        .ol-claim-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 14px;
          padding-top: 24px;
          border-top: 1px solid #f3f4f6;
          flex-wrap: wrap;
        }
        .ol-claim-btn {
          padding: 14px 28px;
          background: #e5e7eb;
          color: #9ca3af;
          border: none;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.2px;
          cursor: not-allowed;
          font-family: var(--font-outfit), sans-serif;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .ol-claim-btn.ready {
          background: #3B82F6;
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.45);
          animation: olClaimPulse 1.8s ease-in-out infinite;
        }
        .ol-claim-btn.done {
          background: #10B981;
          color: #ffffff;
          cursor: default;
          animation: none;
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.3);
        }
        @keyframes olClaimPulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.45); }
          60% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .ol-claim-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          font-size: 12px;
          font-weight: 900;
        }
        .ol-claim-hint {
          font-size: 13px;
          color: #6b7280;
          font-style: italic;
        }

        /* Mobile */
        @media (max-width: 620px) {
          .ol-section {
            padding: 72px 16px 56px;
          }
          .ol-body {
            font-size: 17px;
            margin-bottom: 40px;
          }
          .ol-mockup {
            padding: 20px 18px 22px;
          }
          .ol-field {
            grid-template-columns: 1fr;
            gap: 6px;
          }
          .ol-field-label {
            padding-top: 0;
            font-size: 13px;
          }
          .ol-field-value {
            padding-top: 0;
          }
          .ol-tabs {
            gap: 18px;
            font-size: 13px;
          }
          .ol-claim-row {
            flex-direction: column;
            align-items: stretch;
          }
          .ol-claim-btn {
            width: 100%;
            justify-content: center;
          }
          .ol-claim-hint {
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
