'use client';

import { useState, FormEvent, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import PasswordInput from './auth/PasswordInput';

type View = 'login' | 'signup' | 'otp' | 'success';

interface AuthModalProps {
  initialView: 'login' | 'signup';
  onClose: () => void;
}

export default function AuthModal({ initialView, onClose }: AuthModalProps) {
  const [view, setView] = useState<View>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Close on Escape
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  function switchView(v: 'login' | 'signup') {
    setView(v);
    setError('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    onClose();
  }

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setView('otp');
    setLoading(false);
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'signup' });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    await fetch('/api/auth/welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setView('success');
  }

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card" onClick={e => e.stopPropagation()}>

        <button className="auth-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="auth-modal-logo">
          <img src="/logo.png" alt="Trakie" />
        </div>

        <h1 className="auth-title">trakie.ai</h1>
        <p className="auth-subtitle">
          {view === 'login' && 'Sign in to your account'}
          {view === 'signup' && 'Create your account'}
          {view === 'otp' && 'Check your email'}
          {view === 'success' && 'Welcome to trakie.ai'}
        </p>

        {error && <div className="form-error">{error}</div>}

        {view === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" required placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <PasswordInput required placeholder="Your password"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        )}

        {view === 'signup' && (
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" required placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <PasswordInput required minLength={6}
                placeholder="Min 6 characters" value={password}
                onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <PasswordInput required minLength={6}
                placeholder="Re-enter your password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Sign Up'}
            </button>
          </form>
        )}

        {view === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <p className="auth-otp-hint">
              We sent a verification code to <strong>{email}</strong>. Enter it below.
            </p>
            <div className="form-group">
              <label className="form-label">Verification Code</label>
              <input type="text" className="form-input" required maxLength={8}
                placeholder="00000000" value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.4rem' }} />
            </div>
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify Code'}
            </button>
            <button type="button" className="auth-back-btn"
              onClick={() => { setView('signup'); setOtp(''); setError(''); }}>
              ← Back
            </button>
          </form>
        )}

        {view === 'success' && (
          <div className="auth-success">
            <div className="auth-success-check" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="auth-success-message">Account created successfully</p>
            <button type="button" className="form-submit" onClick={onClose}>
              Continue
            </button>
          </div>
        )}

        {(view === 'login' || view === 'signup') && (
          <div className="auth-footer">
            {view === 'login' ? (
              <>Don&apos;t have an account?{' '}
                <button className="auth-link-btn" onClick={() => switchView('signup')}>Sign up</button></>
            ) : (
              <>Already have an account?{' '}
                <button className="auth-link-btn" onClick={() => switchView('login')}>Sign in</button></>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
