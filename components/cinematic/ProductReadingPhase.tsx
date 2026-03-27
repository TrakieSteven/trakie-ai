'use client';

import { useState, useEffect } from 'react';

const ROWS = [
  { labelText: 'SOUR DIESEL',  field: 'Product Name',  extracted: 'Sour Diesel' },
  { labelText: 'HYBRID',       field: 'Strain Type',   extracted: 'Hybrid' },
  { labelText: '3.5 G',        field: 'Net Weight',    extracted: '3.5g' },
  { labelText: 'THC 24.5%',    field: 'THC %',         extracted: '24.5%' },
  { labelText: 'CBD 0.12%',    field: 'CBD %',         extracted: '0.12%' },
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
      `}</style>

      <div style={{ display: 'flex', gap: 20, maxWidth: 760, width: '100%', alignItems: 'center' }}>

        {/* ── Left: Product Label ── */}
        <div style={{ flex: '0 0 42%', display: 'flex', justifyContent: 'center' }}>
          {/* outer "jar" label look */}
          <div style={{
            background: '#fff',
            borderRadius: 10,
            width: '100%',
            maxWidth: 240,
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            overflow: 'hidden',
            border: '1.5px solid rgba(255,255,255,0.15)',
          }}>
            {/* top band */}
            <div style={{ background: '#111', height: 10 }} />

            {/* label rows */}
            {ROWS.map((row, i) => (
              <div
                key={i}
                style={{
                  padding: i === 0 ? '16px 18px 12px' : '10px 18px',
                  textAlign: 'center',
                  borderLeft: `4px solid ${active === i ? 'rgba(74,222,128,0.9)' : filled.has(i) ? 'rgba(74,222,128,0.35)' : 'transparent'}`,
                  background: active === i
                    ? 'rgba(74,222,128,0.12)'
                    : filled.has(i)
                    ? 'rgba(74,222,128,0.04)'
                    : 'transparent',
                  borderBottom: i < ROWS.length - 1 ? '1px solid #EAEAEA' : 'none',
                  transition: 'background 0.25s ease, border-color 0.25s ease',
                }}
              >
                {i === 1 ? (
                  /* HYBRID gets a bordered box like the real label */
                  <span style={{
                    display: 'inline-block',
                    border: `2px solid ${filled.has(i) ? 'rgba(74,222,128,0.7)' : '#BBB'}`,
                    borderRadius: 3,
                    padding: '2px 18px',
                    fontFamily: 'sans-serif',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#222',
                    letterSpacing: 2,
                    transition: 'border-color 0.3s ease',
                  }}>HYBRID</span>
                ) : (
                  <span style={{
                    fontFamily: 'sans-serif',
                    fontSize: i === 0 ? 22 : 14,
                    fontWeight: i === 0 ? 900 : 600,
                    color: '#111',
                    letterSpacing: i === 0 ? 1 : 0.5,
                  }}>{row.labelText}</span>
                )}
              </div>
            ))}

            {/* bottom band */}
            <div style={{ background: '#111', height: 10 }} />
          </div>
        </div>

        {/* ── Right: Dutchie fields ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* status badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 13px',
            marginBottom: 12,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 8,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: done ? '#4ade80' : '#C9A961',
              animation: done ? 'none' : 'scanPulse 1s ease infinite',
              display: 'inline-block',
            }} />
            <span style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5 }}>
              {done ? 'Label read — 5 fields extracted' : 'trakie.ai reading product label…'}
            </span>
          </div>

          {/* extracted fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {ROWS.map((row, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 13px',
                  borderRadius: 8,
                  border: `1px solid ${filled.has(i) ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  background: filled.has(i) ? 'rgba(74,222,128,0.07)' : 'rgba(255,255,255,0.025)',
                  transition: 'border-color 0.3s ease, background 0.3s ease',
                  animation: active === i ? 'fieldPop 0.35s ease both' : 'none',
                  opacity: filled.has(i) ? 1 : 0.35,
                }}
              >
                <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>{row.field}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {filled.has(i) && <span style={{ color: '#4ade80', fontSize: 10, flexShrink: 0 }}>✓</span>}
                  <span style={{
                    fontFamily: 'var(--font-outfit),sans-serif',
                    fontSize: 13,
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
