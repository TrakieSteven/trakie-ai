'use client';

import { useState, useEffect } from 'react';

const FIELDS = [
  { label: 'SOUR DIESEL', type: 'title' },
  { label: 'HYBRID',      type: 'badge' },
  { label: '3.5g',        type: 'text' },
  { label: 'THC 24.5%',   type: 'text' },
  { label: 'CBD 0.12%',   type: 'text' },
];

/* Barcode bar widths — alternating dark/light strips */
const BARCODE_BARS = [
  2,1,1,3,1,2,1,1,3,1,1,2,1,3,1,1,2,1,1,1,3,1,2,1,1,3,1,2,1,1,1,2,3,1,1,2,1,1,3,1,2,1,1,2,1,3,1,1,2,1,
];

export default function ProductScanPhase() {
  const [revealedFields, setRevealedFields] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= 6; i++) {
      const delay = i <= 5 ? 600 + (i - 1) * 500 : 3100;
      timers.push(setTimeout(() => setRevealedFields(i), delay));
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="cinematic-phase">
      <style>{`
        .pscan-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 860px;
        }

        .pscan-label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(74, 222, 128, 0.7);
          margin-bottom: 28px;
          text-align: center;
        }

        .pscan-viewfinder {
          position: relative;
          width: 100%;
          height: 65vh;
          max-height: 540px;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.55);
          box-shadow:
            0 0 0 1px rgba(74, 222, 128, 0.12),
            0 30px 80px rgba(0, 0, 0, 0.6);
        }

        .pscan-bracket {
          position: absolute;
          z-index: 5;
          pointer-events: none;
        }
        .pscan-bracket svg {
          display: block;
          width: 48px;
          height: 48px;
        }
        .pscan-bracket.tl { top: 20px; left: 20px; }
        .pscan-bracket.tr { top: 20px; right: 20px; transform: scaleX(-1); }
        .pscan-bracket.bl { bottom: 20px; left: 20px; transform: scaleY(-1); }
        .pscan-bracket.br { bottom: 20px; right: 20px; transform: scale(-1); }

        .pscan-beam {
          position: absolute;
          left: 20px;
          right: 20px;
          height: 2px;
          z-index: 6;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(74, 222, 128, 0.3) 10%,
            rgba(74, 222, 128, 0.8) 50%,
            rgba(74, 222, 128, 0.3) 90%,
            transparent 100%
          );
          box-shadow: 0 0 24px 6px rgba(74, 222, 128, 0.18);
          animation: pscanBeam 2.8s ease-in-out infinite;
        }
        @keyframes pscanBeam {
          0%   { top: 20px; }
          50%  { top: calc(100% - 22px); }
          100% { top: 20px; }
        }

        .pscan-glow {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: radial-gradient(ellipse at center, rgba(74, 222, 128, 0.05) 0%, transparent 65%);
          animation: pscanGlow 3.5s ease-in-out infinite;
        }
        @keyframes pscanGlow {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 1; }
        }

        /* ── phone frame ── */
        .pscan-phone {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 240px;
          height: 440px;
          z-index: 2;
          border-radius: 28px;
          border: 2px solid rgba(255, 255, 255, 0.15);
          background: rgba(0, 0, 0, 0.6);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* notch */
        .pscan-notch {
          width: 80px;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.12);
          margin: 10px auto 0;
          flex-shrink: 0;
        }

        /* phone screen area */
        .pscan-screen {
          flex: 1;
          position: relative;
          margin: 10px 10px 14px;
          border-radius: 8px;
          overflow: hidden;
        }

        /* inner corner brackets (smaller) */
        .pscan-inner-bracket {
          position: absolute;
          z-index: 4;
          pointer-events: none;
        }
        .pscan-inner-bracket svg {
          display: block;
          width: 24px;
          height: 24px;
        }
        .pscan-inner-bracket.tl { top: 6px; left: 6px; }
        .pscan-inner-bracket.tr { top: 6px; right: 6px; transform: scaleX(-1); }
        .pscan-inner-bracket.bl { bottom: 6px; left: 6px; transform: scaleY(-1); }
        .pscan-inner-bracket.br { bottom: 6px; right: 6px; transform: scale(-1); }

        /* ── product label card ── */
        .pscan-card {
          position: absolute;
          inset: 18px 14px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.97);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .pscan-card-header {
          padding: 12px 16px;
          background: linear-gradient(135deg, #C9A961 0%, #8B7355 100%);
          flex-shrink: 0;
        }
        .pscan-card-brand {
          font-family: var(--font-outfit), sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.95);
        }

        .pscan-card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 0;
        }

        .pscan-field {
          padding: 10px 16px;
          border-bottom: 1px solid #EAEAEA;
          border-left: 3px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(4px);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .pscan-field.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .pscan-field.active {
          background: rgba(74, 222, 128, 0.08);
          border-left-color: rgba(74, 222, 128, 0.7);
        }

        .pscan-field-title {
          font-family: sans-serif;
          font-size: 18px;
          font-weight: 900;
          color: #111;
          letter-spacing: 1px;
          text-align: center;
        }

        .pscan-field-badge {
          display: inline-block;
          border: 2px solid #BBB;
          border-radius: 3px;
          padding: 2px 16px;
          font-family: sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #222;
          letter-spacing: 2px;
        }
        .pscan-field.revealed .pscan-field-badge {
          border-color: rgba(74, 222, 128, 0.7);
        }

        .pscan-field-text {
          font-family: sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #222;
          letter-spacing: 0.5px;
        }

        /* ── barcode ── */
        .pscan-barcode {
          padding: 8px 14px 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          opacity: 0;
          transform: translateY(4px);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .pscan-barcode.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .pscan-bar {
          height: 28px;
          background: #111;
        }
        .pscan-bar-space {
          height: 28px;
          background: transparent;
        }

        .pscan-noise {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
        }

        @media (max-width: 600px) {
          .pscan-viewfinder { height: 55vh; border-radius: 14px; }
          .pscan-bracket svg { width: 36px; height: 36px; }
          .pscan-bracket.tl, .pscan-bracket.tr { top: 14px; }
          .pscan-bracket.bl, .pscan-bracket.br { bottom: 14px; }
          .pscan-bracket.tl, .pscan-bracket.bl { left: 14px; }
          .pscan-bracket.tr, .pscan-bracket.br { right: 14px; }
          .pscan-phone { width: 200px; height: 370px; border-radius: 22px; }
          .pscan-inner-bracket svg { width: 18px; height: 18px; }
          .pscan-card { inset: 14px 10px; }
          .pscan-card-header { padding: 8px 10px; }
          .pscan-card-brand { font-size: 9px; }
          .pscan-field { padding: 6px 10px; }
          .pscan-field-title { font-size: 15px; }
          .pscan-field-badge { font-size: 11px; padding: 1px 12px; }
          .pscan-field-text { font-size: 13px; }
          .pscan-barcode { padding: 6px 10px 8px; }
          .pscan-bar, .pscan-bar-space { height: 22px; }
        }
      `}</style>

      <div className="pscan-wrap">
        <div className="pscan-label">Scanning Product Labels</div>

        <div className="pscan-viewfinder">
          <div className="pscan-glow" />

          {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
            <div key={pos} className={`pscan-bracket ${pos}`}>
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 48 L2 4 C2 2.9 2.9 2 4 2 L48 2"
                  stroke="rgba(74,222,128,0.75)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
          ))}

          <div className="pscan-beam" />

          <div className="pscan-phone">
            <div className="pscan-notch" />
            <div className="pscan-screen">
              {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
                <div key={pos} className={`pscan-inner-bracket ${pos}`}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1 24 L1 2 C1 1.45 1.45 1 2 1 L24 1"
                      stroke="rgba(74,222,128,0.55)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
              ))}

              <div className="pscan-card">
                <div className="pscan-card-header">
                  <div className="pscan-card-brand">Mary Jane Farms</div>
                </div>

                <div className="pscan-card-body">
                  {FIELDS.map((field, i) => {
                    const isRevealed = revealedFields >= i + 1;
                    const isActive = revealedFields === i + 1;
                    return (
                      <div
                        key={i}
                        className={`pscan-field${isRevealed ? ' revealed' : ''}${isActive ? ' active' : ''}`}
                      >
                        {field.type === 'title' && (
                          <span className="pscan-field-title">{field.label}</span>
                        )}
                        {field.type === 'badge' && (
                          <span className="pscan-field-badge">{field.label}</span>
                        )}
                        {field.type === 'text' && (
                          <span className="pscan-field-text">{field.label}</span>
                        )}
                      </div>
                    );
                  })}

                  <div className={`pscan-barcode${revealedFields >= 6 ? ' revealed' : ''}`}>
                    {BARCODE_BARS.map((w, i) =>
                      i % 2 === 0 ? (
                        <div key={i} className="pscan-bar" style={{ width: w }} />
                      ) : (
                        <div key={i} className="pscan-bar-space" style={{ width: w }} />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pscan-noise" />
        </div>
      </div>
    </div>
  );
}
