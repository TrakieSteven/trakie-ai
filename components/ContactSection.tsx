'use client';

import { FormEvent, useState } from 'react';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dispensary, setDispensary] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleContactSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, dispensary, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setDispensary('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return (
    <section className="contact-section">
      <div className="contact-wrapper">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-subtitle">Ready to transform your dispensary operations?</p>

        {status === 'success' && (
          <div className="form-success">
            Thank you! We&apos;ll be in touch within 24 hours.
          </div>
        )}

        {status === 'error' && (
          <div className="form-error">{errorMsg}</div>
        )}

        <form id="contactForm" onSubmit={handleContactSubmit}>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-input"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Dispensary Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Your dispensary"
              value={dispensary}
              onChange={(e) => setDispensary(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Message *</label>
            <textarea
              className="form-textarea"
              required
              placeholder="Tell us about your needs..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button type="submit" className="form-submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
}
