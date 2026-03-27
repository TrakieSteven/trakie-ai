'use client';

import { useState, useEffect } from 'react';

const ROWS = [
  { label: 'Vendor',         value: 'Mary Jane Farms LLC',          field: 'Vendor / Supplier',    extracted: 'Mary Jane Farms LLC' },
  { label: 'Product',        value: 'Sour Diesel · Hybrid · Flower · 3.5g', field: 'Product Name',       extracted: 'Sour Diesel | Hybrid | Flower | 3.5g' },
  { label: 'Batch / Lot',    value: 'LOT-SD-0326-B',                      field: 'Batch / Lot ID',       extracted: 'LOT-SD-0326-B' },
  { label: 'METRC Package',  value: '1A4060300002F04000031847',            field: 'Package ID (METRC)',   extracted: '1A4060300002F04000031847' },
  { label: 'Qty × Price',    value: '48 units  ×  $12.00',                field: 'Qty · Unit Cost',      extracted: '48  ×  $12.00' },
  { label: 'Total',          value: '$576.00',                             field: 'Total Package Cost',   extracted: '$576.00' },
];

const STEP_MS = 520;
const INITIAL_MS = 500;

export default function InvoiceReadingPhase() {
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

      <div style={{ display: 'flex', gap: 20, maxWidth: 860, width: '100%', alignItems: 'flex-start' }}>

        {/* ── Left: Invoice Document ── */}
        <div style={{ flex: '0 0 46%', background: '#F5F2EA', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.55)' }}>
          {/* header bar */}
          <div style={{ background: '#1C1C1C', padding: '11px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#C9A55A', textTransform: 'uppercase' }}>Invoice</span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>#INV-0326-847</span>
          </div>
          {/* sub-header */}
          <div style={{ padding: '10px 16px 8px', borderBottom: '1px solid #DDD9CE' }}>
            <div style={{ fontFamily: 'sans-serif', fontSize: 10, color: '#999', marginBottom: 1 }}>From</div>
            <div style={{ fontFamily: 'sans-serif', fontSize: 13, fontWeight: 700, color: '#222' }}>Mary Jane Farms LLC</div>
            <div style={{ fontFamily: 'sans-serif', fontSize: 10, color: '#AAA', marginTop: 3 }}>Date: 03 / 26 / 2026</div>
          </div>
          {/* rows */}
          {ROWS.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '9px 16px',
                gap: 10,
                borderLeft: `3px solid ${active === i ? 'rgba(74,222,128,0.9)' : filled.has(i) ? 'rgba(74,222,128,0.3)' : 'transparent'}`,
                background: active === i
                  ? 'rgba(74,222,128,0.15)'
                  : filled.has(i)
                  ? 'rgba(74,222,128,0.05)'
                  : 'transparent',
                transition: 'background 0.25s ease, border-color 0.25s ease',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <span style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#777', flexShrink: 0, minWidth: 90 }}>{row.label}</span>
              <span style={{
                fontFamily: 'monospace',
                fontSize: 10,
                color: filled.has(i) ? '#2a2a2a' : '#C8C4BA',
                textAlign: 'right',
                wordBreak: 'break-all',
                transition: 'color 0.3s ease',
              }}>{row.value}</span>
            </div>
          ))}
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
              background: done ? '#4ade80' : '#C9A55A',
              animation: done ? 'none' : 'scanPulse 1s ease infinite',
              display: 'inline-block',
            }} />
            <span style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5 }}>
              {done ? 'Invoice read — 6 fields extracted' : 'trakie.ai reading invoice…'}
            </span>
          </div>

          {/* extracted fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {ROWS.map((row, i) => (
              <div
                key={i}
                style={{
                  padding: '9px 13px',
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
                    fontSize: 11,
                    color: filled.has(i) ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.2)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
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
