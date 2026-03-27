'use client';

import { useEffect, useRef, useState } from 'react';

interface PricingSectionProps {
  onNavigate: (section: string) => void;
}

function useAnimatedValue(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(target);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!active) return;
    const from = hasRun.current ? prevTarget.current : 0;
    prevTarget.current = target;
    hasRun.current = true;
    const start = performance.now();
    let raf: number;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return value;
}

const laborRows = [
  { role: 'Inventory Receiving Staff', detail: '~40 hrs/wk · $22–26/hr', low: 3500, high: 4200 },
  { role: 'Manager Oversight & Corrections', detail: '~8 hrs/wk · $30–38/hr', low: 870, high: 1560 },
  { role: 'Error Rework & Compliance Fixes', detail: '~6 hrs/wk · $22–26/hr', low: 460, high: 780 },
  { role: 'Shrinkage from Manual Entry Errors', detail: 'lost product, miscounted inventory', low: 120, high: 600 },
  { role: 'Training & Turnover Overhead', detail: 'onboarding, retraining, lost time', low: 150, high: 660 },
];

function LockIcon() {
  return (
    <svg width="13" height="15" viewBox="0 0 13 15" fill="none" style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', flexShrink: 0 }}>
      <rect x="1.5" y="6.5" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 6.5V4.5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function PricingSection({ onNavigate }: PricingSectionProps) {
  const [active, setActive] = useState(false);
  const [deliveries, setDeliveries] = useState(5);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = deliveries / 3;
  const scaledRows = laborRows.map(row => ({
    ...row,
    low: Math.round(row.low * scale),
    high: Math.round(row.high * scale),
  }));
  const totalLow = scaledRows.reduce((sum, r) => sum + r.low, 0);
  const totalHigh = scaledRows.reduce((sum, r) => sum + r.high, 0);

  const low = useAnimatedValue(totalLow, 600, active);
  const high = useAnimatedValue(totalHigh, 600, active);

  return (
    <section className="pv2" ref={ref}>
      <div className="pv2-inner">

        {/* ── SAVINGS HERO ── */}
        <div className={`pv2-hero${active ? ' pv2-hero--visible' : ''}`}>
          <div className="pv2-label">Monthly Savings Estimate</div>
          <p className="pv2-context-secondary" style={{ textAlign: 'center', marginBottom: 20, marginTop: 4 }}>
            Based on 30–45 min average manual receiving time per delivery, per month
          </p>
          <div className="pv2-slider-wrap">
            <label className="pv2-slider-label">
              <span className="pv2-slider-value">{deliveries}</span> deliveries per week
            </label>
            <input
              type="range"
              className="pv2-slider"
              min={1}
              max={10}
              step={1}
              value={deliveries}
              onChange={(e) => setDeliveries(Number(e.target.value))}
            />
            <div className="pv2-slider-range">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
          <div className="pv2-number">
            <span className="pv2-currency">$</span>{low.toLocaleString()}
            <span className="pv2-sep"> – </span>
            <span className="pv2-currency">$</span>{high.toLocaleString()}
          </div>
          <div className="pv2-unit">per month, per location</div>
        </div>

        {/* ── CONTEXT ── */}
        <div className={`pv2-context${active ? ' pv2-context--visible' : ''}`}>
          <p className="pv2-context-primary">
            Based on real inventory staffing costs at NYC dispensaries
          </p>
          <p className="pv2-context-secondary">
            Projected savings not yet adjusted for Mayor Mamdani&apos;s proposed $30/hour minimum wage
          </p>
        </div>

        {/* ── LABOR TABLE ── */}
        <div className={`pv2-table-wrap${active ? ' pv2-table-wrap--visible' : ''}`}>
          <div className="pv2-table-heading">Where the money goes — labor cost breakdown</div>
          <div className="pv2-table-scroll">
            <table className="pv2-table">
              <thead>
                <tr>
                  <th className="pv2-th">Cost Category</th>
                  <th className="pv2-th pv2-th--detail">Detail</th>
                  <th className="pv2-th pv2-th--num">Low</th>
                  <th className="pv2-th pv2-th--num">High</th>
                </tr>
              </thead>
              <tbody>
                {scaledRows.map((row, i) => (
                  <tr key={i} className="pv2-tr">
                    <td className="pv2-td pv2-td--role">{row.role}</td>
                    <td className="pv2-td pv2-td--detail">{row.detail}</td>
                    <td className="pv2-td pv2-td--num">${row.low.toLocaleString()}</td>
                    <td className="pv2-td pv2-td--num">${row.high.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="pv2-tr-total">
                  <td className="pv2-td-total-label" colSpan={2}>Monthly Total</td>
                  <td className="pv2-td-total-num">${totalLow.toLocaleString()}</td>
                  <td className="pv2-td-total-num">${totalHigh.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── PRICE — DE-EMPHASIZED ── */}
        <div className={`pv2-price-block${active ? ' pv2-price-block--visible' : ''}`}>
          <div className="pv2-price-rule" />
          <p className="pv2-price-main">Early Bird: $499/month</p>
          <p className="pv2-price-sub">Most dispensaries recover the full cost in week one.</p>
          <p className="pv2-price-lock">
            <LockIcon />
            Locked for 3 years — regular price $799/month after founding period
          </p>
        </div>

        {/* ── LAUNCH + CTA ── */}
        <div className={`pv2-launch${active ? ' pv2-launch--visible' : ''}`}>
          <div className="pv2-launch-badge">Now Accepting Founding Customers</div>
          <p className="pv2-launch-tagline">Reserve your founding customer spot now</p>
          <button className="pv2-cta" onClick={() => onNavigate('contact')}>
            Reserve Your Spot — Free 30-Day Trial
          </button>
        </div>

      </div>
    </section>
  );
}
