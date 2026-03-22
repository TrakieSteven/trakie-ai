'use client';

import { useEffect, useRef, useState } from 'react';

interface PricingSectionProps {
  onNavigate: (section: string) => void;
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
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

  const low = useCountUp(5100, 1600, active);
  const high = useCountUp(7800, 2000, active);

  return (
    <section className="pv2" ref={ref}>
      <div className="pv2-inner">

        {/* ── SAVINGS HERO ── */}
        <div className={`pv2-hero${active ? ' pv2-hero--visible' : ''}`}>
          <div className="pv2-label">Monthly Savings Estimate</div>
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
                {laborRows.map((row, i) => (
                  <tr key={i} className="pv2-tr">
                    <td className="pv2-td pv2-td--role">{row.role}</td>
                    <td className="pv2-td pv2-td--detail">{row.detail}</td>
                    <td className="pv2-td pv2-td--num">${row.low.toLocaleString()}</td>
                    <td className="pv2-td pv2-td--num">${row.high.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="pv2-tr-total">
                  <td className="pv2-td-total-label" colSpan={2}>Monthly Total</td>
                  <td className="pv2-td-total-num">$5,100</td>
                  <td className="pv2-td-total-num">$7,800</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── PRICE — DE-EMPHASIZED ── */}
        <div className={`pv2-price-block${active ? ' pv2-price-block--visible' : ''}`}>
          <div className="pv2-price-rule" />
          <p className="pv2-price-main">trakie costs $1,000/month</p>
          <p className="pv2-price-sub">Most dispensaries recover the full cost in week one.</p>
          <p className="pv2-price-lock">
            <LockIcon />
            Lifetime price lock — you&apos;ll never pay more, even as we raise prices
          </p>
        </div>

        {/* ── LAUNCH + CTA ── */}
        <div className={`pv2-launch${active ? ' pv2-launch--visible' : ''}`}>
          <div className="pv2-launch-badge">Launching August 2026</div>
          <p className="pv2-launch-tagline">Reserve your founding customer spot now</p>
          <button className="pv2-cta" onClick={() => onNavigate('contact')}>
            Reserve Your Spot — Free 30-Day Trial
          </button>
        </div>

      </div>
    </section>
  );
}
