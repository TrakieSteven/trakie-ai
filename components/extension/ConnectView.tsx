'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type IssueResult =
  | { ok: true; code: string; expires_at: string }
  | { ok: false; reason: string };

interface Props {
  email: string;
  hasActiveSubscription: boolean;
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return 'Expired';
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ConnectView({ email, hasActiveSubscription }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const remainingMs = expiresAt ? new Date(expiresAt).getTime() - now : 0;
  const expired = !!expiresAt && remainingMs <= 0;

  async function issueCode() {
    setError(null);
    setCopied(false);
    setLoading(true);
    try {
      const res = await fetch('/api/extension/issue-code', { method: 'POST' });
      const data = (await res.json()) as IssueResult;
      if (data.ok) {
        setCode(data.code);
        setExpiresAt(data.expires_at);
      } else {
        setError(data.reason === 'no_subscription'
          ? 'Your subscription is not active.'
          : 'Could not generate a pairing code. Please try again.');
      }
    } catch {
      setError('Could not generate a pairing code. Please try again.');
    } finally {
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

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard may be blocked; user can still copy manually
    }
  }

  return (
    <main className="account-page">
      <div className="account-card">
        <Link href="/" className="account-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Trakie.ai
        </Link>
        <p className="account-eyebrow">Chrome Extension</p>
        <h1 className="account-title">Connect your extension</h1>
        <p className="account-email">{email}</p>

        {error && <div className="form-error" role="alert" aria-live="polite">{error}</div>}

        {hasActiveSubscription ? (
          <div className="account-section">
            {!code || expired ? (
              <>
                <p className="account-empty-sub">
                  Generate a one-time pairing code, then paste it into the Trakie extension to sign in on this browser.
                </p>
                <button className="form-submit" onClick={issueCode} disabled={loading}>
                  {loading ? 'Generating…' : (expired ? 'Generate a new code' : 'Generate pairing code')}
                </button>
                <p className="account-fineprint">Codes expire in 10 minutes and can only be used once.</p>
              </>
            ) : (
              <>
                <p className="account-empty-sub">
                  Paste this code into the Trakie extension popup. It expires in 10 minutes and can only be used once.
                </p>
                <div className="extension-code-block">
                  <div
                    className="extension-code-value"
                    aria-label="Pairing code"
                    role="status"
                    aria-live="polite"
                  >{code}</div>
                  <button
                    className="extension-code-copy"
                    onClick={copyCode}
                    type="button"
                    aria-label="Copy pairing code"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="extension-code-meta">
                  <span>Expires in {formatRemaining(remainingMs)}</span>
                  <button
                    className="extension-code-refresh"
                    onClick={issueCode}
                    disabled={loading}
                    type="button"
                    aria-label="Generate a new pairing code"
                  >
                    {loading ? 'Generating…' : 'Generate a new code'}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="account-section">
            <h2 className="account-empty-heading">Trakie subscription required</h2>
            <p className="account-empty-sub">
              The Trakie Chrome extension requires an active subscription. Start your 30-day free trial to unlock it.
            </p>
            <ul className="account-empty-list">
              <li>AI-powered invoice ingest — no manual data entry</li>
              <li>Automatic METRC reconciliation and audit trail</li>
              <li>One-tap Dutchie sync with smart pricing controls</li>
            </ul>
            <button className="form-submit" onClick={startCheckout} disabled={loading}>
              {loading ? 'Opening checkout…' : 'Start Free 30-Day Trial'}
            </button>
            <p className="account-fineprint">
              Already subscribed?{' '}
              <Link href="/account/subscription" style={{ color: 'inherit', textDecoration: 'underline' }}>
                Manage your subscription
              </Link>.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
