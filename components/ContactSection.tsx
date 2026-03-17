'use client';

import { FormEvent, useState } from 'react';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bestTime, setBestTime] = useState('');
  const [dispensary, setDispensary] = useState('');
  const [deliveries, setDeliveries] = useState('');
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
        body: JSON.stringify({ name, email, phone, bestTime, dispensary, deliveries, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setBestTime('');
      setDispensary('');
      setDeliveries('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return (
    <section className="contact-section">
      <div className="contact-header">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-subtitle">Ready to transform your dispensary operations?</p>
      </div>

      {status === 'success' && (
        <div className="form-success">
          Thank you! We&apos;ll be in touch within 24 hours.
        </div>
      )}

      {status === 'error' && (
        <div className="form-error">{errorMsg}</div>
      )}

      <form id="contactForm" className="contact-form-full" onSubmit={handleContactSubmit}>
        <div className="contact-form-grid">
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
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              placeholder="(555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Best Time to Call</label>
            <select
              className="form-input form-select"
              value={bestTime}
              onChange={(e) => setBestTime(e.target.value)}
            >
              <option value="">Select a time</option>
              <option>Morning (9am – 12pm)</option>
              <option>Afternoon (12pm – 4pm)</option>
              <option>Evening (4pm – 7pm)</option>
              <option>Anytime</option>
            </select>
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
            <label className="form-label">Inventory deliveries per week?</label>
            <select
              className="form-input form-select"
              value={deliveries}
              onChange={(e) => setDeliveries(e.target.value)}
            >
              <option value="">Select a range</option>
              <option>1 – 3</option>
              <option>4 – 7</option>
              <option>8 – 15</option>
              <option>15+</option>
            </select>
          </div>
          <div className="form-group contact-full-col">
            <label className="form-label">Message *</label>
            <textarea
              className="form-textarea"
              required
              placeholder="Tell us about your needs..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="form-submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </section>
  );
}
