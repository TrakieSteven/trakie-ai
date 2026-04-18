'use client';

/* ═══════════════════════════════════════════════════════
   STATS STRIP — Static 3-stat bar
   Dark bg, champagne/gold numbers
═══════════════════════════════════════════════════════ */

const STATS = [
  { value: '60 sec', label: 'Average Receive' },
  { value: '45 min', label: 'Saved Per Shipment' },
  { value: '100%', label: 'Dutchie-Native' },
];

export default function StatsStrip() {
  return (
    <section className="stats-strip">
      <div className="stats-strip-inner">
        {STATS.map((stat, i) => (
          <div key={i} className="stats-strip-item">
            <span className="stats-strip-value">{stat.value}</span>
            <span className="stats-strip-label">{stat.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        .stats-strip {
          width: 100%;
          padding: 40px 24px;
          background: rgba(0, 0, 0, 0.4);
          border-top: 1px solid rgba(201, 169, 97, 0.1);
          border-bottom: 1px solid rgba(201, 169, 97, 0.1);
        }
        .stats-strip-inner {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          gap: 48px;
        }
        .stats-strip-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .stats-strip-value {
          font-family: var(--font-bodoni), 'Bodoni Moda', serif;
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 400;
          color: #C9A961;
          letter-spacing: -0.5px;
          line-height: 1;
        }
        .stats-strip-label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.78);
        }

        @media (max-width: 600px) {
          .stats-strip {
            padding: 32px 16px;
          }
          .stats-strip-inner {
            gap: 24px;
          }
          .stats-strip-label {
            font-size: 9px;
            letter-spacing: 1px;
          }
        }
      `}</style>
    </section>
  );
}
