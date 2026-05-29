'use client';

import { FormEvent, useState } from 'react';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [dispensary, setDispensary] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dispensary, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus('success');
      setName('');
      setDispensary('');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return (
    <section className="contact-section">
      <div className="contact-header">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-subtitle">Contact us for pricing and to book a meeting or demo.</p>
      </div>

      {status === 'success' ? (
        <div className="contact-success">
          <span className="contact-success-icon">&#10003;</span>
          <p className="contact-success-text">We&apos;ll be in touch.</p>
        </div>
      ) : (
        <>
          {status === 'error' && (
            <div className="form-error" role="alert" aria-live="polite">{errorMsg}</div>
          )}

          <form className="contact-form-minimal" onSubmit={handleSubmit} noValidate>
            <label htmlFor="contact-name" className="sr-only">Your name</label>
            <input
              id="contact-name"
              type="text"
              className="contact-input"
              required
              aria-required="true"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="contact-dispensary" className="sr-only">Dispensary name</label>
            <input
              id="contact-dispensary"
              type="text"
              className="contact-input"
              required
              aria-required="true"
              autoComplete="organization"
              placeholder="Dispensary name"
              value={dispensary}
              onChange={(e) => setDispensary(e.target.value)}
            />
            <label htmlFor="contact-email" className="sr-only">Email address</label>
            <input
              id="contact-email"
              type="email"
              className="contact-input"
              required
              aria-required="true"
              autoComplete="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="contact-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </>
      )}

      <style>{`
        /* Let the rotating glow render but not block input */
        .contact-section::before {
          pointer-events: none;
        }
        /* Override globals.css — center everything on page */
        .contact-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
        }
        .contact-header {
          margin-bottom: 32px;
        }
        .contact-title {
          font-size: clamp(32px, 5vw, 48px);
        }
        .contact-subtitle {
          font-size: 18px;
          text-transform: none;
          letter-spacing: 0.3px;
        }

        .contact-form-minimal {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 460px;
          width: 100%;
          margin: 0 auto;
          padding: 0 24px;
        }
        .contact-input {
          width: 100%;
          padding: 18px 22px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: #FAFAF8;
          font-family: var(--font-outfit), sans-serif;
          font-size: 18px;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .contact-input::placeholder {
          color: rgba(255,255,255,0.45);
        }
        .contact-input:focus {
          border-color: rgba(201,169,97,0.4);
        }
        .contact-submit {
          padding: 18px 28px;
          border-radius: 8px;
          border: 1px solid rgba(201,169,97,0.3);
          background: rgba(201,169,97,0.1);
          color: #C9A961;
          font-family: var(--font-outfit), sans-serif;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .contact-submit:hover {
          background: rgba(201,169,97,0.18);
          border-color: rgba(201,169,97,0.5);
        }
        .contact-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .contact-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 0 24px;
          animation: contactFadeIn 0.5s ease forwards;
        }
        .contact-success-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(74,222,128,0.1);
          border: 1px solid rgba(74,222,128,0.25);
          color: #4ade80;
          font-size: 18px;
        }
        .contact-success-text {
          font-family: var(--font-outfit), sans-serif;
          font-size: 18px;
          color: rgba(255,255,255,0.82);
        }
        @keyframes contactFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .contact-form-minimal {
            padding: 0 16px;
          }
          .contact-submit {
            padding: 14px;
          }
        }
      `}</style>
    </section>
  );
}
