'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import PasswordInput from './PasswordInput';

export default function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setStep('otp');
    setLoading(false);
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'signup',
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Send welcome email
    await fetch('/api/auth/welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    setStep('success');
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">trakie</h1>
        <p className="auth-subtitle">
          {step === 'form' && 'Create your account'}
          {step === 'otp' && 'Check your email'}
          {step === 'success' && 'Welcome to trakie.ai'}
        </p>

        {error && <div className="form-error" role="alert" aria-live="polite">{error}</div>}

        {step === 'success' ? (
          <div className="auth-success">
            <div className="auth-success-check" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="auth-success-message">Account created successfully</p>
            <button type="button" className="form-submit" onClick={() => router.push('/')}>
              Continue
            </button>
          </div>
        ) : step === 'form' ? (
          <form onSubmit={handleSignup} noValidate>
            <div className="form-group">
              <label htmlFor="signup-email" className="form-label">Email</label>
              <input
                id="signup-email"
                type="email"
                className="form-input"
                required
                aria-required="true"
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-password" className="form-label">Password</label>
              <PasswordInput
                id="signup-password"
                required
                aria-required="true"
                autoComplete="new-password"
                minLength={6}
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-confirm" className="form-label">Confirm Password</label>
              <PasswordInput
                id="signup-confirm"
                required
                aria-required="true"
                autoComplete="new-password"
                minLength={6}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} noValidate>
            <p style={{ color: '#D4D4D4', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              We sent a 6-digit verification code to <strong style={{ color: '#C9A85C' }}>{email}</strong>.
              Enter it below to confirm your account.
            </p>
            <div className="form-group">
              <label htmlFor="signup-otp" className="form-label">Verification Code</label>
              <input
                id="signup-otp"
                type="text"
                inputMode="numeric"
                className="form-input"
                required
                aria-required="true"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.4rem' }}
              />
            </div>
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('form'); setOtp(''); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#C9A85C', cursor: 'pointer', width: '100%', marginTop: '0.75rem', fontSize: '0.85rem' }}
            >
              ← Back
            </button>
          </form>
        )}

        {step !== 'success' && (
          <div className="auth-footer">
            Already have an account?{' '}
            <a href="/login" className="auth-link">Sign in</a>
          </div>
        )}
      </div>
    </div>
  );
}
