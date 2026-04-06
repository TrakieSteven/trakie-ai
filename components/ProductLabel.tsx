'use client';

import React from 'react';

interface ProductLabelProps {
  brand?: string;
  strain?: string;
  strainType?: string;
  weight?: string;
  thc?: string;
  cbd?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Additional className for the wrapper */
  className?: string;
  /** Additional inline styles for the wrapper */
  style?: React.CSSProperties;
}

/* Barcode bar widths — alternating dark/light strips */
const BARCODE_BARS = [
  2,1,1,3,1,2,1,1,3,1,1,2,1,3,1,1,2,1,1,1,3,1,2,1,1,3,1,2,1,1,1,2,3,1,1,2,1,1,3,1,2,1,1,2,1,3,1,1,2,1,
];

const SCALE: Record<string, { wrapper: number; font: number }> = {
  sm: { wrapper: 0.62, font: 0.7 },
  md: { wrapper: 0.85, font: 0.85 },
  lg: { wrapper: 1, font: 1 },
};

export default function ProductLabel({
  brand = 'Mary Jane Farms',
  strain = 'SOUR DIESEL',
  strainType = 'BALANCED HYBRID',
  weight = '3.5 GRAMS OF FLOWER',
  thc = '24.5',
  cbd = '0.12',
  size = 'md',
  className,
  style,
}: ProductLabelProps) {
  const s = SCALE[size] || SCALE.md;

  return (
    <>
      <style>{`
        /* ── Mylar bag outer ── */
        .plabel-bag {
          position: relative;
          width: 100%;
          border-radius: ${10 * s.wrapper}px;
          overflow: hidden;
          background: linear-gradient(170deg, #1a2318 0%, #0e1a0c 35%, #151d12 60%, #0c140a 100%);
          box-shadow:
            0 2px 20px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.06),
            inset 0 -1px 0 rgba(0,0,0,0.3);
          font-family: var(--font-outfit), sans-serif;
        }

        /* Subtle mylar sheen */
        .plabel-bag::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.04) 0%,
            transparent 40%,
            rgba(255,255,255,0.02) 60%,
            transparent 100%
          );
          z-index: 1;
          pointer-events: none;
        }

        /* Botanical leaf pattern overlay */
        .plabel-leaves {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.08;
        }

        /* ── Brand header ── */
        .plabel-brand-area {
          position: relative;
          z-index: 2;
          padding: ${14 * s.wrapper}px ${16 * s.wrapper}px ${6 * s.wrapper}px;
          text-align: center;
        }
        .plabel-brand-name {
          font-family: var(--font-bodoni), 'Bodoni Moda', serif;
          font-size: ${20 * s.font}px;
          font-weight: 700;
          color: #C9A961;
          letter-spacing: ${3 * s.font}px;
          text-transform: uppercase;
          text-shadow: 0 1px 6px rgba(0,0,0,0.5);
          line-height: 1.2;
        }
        .plabel-category {
          font-size: ${8 * s.font}px;
          font-weight: 600;
          letter-spacing: ${3 * s.font}px;
          text-transform: uppercase;
          color: rgba(201,169,97,0.6);
          margin-top: ${3 * s.wrapper}px;
        }

        /* ── Divider ── */
        .plabel-divider {
          position: relative;
          z-index: 2;
          height: 1px;
          margin: ${6 * s.wrapper}px ${16 * s.wrapper}px;
          background: linear-gradient(90deg, transparent, rgba(201,169,97,0.3), transparent);
        }

        /* ── Kraft inner label ── */
        .plabel-kraft {
          position: relative;
          z-index: 2;
          margin: ${4 * s.wrapper}px ${10 * s.wrapper}px ${10 * s.wrapper}px;
          border-radius: ${6 * s.wrapper}px;
          background: linear-gradient(180deg, #d4c4a0 0%, #c7b68e 40%, #bfae84 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.3),
            0 2px 8px rgba(0,0,0,0.3);
          padding: ${10 * s.wrapper}px ${12 * s.wrapper}px ${8 * s.wrapper}px;
          color: #2a2318;
        }

        /* Kraft paper texture */
        .plabel-kraft::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          opacity: 0.06;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 100px 100px;
          pointer-events: none;
        }

        .plabel-strain {
          font-size: ${16 * s.font}px;
          font-weight: 900;
          letter-spacing: ${2 * s.font}px;
          text-transform: uppercase;
          text-align: center;
          color: #1a1408;
          line-height: 1.2;
        }

        .plabel-type-badge {
          display: block;
          margin: ${5 * s.wrapper}px auto ${4 * s.wrapper}px;
          width: fit-content;
          padding: ${2 * s.wrapper}px ${10 * s.wrapper}px;
          border: ${1.5 * s.wrapper}px solid #8B7355;
          border-radius: ${3 * s.wrapper}px;
          font-size: ${7 * s.font}px;
          font-weight: 700;
          letter-spacing: ${2.5 * s.font}px;
          text-transform: uppercase;
          color: #5c4a2e;
          text-align: center;
        }

        .plabel-weight {
          text-align: center;
          font-size: ${7 * s.font}px;
          font-weight: 600;
          letter-spacing: ${2 * s.font}px;
          text-transform: uppercase;
          color: #6b5c40;
          margin-bottom: ${6 * s.wrapper}px;
        }

        /* THC / CBD row */
        .plabel-potency {
          display: flex;
          justify-content: center;
          gap: ${12 * s.wrapper}px;
          margin-bottom: ${6 * s.wrapper}px;
        }
        .plabel-potency-item {
          text-align: center;
        }
        .plabel-potency-pct {
          font-size: ${14 * s.font}px;
          font-weight: 900;
          color: #1a1408;
          line-height: 1.1;
        }
        .plabel-potency-label {
          font-size: ${6 * s.font}px;
          font-weight: 700;
          letter-spacing: ${1.5 * s.font}px;
          text-transform: uppercase;
          color: #8B7355;
        }
        .plabel-potency-mg {
          font-size: ${5.5 * s.font}px;
          color: #8a7a5e;
          margin-top: ${1 * s.wrapper}px;
        }

        /* Lot / expiration */
        .plabel-meta {
          display: flex;
          justify-content: space-between;
          font-size: ${5.5 * s.font}px;
          font-weight: 600;
          color: #8a7a5e;
          letter-spacing: ${0.8 * s.font}px;
          text-transform: uppercase;
          margin-bottom: ${6 * s.wrapper}px;
          padding: 0 ${2 * s.wrapper}px;
        }

        /* QR + barcode area */
        .plabel-codes {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: ${8 * s.wrapper}px;
          margin-bottom: ${6 * s.wrapper}px;
        }

        .plabel-qr {
          width: ${32 * s.wrapper}px;
          height: ${32 * s.wrapper}px;
          flex-shrink: 0;
        }

        .plabel-barcode-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          height: ${22 * s.wrapper}px;
        }
        .plabel-bbar {
          height: 100%;
          background: #2a2318;
        }
        .plabel-bbar-space {
          height: 100%;
          background: transparent;
        }

        /* Warning footer */
        .plabel-warning {
          display: flex;
          align-items: center;
          gap: ${6 * s.wrapper}px;
          padding-top: ${5 * s.wrapper}px;
          border-top: 1px solid rgba(139,115,85,0.25);
        }
        .plabel-warning-badges {
          display: flex;
          gap: ${4 * s.wrapper}px;
          flex-shrink: 0;
        }
        .plabel-21badge {
          width: ${18 * s.wrapper}px;
          height: ${18 * s.wrapper}px;
          border-radius: 50%;
          border: ${1.5 * s.wrapper}px solid #8B7355;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${7 * s.font}px;
          font-weight: 900;
          color: #5c4a2e;
          line-height: 1;
        }
        .plabel-thc-sym {
          width: ${18 * s.wrapper}px;
          height: ${18 * s.wrapper}px;
          flex-shrink: 0;
        }
        .plabel-warning-text {
          font-size: ${4.5 * s.font}px;
          color: #8a7a5e;
          line-height: 1.3;
          letter-spacing: ${0.3 * s.font}px;
        }

        @media (max-width: 600px) {
          .plabel-brand-name { font-size: ${16 * s.font}px !important; letter-spacing: ${2 * s.font}px !important; }
          .plabel-strain { font-size: ${13 * s.font}px !important; }
          .plabel-potency-pct { font-size: ${12 * s.font}px !important; }
        }
      `}</style>

      <div className={`plabel-bag${className ? ` ${className}` : ''}`} style={style}>
        {/* Botanical leaf SVG pattern */}
        <svg className="plabel-leaves" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {/* Scattered cannabis leaf silhouettes */}
          <g fill="#C9A961">
            <path d="M40,60 Q50,30 60,60 Q55,50 50,65 Q45,50 40,60Z" />
            <path d="M30,50 Q40,35 45,55 L38,55Z" />
            <path d="M55,50 Q50,35 60,55 L55,55Z" />
            <path d="M200,120 Q210,90 220,120 Q215,110 210,125 Q205,110 200,120Z" />
            <path d="M190,110 Q200,95 205,115 L198,115Z" />
            <path d="M215,110 Q210,95 220,115 L215,115Z" />
            <path d="M120,200 Q130,170 140,200 Q135,190 130,205 Q125,190 120,200Z" />
            <path d="M110,190 Q120,175 125,195 L118,195Z" />
            <path d="M135,190 Q130,175 140,195 L135,195Z" />
            <path d="M250,280 Q260,250 270,280 Q265,270 260,285 Q255,270 250,280Z" />
            <path d="M240,270 Q250,255 255,275 L248,275Z" />
            <path d="M265,270 Q260,255 270,275 L265,275Z" />
            <path d="M60,320 Q70,290 80,320 Q75,310 70,325 Q65,310 60,320Z" />
            <path d="M50,310 Q60,295 65,315 L58,315Z" />
            <path d="M75,310 Q70,295 80,315 L75,315Z" />
            <path d="M170,370 Q180,340 190,370 Q185,360 180,375 Q175,360 170,370Z" />
          </g>
        </svg>

        {/* Brand header */}
        <div className="plabel-brand-area">
          <div className="plabel-brand-name">{brand}</div>
          <div className="plabel-category">FLOWER&ensp;·&ensp;EIGHTH</div>
        </div>

        <div className="plabel-divider" />

        {/* Kraft inner label */}
        <div className="plabel-kraft">
          <div className="plabel-strain">{strain}</div>
          <div className="plabel-type-badge">{strainType}</div>
          <div className="plabel-weight">{weight}</div>

          {/* Potency */}
          <div className="plabel-potency">
            <div className="plabel-potency-item">
              <div className="plabel-potency-pct">{thc}%</div>
              <div className="plabel-potency-label">THC</div>
              <div className="plabel-potency-mg">{(parseFloat(thc) * 10).toFixed(0)} mg/g</div>
            </div>
            <div className="plabel-potency-item">
              <div className="plabel-potency-pct">{cbd}%</div>
              <div className="plabel-potency-label">CBD</div>
              <div className="plabel-potency-mg">{(parseFloat(cbd) * 10).toFixed(1)} mg/g</div>
            </div>
          </div>

          {/* Meta */}
          <div className="plabel-meta">
            <span>LOT# MJF-2024-0847</span>
            <span>EXP 12/2025</span>
          </div>

          {/* QR + Barcode */}
          <div className="plabel-codes">
            {/* QR placeholder */}
            <svg className="plabel-qr" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" fill="#2a2318" rx="2" />
              {/* Corner finder patterns */}
              <rect x="2" y="2" width="10" height="10" fill="#d4c4a0" rx="1" />
              <rect x="4" y="4" width="6" height="6" fill="#2a2318" rx="0.5" />
              <rect x="5.5" y="5.5" width="3" height="3" fill="#d4c4a0" />
              <rect x="20" y="2" width="10" height="10" fill="#d4c4a0" rx="1" />
              <rect x="22" y="4" width="6" height="6" fill="#2a2318" rx="0.5" />
              <rect x="23.5" y="5.5" width="3" height="3" fill="#d4c4a0" />
              <rect x="2" y="20" width="10" height="10" fill="#d4c4a0" rx="1" />
              <rect x="4" y="22" width="6" height="6" fill="#2a2318" rx="0.5" />
              <rect x="5.5" y="23.5" width="3" height="3" fill="#d4c4a0" />
              {/* Data dots */}
              {[14,16,18,20,22,15,17,21,14,19,16,23,18,25].map((x, i) => (
                <rect key={i} x={x % 13 + 13} y={Math.floor(i / 2) * 2 + 14} width="1.5" height="1.5" fill="#d4c4a0" opacity={0.7 + (i % 3) * 0.1} />
              ))}
            </svg>

            {/* Barcode */}
            <div className="plabel-barcode-wrap">
              {BARCODE_BARS.map((w, i) =>
                i % 2 === 0 ? (
                  <div key={i} className="plabel-bbar" style={{ width: w * s.wrapper }} />
                ) : (
                  <div key={i} className="plabel-bbar-space" style={{ width: w * s.wrapper }} />
                )
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="plabel-warning">
            <div className="plabel-warning-badges">
              <div className="plabel-21badge">21+</div>
              {/* THC warning triangle */}
              <svg className="plabel-thc-sym" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <polygon points="10,2 19,18 1,18" fill="none" stroke="#8B7355" strokeWidth="1.5" />
                <text x="10" y="15" textAnchor="middle" fontSize="7" fontWeight="900" fill="#5c4a2e" fontFamily="sans-serif">!</text>
              </svg>
            </div>
            <div className="plabel-warning-text">
              GOVERNMENT WARNING: This product contains cannabis, a Schedule I controlled substance. Keep out of reach of children and animals.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
