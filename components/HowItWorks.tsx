'use client';

/* ═══════════════════════════════════════════════════════
   HOW IT WORKS — 3 Steps with animated illustrations
   Scan → Read → Autofill
═══════════════════════════════════════════════════════ */

const STEPS = [
  {
    number: '01',
    title: 'Scan the invoice',
    description: 'Point your phone at any vendor invoice. Trakie captures every line item instantly.',
  },
  {
    number: '02',
    title: 'AI reads every field',
    description: 'Our model extracts vendor, product, METRC tags, quantities, and pricing — no templates needed.',
  },
  {
    number: '03',
    title: 'Dutchie fills itself',
    description: 'Fields populate in real-time. Review, confirm, done. What took 45 minutes now takes 60 seconds.',
  },
];

/* ── Step Illustrations ── */

function ScanIllustration() {
  return (
    <div className="hiw-illust hiw-illust-scan">
      {/* Phone frame */}
      <div className="hiw-phone">
        <div className="hiw-phone-notch" />
        <div className="hiw-phone-screen">
          {/* Camera viewfinder */}
          <div className="hiw-viewfinder">
            {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
              <div key={pos} className={`hiw-bracket ${pos}`} />
            ))}
            <div className="hiw-scan-beam" />
            {/* Mini invoice inside viewfinder */}
            <div className="hiw-mini-doc">
              <div className="hiw-mini-doc-bar" />
              <div className="hiw-mini-doc-line w80" />
              <div className="hiw-mini-doc-line w60" />
              <div className="hiw-mini-doc-line w90" />
              <div className="hiw-mini-doc-line w45" />
            </div>
          </div>
          <div className="hiw-scan-label-row">
            <span className="hiw-scan-dot" />
            <span className="hiw-scan-label-text">Scanning</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadIllustration() {
  return (
    <div className="hiw-illust hiw-illust-read">
      <div className="hiw-read-card">
        {/* Source document (left) */}
        <div className="hiw-read-source">
          <div className="hiw-read-source-header">
            <span className="hiw-read-source-label">Invoice</span>
          </div>
          <div className="hiw-read-source-lines">
            <div className="hiw-read-line">
              <span className="hiw-read-line-key">Vendor</span>
              <span className="hiw-read-line-val">Mary Jane Farms</span>
            </div>
            <div className="hiw-read-line">
              <span className="hiw-read-line-key">Product</span>
              <span className="hiw-read-line-val">Sour Diesel 3.5g</span>
            </div>
            <div className="hiw-read-line">
              <span className="hiw-read-line-key">METRC</span>
              <span className="hiw-read-line-val">1A406…31847</span>
            </div>
          </div>
        </div>
        {/* Connection arrows */}
        <div className="hiw-read-arrows">
          <div className="hiw-arrow-line a1" />
          <div className="hiw-arrow-line a2" />
          <div className="hiw-arrow-line a3" />
        </div>
        {/* Extracted (right) */}
        <div className="hiw-read-extracted">
          <div className="hiw-read-extracted-header">
            <span className="hiw-read-ai-badge">AI</span>
            <span className="hiw-read-extracted-label">Extracted</span>
          </div>
          <div className="hiw-read-extracted-fields">
            <div className="hiw-ex-field">
              <span className="hiw-ex-check">&#10003;</span>
              <span>Vendor matched</span>
            </div>
            <div className="hiw-ex-field">
              <span className="hiw-ex-check">&#10003;</span>
              <span>Product mapped</span>
            </div>
            <div className="hiw-ex-field">
              <span className="hiw-ex-check">&#10003;</span>
              <span>METRC verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AutofillIllustration() {
  return (
    <div className="hiw-illust hiw-illust-autofill">
      <div className="hiw-af-card">
        {/* Browser chrome */}
        <div className="hiw-af-bar">
          <div className="hiw-af-dots-row">
            <span className="hiw-af-dot r" />
            <span className="hiw-af-dot y" />
            <span className="hiw-af-dot g" />
          </div>
          <div className="hiw-af-url-pill">pos.dutchie.com</div>
        </div>
        {/* Form fields filling */}
        <div className="hiw-af-body">
          <div className="hiw-af-row filled">
            <span className="hiw-af-field-label">Vendor</span>
            <div className="hiw-af-field-input">
              <span>Mary Jane Farms LLC</span>
              <span className="hiw-af-check">&#10003;</span>
            </div>
          </div>
          <div className="hiw-af-row filled">
            <span className="hiw-af-field-label">Product</span>
            <div className="hiw-af-field-input">
              <span>Sour Diesel | 3.5g</span>
              <span className="hiw-af-check">&#10003;</span>
            </div>
          </div>
          <div className="hiw-af-row typing">
            <span className="hiw-af-field-label">Quantity</span>
            <div className="hiw-af-field-input typing">
              <span>48<span className="hiw-af-caret" /></span>
            </div>
          </div>
          <div className="hiw-af-row idle">
            <span className="hiw-af-field-label">Cost</span>
            <div className="hiw-af-field-input idle" />
          </div>
        </div>
        <div className="hiw-af-status">
          <span className="hiw-af-status-dot" />
          Autofilling 4 of 6 fields...
        </div>
      </div>
    </div>
  );
}

const ILLUSTRATIONS = [ScanIllustration, ReadIllustration, AutofillIllustration];

export default function HowItWorks() {
  return (
    <section className="hiw-section">
      {/* Section header */}
      <div className="hiw-header">
        <span className="hiw-eyebrow">How It Works</span>
        <h2 className="hiw-title">Three steps. Sixty seconds.</h2>
        <div className="hiw-rule" />
      </div>

      {/* Steps */}
      <div className="hiw-steps">
        {STEPS.map((step, idx) => {
          const Illust = ILLUSTRATIONS[idx];
          return (
            <div key={idx} className="hiw-step">
              <div className="hiw-step-visual">
                <Illust />
              </div>
              <div className="hiw-step-text">
                <span className="hiw-step-number">{step.number}</span>
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.description}</p>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="hiw-connector">
                  <svg viewBox="0 0 24 60" fill="none">
                    <path d="M12 0 L12 50 M6 44 L12 54 L18 44" stroke="rgba(201,169,97,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        /* ═══════════════════════════════════════════════════════
           HOW IT WORKS — Section
        ═══════════════════════════════════════════════════════ */
        .hiw-section {
          position: relative;
          padding: 100px 24px 80px;
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Header */
        .hiw-header {
          text-align: center;
          margin-bottom: 72px;
        }
        .hiw-eyebrow {
          font-family: var(--font-outfit), sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #C9A961;
          display: block;
          margin-bottom: 16px;
        }
        .hiw-title {
          font-family: var(--font-bodoni), 'Bodoni Moda', serif;
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 400;
          color: #FAFAF8;
          letter-spacing: -0.5px;
          line-height: 1.15;
        }
        .hiw-rule {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #C9A961, transparent);
          margin: 24px auto 0;
        }

        /* Steps container */
        .hiw-steps {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Individual step */
        .hiw-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .hiw-step-visual {
          width: 100%;
          max-width: 420px;
          aspect-ratio: 4 / 3;
          border-radius: 16px;
          overflow: hidden;
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03),
            0 20px 60px rgba(0,0,0,0.5),
            0 0 80px rgba(201,168,92,0.03);
          position: relative;
        }

        .hiw-step-text {
          text-align: center;
          padding: 28px 16px 0;
          max-width: 380px;
        }
        .hiw-step-number {
          font-family: var(--font-bodoni), 'Bodoni Moda', serif;
          font-size: 13px;
          letter-spacing: 2px;
          color: #C9A961;
          display: block;
          margin-bottom: 8px;
        }
        .hiw-step-title {
          font-family: var(--font-outfit), sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #FAFAF8;
          letter-spacing: -0.3px;
          margin-bottom: 8px;
        }
        .hiw-step-desc {
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255,255,255,0.82);
        }

        /* Connector arrows between steps */
        .hiw-connector {
          display: flex;
          justify-content: center;
          padding: 20px 0;
        }
        .hiw-connector svg {
          width: 24px;
          height: 48px;
        }

        /* ═══════════════════════════════════════════════════════
           ILLUSTRATION SHARED
        ═══════════════════════════════════════════════════════ */
        .hiw-illust {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        /* ═══════════════════════════════════════════════════════
           STEP 1 — SCAN ILLUSTRATION
        ═══════════════════════════════════════════════════════ */
        .hiw-phone {
          width: 140px;
          height: 100%;
          max-height: 240px;
          border-radius: 20px;
          background: #111;
          border: 2px solid rgba(255,255,255,0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 12px 40px rgba(0,0,0,0.6);
        }
        .hiw-phone-notch {
          width: 50px;
          height: 6px;
          border-radius: 3px;
          background: rgba(255,255,255,0.08);
          margin: 8px auto 6px;
          flex-shrink: 0;
        }
        .hiw-phone-screen {
          flex: 1;
          margin: 0 6px 6px;
          border-radius: 8px;
          background: #050505;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .hiw-viewfinder {
          flex: 1;
          position: relative;
          margin: 8px;
          border-radius: 6px;
          overflow: hidden;
          background: rgba(0,0,0,0.5);
        }
        .hiw-bracket {
          position: absolute;
          width: 16px;
          height: 16px;
          z-index: 3;
        }
        .hiw-bracket::before,
        .hiw-bracket::after {
          content: '';
          position: absolute;
          background: rgba(74,222,128,0.6);
        }
        .hiw-bracket::before {
          width: 2px;
          height: 100%;
        }
        .hiw-bracket::after {
          width: 100%;
          height: 2px;
        }
        .hiw-bracket.tl { top: 6px; left: 6px; }
        .hiw-bracket.tl::before { top: 0; left: 0; }
        .hiw-bracket.tl::after { top: 0; left: 0; }
        .hiw-bracket.tr { top: 6px; right: 6px; }
        .hiw-bracket.tr::before { top: 0; right: 0; }
        .hiw-bracket.tr::after { top: 0; right: 0; }
        .hiw-bracket.bl { bottom: 6px; left: 6px; }
        .hiw-bracket.bl::before { bottom: 0; left: 0; }
        .hiw-bracket.bl::after { bottom: 0; left: 0; }
        .hiw-bracket.br { bottom: 6px; right: 6px; }
        .hiw-bracket.br::before { bottom: 0; right: 0; }
        .hiw-bracket.br::after { bottom: 0; right: 0; }

        .hiw-scan-beam {
          position: absolute;
          left: 8px;
          right: 8px;
          height: 1.5px;
          z-index: 4;
          background: linear-gradient(90deg, transparent, rgba(74,222,128,0.7), transparent);
          box-shadow: 0 0 12px 2px rgba(74,222,128,0.12);
          animation: hiwBeamSweep 2.5s ease-in-out infinite;
        }
        @keyframes hiwBeamSweep {
          0% { top: 10px; }
          50% { top: calc(100% - 12px); }
          100% { top: 10px; }
        }

        .hiw-mini-doc {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70%;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .hiw-mini-doc-bar {
          height: 3px;
          border-radius: 1px;
          background: rgba(201,169,97,0.4);
          width: 50%;
          margin-bottom: 2px;
        }
        .hiw-mini-doc-line {
          height: 2px;
          border-radius: 1px;
          background: rgba(255,255,255,0.12);
        }
        .hiw-mini-doc-line.w80 { width: 80%; }
        .hiw-mini-doc-line.w60 { width: 60%; }
        .hiw-mini-doc-line.w90 { width: 90%; }
        .hiw-mini-doc-line.w45 { width: 45%; }

        .hiw-scan-label-row {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          flex-shrink: 0;
        }
        .hiw-scan-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4ade80;
          animation: hiwDotPulse 1.4s ease infinite;
        }
        @keyframes hiwDotPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .hiw-scan-label-text {
          font-family: var(--font-outfit), sans-serif;
          font-size: 9px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }

        /* ═══════════════════════════════════════════════════════
           STEP 2 — READ ILLUSTRATION
        ═══════════════════════════════════════════════════════ */
        .hiw-read-card {
          display: flex;
          align-items: stretch;
          gap: 12px;
          width: 100%;
          max-width: 360px;
          height: auto;
        }
        .hiw-read-source {
          flex: 1;
          background: rgba(245,242,234,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          overflow: hidden;
        }
        .hiw-read-source-header {
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .hiw-read-source-label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(201,169,97,0.7);
        }
        .hiw-read-source-lines {
          padding: 6px 0;
        }
        .hiw-read-line {
          display: flex;
          justify-content: space-between;
          padding: 5px 12px;
          gap: 6px;
          border-left: 2px solid transparent;
          animation: hiwLineHighlight 3s ease infinite;
        }
        .hiw-read-line:nth-child(1) { animation-delay: 0s; }
        .hiw-read-line:nth-child(2) { animation-delay: 1s; }
        .hiw-read-line:nth-child(3) { animation-delay: 2s; }
        @keyframes hiwLineHighlight {
          0%, 25% {
            border-left-color: rgba(74,222,128,0.6);
            background: rgba(74,222,128,0.06);
          }
          35%, 100% {
            border-left-color: transparent;
            background: transparent;
          }
        }
        .hiw-read-line-key {
          font-family: var(--font-outfit), sans-serif;
          font-size: 9px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .hiw-read-line-val {
          font-family: monospace;
          font-size: 9px;
          color: rgba(255,255,255,0.6);
          text-align: right;
        }

        /* Arrows */
        .hiw-read-arrows {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
          padding: 20px 0;
          flex-shrink: 0;
          width: 24px;
        }
        .hiw-arrow-line {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, rgba(74,222,128,0.15), rgba(74,222,128,0.5));
          position: relative;
          animation: hiwArrowPulse 2s ease infinite;
        }
        .hiw-arrow-line::after {
          content: '';
          position: absolute;
          right: -1px;
          top: -3px;
          width: 0;
          height: 0;
          border-left: 5px solid rgba(74,222,128,0.5);
          border-top: 3.5px solid transparent;
          border-bottom: 3.5px solid transparent;
        }
        .hiw-arrow-line.a1 { animation-delay: 0s; }
        .hiw-arrow-line.a2 { animation-delay: 0.3s; }
        .hiw-arrow-line.a3 { animation-delay: 0.6s; }
        @keyframes hiwArrowPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .hiw-read-extracted {
          flex: 1;
          background: rgba(74,222,128,0.03);
          border: 1px solid rgba(74,222,128,0.12);
          border-radius: 8px;
          overflow: hidden;
        }
        .hiw-read-extracted-header {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(74,222,128,0.08);
        }
        .hiw-read-ai-badge {
          font-family: var(--font-outfit), sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #0a0a0a;
          background: #4ade80;
          padding: 2px 6px;
          border-radius: 3px;
        }
        .hiw-read-extracted-label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(74,222,128,0.6);
        }
        .hiw-read-extracted-fields {
          padding: 6px 0;
        }
        .hiw-ex-field {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 10px;
          color: rgba(255,255,255,0.55);
        }
        .hiw-ex-check {
          color: #4ade80;
          font-size: 10px;
          flex-shrink: 0;
        }

        /* ═══════════════════════════════════════════════════════
           STEP 3 — AUTOFILL ILLUSTRATION
        ═══════════════════════════════════════════════════════ */
        .hiw-af-card {
          width: 100%;
          max-width: 340px;
          border-radius: 10px;
          overflow: hidden;
          background: #0d0d0d;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        }
        .hiw-af-bar {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          gap: 10px;
          background: #1a1a1a;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .hiw-af-dots-row {
          display: flex;
          gap: 4px;
        }
        .hiw-af-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .hiw-af-dot.r { background: #ff5f57; }
        .hiw-af-dot.y { background: #ffbd2e; }
        .hiw-af-dot.g { background: #28ca41; }
        .hiw-af-url-pill {
          flex: 1;
          font-family: var(--font-outfit), sans-serif;
          font-size: 9px;
          color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          padding: 3px 8px;
          letter-spacing: 0.3px;
        }

        .hiw-af-body {
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .hiw-af-row {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .hiw-af-field-label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 8px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
        }
        .hiw-af-field-input {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          border-radius: 5px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          font-family: var(--font-outfit), sans-serif;
          font-size: 10px;
          color: rgba(255,255,255,0.7);
          min-height: 26px;
          transition: all 0.3s ease;
        }
        .hiw-af-field-input.typing {
          border-color: rgba(74,222,128,0.45);
          background: rgba(74,222,128,0.04);
          box-shadow: 0 0 10px rgba(74,222,128,0.06);
        }
        .hiw-af-field-input.idle {
          color: transparent;
        }
        .hiw-af-row.filled .hiw-af-field-input {
          border-color: rgba(74,222,128,0.25);
          background: rgba(74,222,128,0.03);
        }
        .hiw-af-check {
          color: #4ade80;
          font-size: 10px;
          flex-shrink: 0;
        }
        .hiw-af-caret {
          display: inline-block;
          width: 1px;
          height: 12px;
          background: #4ade80;
          margin-left: 1px;
          vertical-align: middle;
          animation: hiwCaretBlink 0.6s step-end infinite;
        }
        @keyframes hiwCaretBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .hiw-af-status {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-top: 1px solid rgba(255,255,255,0.04);
          font-family: var(--font-outfit), sans-serif;
          font-size: 9px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.3px;
        }
        .hiw-af-status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4ade80;
          animation: hiwDotPulse 1.2s ease infinite;
        }

        /* ═══════════════════════════════════════════════════════
           DESKTOP — 3 columns
        ═══════════════════════════════════════════════════════ */
        @media (min-width: 900px) {
          .hiw-section {
            padding: 120px 40px 100px;
          }
          .hiw-steps {
            flex-direction: row;
            gap: 32px;
            align-items: flex-start;
          }
          .hiw-step {
            flex: 1;
          }
          .hiw-connector {
            display: none;
          }
          .hiw-step-visual {
            max-width: none;
            aspect-ratio: 3 / 2.8;
          }
          .hiw-step-text {
            padding: 24px 8px 0;
          }
        }

        /* ═══════════════════════════════════════════════════════
           TABLET
        ═══════════════════════════════════════════════════════ */
        @media (max-width: 899px) and (min-width: 600px) {
          .hiw-step-visual {
            max-width: 360px;
          }
        }

        /* ═══════════════════════════════════════════════════════
           SMALL MOBILE
        ═══════════════════════════════════════════════════════ */
        @media (max-width: 480px) {
          .hiw-section {
            padding: 72px 16px 56px;
          }
          .hiw-header {
            margin-bottom: 48px;
          }
          .hiw-step-visual {
            max-width: 320px;
          }
          .hiw-step-title {
            font-size: 18px;
          }
          .hiw-step-desc {
            font-size: 13px;
          }
          .hiw-phone {
            width: 120px;
          }
          .hiw-read-card {
            max-width: 300px;
          }
          .hiw-read-line-val {
            font-size: 8px;
          }
          .hiw-af-card {
            max-width: 280px;
          }
        }
      `}</style>
    </section>
  );
}
