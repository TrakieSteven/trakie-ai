'use client';

import { useState, useEffect } from 'react';
import ProductLabel from '../ProductLabel';

const ROWS = [
  { field: 'Product Name',  extracted: 'Sour Diesel' },
  { field: 'Strain Type',   extracted: 'Hybrid' },
  { field: 'Net Weight',    extracted: '3.5g' },
  { field: 'THC %',         extracted: '24.5%' },
  { field: 'CBD %',         extracted: '0.12%' },
];

const STEP_MS = 540;
const INITIAL_MS = 450;

export default function ProductReadingPhase() {
  const [active, setActive] = useState(-1);
  const [filled, setFilled] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    ROWS.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setActive(i);
        setFilled(prev => new Set([...prev, i]));
      }, INITIAL_MS + i * STEP_MS));
    });
    timers.push(setTimeout(() => setDone(true), INITIAL_MS + ROWS.length * STEP_MS + 250));
    return () => timers.forEach(clearTimeout);
  }, []);

  /* Map row index to which part of the label is being scanned */
  const highlightArea = (i: number): string => {
    switch (i) {
      case 0: return 'strain';      // Product Name → strain
      case 1: return 'strainType';   // Strain Type → type badge
      case 2: return 'weight';       // Net Weight → weight
      case 3: return 'thcPct';       // THC % → THC potency
      case 4: return 'cbdPct';       // CBD % → CBD potency
      default: return '';
    }
  };

  const activeHighlight = active >= 0 ? highlightArea(active) : '';

  return (
    <div className="cinematic-phase">
      <style>{`
        @keyframes fieldPop {
          from { transform: scale(0.96) translateX(6px); opacity: 0; }
          to   { transform: scale(1) translateX(0);      opacity: 1; }
        }
        @keyframes scanPulse {
          0%,100% { opacity: 0.7; }
          50%      { opacity: 1;   }
        }
        @keyframes labelHighlight {
          0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
          50%     { box-shadow: 0 0 12px 2px rgba(74,222,128,0.25); }
        }

        /* Highlight overlay on label — active scan indicator */
        .pread-label-wrap {
          position: relative;
          width: 100%;
          max-width: 280px;
        }
        .pread-label-wrap .plabel-bag {
          transition: box-shadow 0.3s ease;
        }
        .pread-label-wrap.scanning .plabel-bag {
          animation: labelHighlight 1.2s ease infinite;
        }

        /* Scan line on the label */
        .pread-scan-line {
          position: absolute;
          left: 4px;
          right: 4px;
          height: 2px;
          z-index: 10;
          pointer-events: none;
          background: linear-gradient(90deg, transparent 0%, rgba(74,222,128,0.6) 30%, rgba(74,222,128,0.9) 50%, rgba(74,222,128,0.6) 70%, transparent 100%);
          box-shadow: 0 0 10px 2px rgba(74,222,128,0.2);
          transition: top 0.4s ease, opacity 0.3s ease;
          border-radius: 1px;
        }

        @media (max-width: 700px) {
          .pread-layout { flex-direction: column !important; }
          .pread-label-col { flex: none !important; width: 100% !important; }
          .pread-label-wrap { max-width: 220px !important; margin: 0 auto; }
          .pread-fields-col { flex: none !important; width: 100% !important; }
        }
      `}</style>

      <div className="pread-layout" style={{ display: 'flex', gap: 24, maxWidth: 860, width: '100%', alignItems: 'center' }}>

        {/* ── Left: Product Label ── */}
        <div className="pread-label-col" style={{ flex: '0 0 42%', display: 'flex', justifyContent: 'center' }}>
          <div className={`pread-label-wrap${!done ? ' scanning' : ''}`}>
            {/* Scan line */}
            {!done && (
              <div
                className="pread-scan-line"
                style={{
                  top: active < 0 ? '10%'
                     : active === 0 ? '30%'
                     : active === 1 ? '42%'
                     : active === 2 ? '50%'
                     : active === 3 ? '58%'
                     : '66%',
                  opacity: active < 0 ? 0.4 : 1,
                }}
              />
            )}
            <ProductLabel size="md" />
          </div>
        </div>

        {/* ── Right: Dutchie fields ── */}
        <div className="pread-fields-col" style={{ flex: 1, minWidth: 0 }}>
          {/* status badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '11px 16px',
            marginBottom: 14,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 8,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: done ? '#4ade80' : '#C9A85C',
              animation: done ? 'none' : 'scanPulse 1s ease infinite',
              display: 'inline-block',
            }} />
            <span style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.82)', letterSpacing: 0.5 }}>
              {done ? 'Label read — 5 fields extracted' : 'trakie.ai reading product label…'}
            </span>
          </div>

          {/* extracted fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ROWS.map((row, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: `1px solid ${filled.has(i) ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  background: filled.has(i) ? 'rgba(74,222,128,0.07)' : 'rgba(255,255,255,0.025)',
                  transition: 'border-color 0.3s ease, background 0.3s ease',
                  animation: active === i ? 'fieldPop 0.35s ease both' : 'none',
                  opacity: filled.has(i) ? 1 : 0.35,
                }}
              >
                <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 4 }}>{row.field}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  {filled.has(i) && <span style={{ color: '#4ade80', fontSize: 12, flexShrink: 0 }}>✓</span>}
                  <span style={{
                    fontFamily: 'var(--font-outfit),sans-serif',
                    fontSize: 15,
                    fontWeight: 600,
                    color: filled.has(i) ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                    transition: 'color 0.3s ease',
                  }}>{row.extracted}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
