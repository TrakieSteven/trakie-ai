'use client';

import { useState, useEffect } from 'react';

/* 21×21 QR-code-style pattern (1 = dark, 0 = light)
   Finder patterns at TL, TR, BL corners; center cleared for logo */
const QR_PATTERN = [
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0],
  [1,0,1,0,0,1,1,0,1,0,0,0,1,0,0,1,1,0,1,0,1],
  [0,1,0,1,1,0,0,1,0,0,0,0,0,1,1,0,0,1,0,1,0],
  [1,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,1],
  [0,1,0,0,1,1,0,1,0,0,0,0,0,1,0,1,0,1,1,0,0],
  [1,0,1,1,0,1,0,0,1,0,0,0,1,0,1,0,1,0,0,1,1],
  [0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,0,1,0,0,1,0,1],
  [1,0,0,0,0,0,1,0,0,1,1,0,0,0,1,0,1,1,0,1,0],
  [1,0,1,1,1,0,1,0,1,0,1,1,0,0,0,1,0,1,0,0,1],
  [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,0,1,0,1,1,0],
  [1,0,1,1,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0],
  [1,0,0,0,0,0,1,0,0,1,0,1,1,0,1,0,1,0,0,1,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,0,1,1,0,1],
];

export default function QrPhase() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setConnected(true), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="cinematic-phase">
      <style>{`
        .qr-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 860px;
        }

        .qr-label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(74, 222, 128, 0.7);
          margin-bottom: 28px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 20px;
        }

        .qr-viewfinder {
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

        .qr-bracket {
          position: absolute;
          z-index: 5;
          pointer-events: none;
        }
        .qr-bracket svg {
          display: block;
          width: 48px;
          height: 48px;
        }
        .qr-bracket.tl { top: 20px; left: 20px; }
        .qr-bracket.tr { top: 20px; right: 20px; transform: scaleX(-1); }
        .qr-bracket.bl { bottom: 20px; left: 20px; transform: scaleY(-1); }
        .qr-bracket.br { bottom: 20px; right: 20px; transform: scale(-1); }

        .qr-beam {
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
          animation: qrBeam 2.8s ease-in-out infinite;
        }
        @keyframes qrBeam {
          0%   { top: 20px; }
          50%  { top: calc(100% - 22px); }
          100% { top: 20px; }
        }

        .qr-glow {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: radial-gradient(ellipse at center, rgba(74, 222, 128, 0.05) 0%, transparent 65%);
          animation: qrGlow 3.5s ease-in-out infinite;
        }
        @keyframes qrGlow {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 1; }
        }

        /* ── QR code card ── */
        .qr-card {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 260px;
          height: 260px;
          z-index: 2;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
        }

        .qr-grid {
          display: grid;
          grid-template-columns: repeat(21, 1fr);
          grid-template-rows: repeat(21, 1fr);
          width: 100%;
          height: 100%;
          gap: 1px;
          position: relative;
        }

        .qr-cell {
          border-radius: 1px;
        }
        .qr-cell-dark {
          background: rgba(255, 255, 255, 0.8);
        }
        .qr-cell-light {
          background: rgba(255, 255, 255, 0.05);
        }

        /* ── logo overlay in center of QR ── */
        .qr-logo {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 56px;
          height: 56px;
          border-radius: 10px;
          background: rgba(13, 31, 13, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          border: 2px solid rgba(255, 255, 255, 0.12);
        }
        .qr-logo img {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        /* ── connected overlay ── */
        .qr-connected-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          z-index: 10;
          animation: qrFadeIn 0.5s ease both;
        }
        @keyframes qrFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .qr-success-badge {
          background: rgba(74, 222, 128, 0.12);
          border: 1.5px solid rgba(74, 222, 128, 0.6);
          border-radius: 18px;
          padding: 28px 48px;
          text-align: center;
          animation: qrBadgePop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes qrBadgePop {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }

        .qr-success-check {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(74, 222, 128, 0.2);
          border: 2px solid rgba(74, 222, 128, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
          font-size: 26px;
          color: #4ade80;
        }

        .qr-success-title {
          font-family: var(--font-outfit), sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #4ade80;
          letter-spacing: 1px;
        }

        .qr-success-sub {
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 8px;
        }

        .qr-noise {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
        }

        @media (max-width: 600px) {
          .qr-viewfinder { height: 55vh; border-radius: 14px; }
          .qr-bracket svg { width: 36px; height: 36px; }
          .qr-bracket.tl, .qr-bracket.tr { top: 14px; }
          .qr-bracket.bl, .qr-bracket.br { bottom: 14px; }
          .qr-bracket.tl, .qr-bracket.bl { left: 14px; }
          .qr-bracket.tr, .qr-bracket.br { right: 14px; }
          .qr-card { width: 200px; height: 200px; padding: 12px; }
          .qr-logo { width: 44px; height: 44px; }
          .qr-logo img { width: 30px; height: 30px; }
          .qr-success-badge { padding: 22px 32px; }
        }
      `}</style>

      <div className="qr-wrap">
        <div className="qr-label">
          {connected ? (
            <span style={{ color: 'rgba(74,222,128,1)', display: 'flex', alignItems: 'center', gap: 6, animation: 'qrFadeIn 0.4s ease both' }}>
              <span style={{ fontSize: 16 }}>✓</span> Phone Connected
            </span>
          ) : (
            <span>Scanning QR Code · Connecting Phone</span>
          )}
        </div>

        <div className="qr-viewfinder">
          <div className="qr-glow" />

          {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
            <div key={pos} className={`qr-bracket ${pos}`}>
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

          {!connected && <div className="qr-beam" />}

          <div className="qr-card">
            <div className="qr-grid">
              {QR_PATTERN.map((row, r) =>
                row.map((cell, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={`qr-cell ${cell ? 'qr-cell-dark' : 'qr-cell-light'}`}
                  />
                ))
              )}
            </div>
            <div className="qr-logo">
              <img src="/logo.png" alt="Trakie" />
            </div>
          </div>

          {connected && (
            <div className="qr-connected-overlay">
              <div className="qr-success-badge">
                <div className="qr-success-check">✓</div>
                <div className="qr-success-title">Connected</div>
                <div className="qr-success-sub">Desktop + Phone synced</div>
              </div>
            </div>
          )}

          <div className="qr-noise" />
        </div>
      </div>
    </div>
  );
}
