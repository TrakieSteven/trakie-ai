'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/lib/hooks/useSubscription';
import AuthModal from './AuthModal';

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
  const router = useRouter();
  const { user, isActive: hasActiveSub, loading: subLoading } = useSubscription();
  const [active, setActive] = useState(false);
  const [deliveries, setDeliveries] = useState(5);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
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

  async function startCheckout() {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setCheckoutLoading(false);
      }
    } catch {
      setCheckoutLoading(false);
    }
  }

  function handleCta() {
    if (!user) {
      setAuthModal('signup');
      return;
    }
    if (hasActiveSub) {
      router.push('/account/subscription');
      return;
    }
    startCheckout();
  }

  let ctaLabel: string;
  if (subLoading) ctaLabel = 'Loading…';
  else if (!user) ctaLabel = 'Reserve Your Spot — Free 30-Day Trial';
  else if (hasActiveSub) ctaLabel = 'Manage Subscription';
  else ctaLabel = checkoutLoading ? 'Opening checkout…' : 'Start Free 30-Day Trial';

  return (
    <section className="pv2" ref={ref}>
      <div className="pv2-inner">

        {/* ── PRICE HERO (top) ── */}
        <div className={`pv2-price-hero${active ? ' pv2-price-hero--visible' : ''}`}>
          <div className="pv2-price-hero-number">
            <span className="pv2-price-hero-currency">$</span>499
            <span className="pv2-price-hero-period">/month</span>
          </div>
          <p className="pv2-price-hero-lock">
            <LockIcon />
            Locked for 3 years — regular price $799/month after founding period
          </p>
          <div className="pv2-price-hero-badge">Now Accepting Founding Customers</div>
          <button
            className="pv2-cta"
            onClick={handleCta}
            disabled={subLoading || checkoutLoading}
          >
            {ctaLabel}
          </button>
        </div>

        {/* ── CONTEXT ── */}
        <div className={`pv2-context${active ? ' pv2-context--visible' : ''}`}>
          <p className="pv2-context-primary">
            Based on real inventory staffing costs at NYC dispensaries
          </p>
          <p className="pv2-context-secondary">
            Most dispensaries recover the full cost in week one.
          </p>
        </div>

        {/* ── CALCULATOR (bottom) ── */}
        <div className={`pv2-calc${active ? ' pv2-calc--visible' : ''}`}>
          <div className="pv2-calc-heading">Calculate your savings</div>

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

          <div className="pv2-hero pv2-hero--visible">
            <div className="pv2-label">Monthly Savings Estimate</div>
            <div className="pv2-number">
              <span className="pv2-approx">~</span>
              <span className="pv2-currency">$</span>{Math.round((low + high) / 2).toLocaleString()}
            </div>
            <div className="pv2-unit">per month, per location</div>
            <div className="pv2-range">
              estimated range ${low.toLocaleString()} – ${high.toLocaleString()}
            </div>
            <p className="pv2-context-secondary" style={{ marginTop: 14 }}>
              Based on 30–45 min average manual receiving time per delivery
            </p>
          </div>

          <div className="pv2-table-wrap pv2-table-wrap--visible">
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
            <p className="pv2-wage-note">
              NYC minimum wage is expected to rise to $30/hour — these labor costs are only going up.
            </p>
          </div>
        </div>

      </div>

      {authModal && (
        <AuthModal initialView={authModal} onClose={() => setAuthModal(null)} />
      )}
    </section>
  );
}
