'use client';

import { FormEvent } from 'react';

export default function ContactSection() {
  function handleContactSubmit(e: FormEvent) {
    e.preventDefault();
    alert("Thank you for your interest! We'll be in touch within 24 hours.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <section className="contact-section">
      <div className="contact-wrapper">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-subtitle">Ready to transform your dispensary operations?</p>
        <form id="contactForm" onSubmit={handleContactSubmit}>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input type="text" className="form-input" required placeholder="Your name" />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input type="email" className="form-input" required placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Dispensary Name</label>
            <input type="text" className="form-input" placeholder="Your dispensary" />
          </div>
          <div className="form-group">
            <label className="form-label">Message *</label>
            <textarea className="form-textarea" required placeholder="Tell us about your needs..."></textarea>
          </div>
          <button type="submit" className="form-submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}
