'use client';

import { useState } from 'react';

export type SubscriptionRow = {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string | null;
  price_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  trial_end: string | null;
};

const ACTIVE_STATUSES = new Set(['trialing', 'active', 'past_due']);

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function statusLabel(status: string | null, cancelAtPeriodEnd: boolean | null): string {
  if (cancelAtPeriodEnd) return 'Cancelling';
  switch (status) {
    case 'trialing': return 'Trialing';
    case 'active': return 'Active';
    case 'past_due': return 'Past due';
    case 'canceled': return 'Cancelled';
    case 'incomplete': return 'Incomplete';
    case 'incomplete_expired': return 'Expired';
    case 'unpaid': return 'Unpaid';
    default: return status ?? '—';
  }
}

interface Props {
  email: string;
  subscription: SubscriptionRow | null;
  checkoutSuccess: boolean;
}

export default function SubscriptionView({ email, subscription, checkoutSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const status = subscription?.status ?? null;
  const isActive = !!status && ACTIVE_STATUSES.has(status);

  async function openPortal() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else { setError(data?.error ?? 'Could not open billing portal.'); setLoading(false); }
    } catch {
      setError('Could not open billing portal.');
      setLoading(false);
    }
  }

  async function startCheckout() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else { setError(data?.error ?? 'Could not start checkout.'); setLoading(false); }
    } catch {
      setError('Could not start checkout.');
      setLoading(false);
    }
  }

  return (
    <main className="account-page">
      <div className="account-card">
        <a href="/" className="account-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to home
        </a>
        <p className="account-eyebrow">Account</p>
        <h1 className="account-title">Subscription</h1>
        <p className="account-email">{email}</p>

        {checkoutSuccess && (
          <div className="account-success-banner">
            Welcome aboard — your trial is now active. It may take a moment for the billing details to sync.
          </div>
        )}

        {error && <div className="form-error">{error}</div>}

        {isActive ? (
          <div className="account-section">
            <div className="account-status-row">
              <span className={`account-status-pill account-status-${status}`}>
                {statusLabel(status, subscription?.cancel_at_period_end ?? false)}
              </span>
              <span className="account-plan-line">Trakie Subscription · $499 / month</span>
            </div>

            <dl className="account-meta">
              {status === 'trialing' && subscription?.trial_end && (
                <>
                  <dt>Trial ends</dt>
                  <dd>{formatDate(subscription.trial_end)}</dd>
                </>
              )}
              {subscription?.current_period_end && (
                <>
                  <dt>{subscription.cancel_at_period_end ? 'Access until' : 'Renews on'}</dt>
                  <dd>{formatDate(subscription.current_period_end)}</dd>
                </>
              )}
            </dl>

            {subscription?.cancel_at_period_end && (
              <div className="account-notice">
                Your subscription will end on {formatDate(subscription.current_period_end)}. You can resume anytime from the billing portal.
              </div>
            )}

            <button className="form-submit" onClick={openPortal} disabled={loading}>
              {loading ? 'Opening…' : 'Manage Billing'}
            </button>
            <p className="account-fineprint">Cancel, change payment method, or download invoices in the Stripe billing portal.</p>
          </div>
        ) : (
          <div className="account-section">
            <h2 className="account-empty-heading">You don&apos;t have an active subscription</h2>
            <p className="account-empty-sub">
              Start your 30-day free trial to unlock the full Trakie platform.
            </p>
            <ul className="account-empty-list">
              <li>AI-powered invoice ingest — no manual data entry</li>
              <li>Automatic METRC reconciliation and audit trail</li>
              <li>One-tap Dutchie sync with smart pricing controls</li>
            </ul>
            <button className="form-submit" onClick={startCheckout} disabled={loading}>
              {loading ? 'Opening checkout…' : 'Start Free 30-Day Trial'}
            </button>
            <p className="account-fineprint">Cancel anytime during the trial — no charges until day 31.</p>
          </div>
        )}
      </div>
    </main>
  );
}
