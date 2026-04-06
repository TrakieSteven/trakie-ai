'use client';

import { useState, useEffect } from 'react';
import ProductLabel from '../ProductLabel';

const FIELDS = [
  { label: 'SOUR DIESEL', type: 'title' },
  { label: 'HYBRID',      type: 'badge' },
  { label: '3.5g',        type: 'text' },
  { label: 'THC 24.5%',   type: 'text' },
  { label: 'CBD 0.12%',   type: 'text' },
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

        /* ── product label inside phone ── */
        .pscan-label-wrap {
          position: absolute;
          inset: 8px 6px;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── scan overlay fields ── */
        .pscan-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          flex-direction: column;
          justify-content: center;
          pointer-events: none;
          padding: 0 6px;
        }

        .pscan-field {
          padding: 6px 10px;
          margin: 2px 0;
          border-radius: 4px;
          border-left: 3px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(4px);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          background: transparent;
        }
        .pscan-field.revealed {
          opacity: 1;
          transform: translateY(0);
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
        }
        .pscan-field.active {
          background: rgba(74, 222, 128, 0.15);
          border-left-color: rgba(74, 222, 128, 0.8);
          backdrop-filter: blur(6px);
        }

        .pscan-field-title {
          font-family: var(--font-outfit), sans-serif;
          font-size: 15px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 1px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }

        .pscan-field-badge {
          display: inline-block;
          border: 1.5px solid rgba(74, 222, 128, 0.6);
          border-radius: 3px;
          padding: 1px 12px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: rgba(74, 222, 128, 0.9);
          letter-spacing: 2px;
        }

        .pscan-field-text {
          font-family: var(--font-outfit), sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.5px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
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
          .pscan-label-wrap { inset: 6px 4px; }
          .pscan-field { padding: 4px 8px; }
          .pscan-field-title { font-size: 13px; }
          .pscan-field-badge { font-size: 9px; padding: 1px 8px; }
          .pscan-field-text { font-size: 11px; }
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

              {/* Realistic product label */}
              <div className="pscan-label-wrap">
                <ProductLabel size="sm" />
              </div>

              {/* Scan reveal overlay */}
              <div className="pscan-overlay">
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
              </div>
            </div>
          </div>

          <div className="pscan-noise" />
        </div>
      </div>
    </div>
  );
}
