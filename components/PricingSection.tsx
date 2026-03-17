'use client';

import { ZapIcon, LockIcon } from './icons';

interface PricingSectionProps {
  onNavigate: (section: string) => void;
}

export default function PricingSection({ onNavigate }: PricingSectionProps) {
  return (
    <section className="pricing">
      <div className="pricing-header">
        <h2 className="pricing-title">Foundation Pricing</h2>
      </div>

      <div className="pricing-card">
        <div className="popular-badge">
          <ZapIcon size={16} color="#000" /> FOUNDATION RATE
        </div>
        <div className="price-comparison">
          <div className="plan-price">$1000</div>
          <p className="plan-period">per month, per location</p>
        </div>

        <div className="lifetime-lock">
          <LockIcon size={20} color="#C9A961" /> Lifetime Price Lock - You&apos;ll never pay more, even when we raise prices
        </div>

        <ul className="features">
          <li>Single location, unlimited products</li>
          <li>AI instant recognition (50,000+ SKUs trained)</li>
          <li>Predictive restocking intelligence</li>
          <li>AI budtender assistant</li>
          <li>Sample tracking &amp; attribution</li>
          <li>Full METRC integration</li>
          <li>Automated budget management</li>
          <li>Priority support</li>
          <li>Save $1,560/year vs regular price</li>
        </ul>

        <button className="plan-btn" onClick={() => onNavigate('contact')}>
          Claim Your Foundation Spot
        </button>
      </div>
    </section>
  );
}
