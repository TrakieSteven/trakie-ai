'use client';

import { useState, useEffect } from 'react';

const INVOICE_LINES = [
  { label: 'Vendor', value: 'Mary Jane Farms LLC' },
  { label: 'Product', value: 'Sour Diesel · Hybrid · Flower · 3.5 g' },
  { label: 'Batch / Lot', value: 'LOT-SD-0326-B' },
  { label: 'METRC Package', value: '1A4060300002F04000031847' },
  { label: 'Qty × Price', value: '48 units × $12.00' },
  { label: 'Total', value: '$576.00' },
];

export default function ScanPhase() {
  const [revealedLines, setRevealedLines] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    INVOICE_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealedLines(i + 1), 700 + i * 420));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="cinematic-phase">
      <style>{`
        /* ── wrapper: fill the phase, cap width ── */
        .inv-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 860px;
        }

        .inv-label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(74, 222, 128, 0.7);
          margin-bottom: 28px;
          text-align: center;
        }

        /* ── viewfinder: use vh so it fills the screen ── */
        .inv-viewfinder {
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

        /* ── corner brackets via real elements ── */
        .inv-bracket {
          position: absolute;
          z-index: 5;
          pointer-events: none;
        }
        .inv-bracket svg {
          display: block;
          width: 48px;
          height: 48px;
        }
        .inv-bracket.tl { top: 20px; left: 20px; }
        .inv-bracket.tr { top: 20px; right: 20px; transform: scaleX(-1); }
        .inv-bracket.bl { bottom: 20px; left: 20px; transform: scaleY(-1); }
        .inv-bracket.br { bottom: 20px; right: 20px; transform: scale(-1); }

        /* ── scanning beam ── */
        .inv-beam {
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
          animation: invBeam 2.8s ease-in-out infinite;
        }
        @keyframes invBeam {
          0%   { top: 20px; }
          50%  { top: calc(100% - 22px); }
          100% { top: 20px; }
        }

        /* ── ambient glow ── */
        .inv-glow {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: radial-gradient(ellipse at center, rgba(74, 222, 128, 0.05) 0%, transparent 65%);
          animation: invGlow 3.5s ease-in-out infinite;
        }
        @keyframes invGlow {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 1; }
        }

        /* ── invoice document card: inset from brackets ── */
        .inv-doc {
          position: absolute;
          top: 44px;
          left: 44px;
          right: 44px;
          bottom: 44px;
          z-index: 2;
          border-radius: 12px;
          background: rgba(245, 242, 234, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .inv-doc-header {
          padding: 16px 24px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }
        .inv-doc-title {
          font-family: var(--font-outfit), sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(201, 168, 92, 0.85);
        }
        .inv-doc-id {
          font-family: monospace;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.2);
        }

        .inv-doc-vendor {
          padding: 12px 24px 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }
        .inv-doc-vendor-label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.25);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 2px;
        }
        .inv-doc-vendor-name {
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
        }
        .inv-doc-vendor-date {
          font-family: var(--font-outfit), sans-serif;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.2);
          margin-top: 3px;
        }

        /* ── rows ── */
        .inv-rows {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 4px 0;
          overflow: hidden;
        }

        .inv-row {
          display: flex;
          align-items: center;
          padding: 9px 24px;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          opacity: 0;
          transform: translateY(6px);
          transition: all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border-left: 2px solid transparent;
        }
        .inv-row.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .inv-row.active {
          background: rgba(74, 222, 128, 0.06);
          border-left-color: rgba(74, 222, 128, 0.6);
        }

        .inv-row-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.06);
          transition: all 0.35s ease;
        }
        .inv-row.revealed .inv-row-dot {
          background: #4ade80;
          box-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
        }

        .inv-row-label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          flex-shrink: 0;
          min-width: 105px;
        }
        .inv-row.revealed .inv-row-label {
          color: rgba(255, 255, 255, 0.45);
        }

        .inv-row-value {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.12);
          text-align: right;
          flex: 1;
          transition: color 0.35s ease;
        }
        .inv-row.revealed .inv-row-value {
          color: rgba(255, 255, 255, 0.85);
        }

        /* ── grain ── */
        .inv-noise {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
        }

        @media (max-width: 600px) {
          .inv-viewfinder { height: 55vh; border-radius: 14px; }
          .inv-doc { top: 32px; left: 28px; right: 28px; bottom: 32px; }
          .inv-bracket svg { width: 36px; height: 36px; }
          .inv-bracket.tl, .inv-bracket.tr { top: 14px; }
          .inv-bracket.bl, .inv-bracket.br { bottom: 14px; }
          .inv-bracket.tl, .inv-bracket.bl { left: 14px; }
          .inv-bracket.tr, .inv-bracket.br { right: 14px; }
          .inv-doc-header { padding: 12px 16px 10px; }
          .inv-doc-vendor { padding: 10px 16px 8px; }
          .inv-row { padding: 7px 16px; }
          .inv-row-label { min-width: 70px; font-size: 10px; }
          .inv-row-value { font-size: 10px; }
        }
      `}</style>

      <div className="inv-wrap">
        <div className="inv-label">Scanning Invoice</div>

        <div className="inv-viewfinder">
          <div className="inv-glow" />

          {/* corner brackets — using inline SVG for reliable rendering */}
          {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
            <div key={pos} className={`inv-bracket ${pos}`}>
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

          <div className="inv-beam" />

          <div className="inv-doc">
            <div className="inv-doc-header">
              <span className="inv-doc-title">Invoice</span>
              <span className="inv-doc-id">#INV-0326-847</span>
            </div>

            <div className="inv-doc-vendor">
              <div className="inv-doc-vendor-label">From</div>
              <div className="inv-doc-vendor-name">Mary Jane Farms LLC</div>
              <div className="inv-doc-vendor-date">March 26, 2026</div>
            </div>

            <div className="inv-rows">
              {INVOICE_LINES.map((line, i) => (
                <div
                  key={i}
                  className={`inv-row${i < revealedLines ? ' revealed' : ''}${i === revealedLines - 1 ? ' active' : ''}`}
                >
                  <span className="inv-row-dot" />
                  <span className="inv-row-label">{line.label}</span>
                  <span className="inv-row-value">{line.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="inv-noise" />
        </div>
      </div>
    </div>
  );
}
