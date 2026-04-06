'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/* ═══════════════════════════════════════════════════════
   HERO DEMO — Looping 3-phase animation
   scan → read → autofill → loop (~12s cycle)
═══════════════════════════════════════════════════════ */

type Phase = 'scan' | 'read' | 'autofill';

const PHASE_DURATIONS: Partial<Record<Phase, number>> = {
  scan: 3000,
  read: 3000,
  // autofill is callback-driven
};

/* ── DATA ── */
const SCAN_ROWS = [
  { label: 'Vendor', value: 'Mary Jane Farms LLC' },
  { label: 'Product', value: 'Sour Diesel · Hybrid · 3.5g' },
  { label: 'METRC Package', value: '1A406030000…31847' },
  { label: 'Total', value: '48 × $12.00 = $576.00' },
];

const READ_ROWS = [
  { label: 'Vendor', value: 'Mary Jane Farms LLC', field: 'Vendor / Supplier', extracted: 'Mary Jane Farms LLC' },
  { label: 'Product', value: 'Sour Diesel · Hybrid · 3.5g', field: 'Product Name', extracted: 'Sour Diesel | Hybrid | 3.5g' },
  { label: 'METRC Package', value: '1A406030000…31847', field: 'Package ID (METRC)', extracted: '1A4060300002F04000031847' },
  { label: 'Total', value: '48 × $12.00 = $576.00', field: 'Total Package Cost', extracted: '$576.00' },
];

const AUTOFILL_FIELDS = [
  { label: 'Vendor / Supplier', value: 'Mary Jane Farms LLC', type: 'text' as const },
  { label: 'Receiving Room', value: 'Vault', type: 'dropdown' as const },
  { label: 'Product Name', value: 'Sour Diesel | Hybrid | 3.5g', type: 'text' as const },
  { label: 'Package ID (METRC)', value: '1A4060300002F04000031847', type: 'text' as const },
  { label: 'Quantity Received', value: '48', type: 'text' as const },
  { label: 'Total Package Cost', value: '$576.00', type: 'text' as const },
];

/* ═══════════════════════════════════════════════════════
   MINI PHASE: SCAN
═══════════════════════════════════════════════════════ */
function HeroScanMini() {
  const [revealedLines, setRevealedLines] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    SCAN_ROWS.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealedLines(i + 1), 400 + i * 350));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="hero-scan">
      <div className="hero-scan-label">Scanning Invoice</div>
      <div className="hero-scan-viewfinder">
        <div className="hero-scan-glow" />
        {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
          <div key={pos} className={`hero-scan-bracket ${pos}`}>
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M2 48 L2 4 C2 2.9 2.9 2 4 2 L48 2" stroke="rgba(74,222,128,0.75)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        ))}
        <div className="hero-scan-beam" />
        <div className="hero-scan-doc">
          <div className="hero-scan-doc-header">
            <span className="hero-scan-doc-title">Invoice</span>
            <span className="hero-scan-doc-id">#INV-0326-847</span>
          </div>
          <div className="hero-scan-rows">
            {SCAN_ROWS.map((line, i) => (
              <div key={i} className={`hero-scan-row${i < revealedLines ? ' revealed' : ''}${i === revealedLines - 1 ? ' active' : ''}`}>
                <span className="hero-scan-row-dot" />
                <span className="hero-scan-row-label">{line.label}</span>
                <span className="hero-scan-row-value">{line.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MINI PHASE: READ
═══════════════════════════════════════════════════════ */
function HeroReadMini() {
  const [active, setActive] = useState(-1);
  const [filled, setFilled] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    READ_ROWS.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setActive(i);
        setFilled(prev => new Set([...prev, i]));
      }, 300 + i * 380));
    });
    timers.push(setTimeout(() => setDone(true), 300 + READ_ROWS.length * 380 + 200));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="hero-read">
      <div className="hero-read-split">
        {/* Left: Invoice */}
        <div className="hero-read-invoice">
          <div className="hero-read-invoice-header">
            <span className="hero-read-invoice-title">Invoice</span>
            <span className="hero-read-invoice-id">#INV-0326</span>
          </div>
          {READ_ROWS.map((row, i) => (
            <div key={i} className={`hero-read-inv-row${active === i ? ' active' : ''}${filled.has(i) ? ' filled' : ''}`}>
              <span className="hero-read-inv-label">{row.label}</span>
              <span className="hero-read-inv-value">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Right: Extracted Fields */}
        <div className="hero-read-fields">
          <div className="hero-read-status">
            <span className={`hero-read-status-dot${done ? ' done' : ''}`} />
            <span className="hero-read-status-text">
              {done ? `${READ_ROWS.length} fields extracted` : 'Reading invoice…'}
            </span>
          </div>
          {READ_ROWS.map((row, i) => (
            <div key={i} className={`hero-read-field${filled.has(i) ? ' filled' : ''}${active === i ? ' popping' : ''}`}>
              <div className="hero-read-field-label">{row.field}</div>
              <div className="hero-read-field-value">
                {filled.has(i) && <span className="hero-read-check">&#10003;</span>}
                <span>{row.extracted}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MINI PHASE: AUTOFILL
═══════════════════════════════════════════════════════ */
function HeroAutofillMini({ onComplete }: { onComplete: () => void }) {
  type FieldState = 'idle' | 'typing' | 'complete';
  const [fieldStates, setFieldStates] = useState<FieldState[]>(() => AUTOFILL_FIELDS.map(() => 'idle'));
  const [displayTexts, setDisplayTexts] = useState<string[]>(() => AUTOFILL_FIELDS.map(() => ''));
  const [allDone, setAllDone] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const cleanup = () => {
      timersRef.current.forEach(clearTimeout);
      intervalsRef.current.forEach(clearInterval);
      timersRef.current = [];
      intervalsRef.current = [];
    };
    cleanup();

    let delay = 400;
    const CHAR_INTERVAL = 35;
    const FIELD_GAP = 250;

    AUTOFILL_FIELDS.forEach((field, idx) => {
      const startDelay = delay;

      if (field.type === 'dropdown') {
        timersRef.current.push(setTimeout(() => {
          setFieldStates(prev => { const n = [...prev]; n[idx] = 'typing'; return n; });
          setDisplayTexts(prev => { const n = [...prev]; n[idx] = field.value; return n; });
          timersRef.current.push(setTimeout(() => {
            setFieldStates(prev => { const n = [...prev]; n[idx] = 'complete'; return n; });
          }, 150));
        }, startDelay));
        delay += FIELD_GAP;
      } else {
        const typingDuration = field.value.length * CHAR_INTERVAL;
        timersRef.current.push(setTimeout(() => {
          setFieldStates(prev => { const n = [...prev]; n[idx] = 'typing'; return n; });
          let charIdx = 0;
          const interval = setInterval(() => {
            charIdx++;
            setDisplayTexts(prev => {
              const n = [...prev];
              n[idx] = field.value.slice(0, charIdx);
              return n;
            });
            if (charIdx >= field.value.length) {
              clearInterval(interval);
              timersRef.current.push(setTimeout(() => {
                setFieldStates(prev => { const n = [...prev]; n[idx] = 'complete'; return n; });
              }, 80));
            }
          }, CHAR_INTERVAL);
          intervalsRef.current.push(interval);
        }, startDelay));
        delay += Math.max(typingDuration, FIELD_GAP);
      }
    });

    timersRef.current.push(setTimeout(() => {
      setAllDone(true);
      timersRef.current.push(setTimeout(() => {
        onCompleteRef.current();
      }, 1000));
    }, delay + 300));

    return cleanup;
  }, []);

  return (
    <div className="hero-autofill">
      {/* macOS chrome */}
      <div className="hero-af-chrome">
        <div className="hero-af-dots">
          <span style={{ background: '#ff5f57' }} />
          <span style={{ background: '#ffbd2e' }} />
          <span style={{ background: '#28ca41' }} />
        </div>
        <div className="hero-af-url">
          <span className="hero-af-lock">&#128274;</span>
          pos.dutchie.com / receive-transfer
        </div>
      </div>

      {/* Dutchie app area */}
      <div className="hero-af-app">
        <div className="hero-af-nav">
          <img src="/dutchie-logo.jpeg" alt="Dutchie" className="hero-af-nav-logo" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span className="hero-af-nav-brand">Dutchie POS</span>
          <span className="hero-af-nav-sep">&rsaquo;</span>
          <span className="hero-af-nav-crumb">Receive Transfer</span>
          <div className="hero-af-nav-live">
            <span className="hero-af-live-dot" />
            TRAKIE AI AUTOFILLING
          </div>
        </div>

        <div className="hero-af-fields">
          {AUTOFILL_FIELDS.map((field, idx) => {
            const state = fieldStates[idx];
            const text = displayTexts[idx];
            const isTyping = state === 'typing';
            const isDone = state === 'complete';

            return (
              <div key={idx} className={`hero-af-field${isDone ? ' done' : ''}${isTyping ? ' typing' : ''}`}>
                <label className="hero-af-label">
                  {field.label}
                  {field.type === 'dropdown' && <span className="hero-af-dd-icon">&#9662;</span>}
                </label>
                <div className={`hero-af-input${isTyping ? ' typing' : ''}${isDone ? ' done' : ''}`}>
                  <span className="hero-af-value">
                    {text}
                    {isTyping && <span className="hero-af-cursor">|</span>}
                  </span>
                  {isDone && <span className="hero-af-badge">&#10003;</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="hero-af-footer">
          {allDone ? '6 fields filled · Ready for review' : 'Autofilling fields…'}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ORCHESTRATOR
═══════════════════════════════════════════════════════ */
export default function HeroDemo() {
  const [phase, setPhase] = useState<Phase>('scan');
  const [loopKey, setLoopKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advanceTo = useCallback((next: Phase) => {
    setPhase(next);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const duration = PHASE_DURATIONS[phase];
    if (!duration) return; // autofill is callback-driven

    const phases: Phase[] = ['scan', 'read', 'autofill'];
    const currentIdx = phases.indexOf(phase);
    const nextPhase = phases[currentIdx + 1];

    timerRef.current = setTimeout(() => {
      advanceTo(nextPhase);
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, advanceTo]);

  const handleAutofillComplete = useCallback(() => {
    // 1s hold, then loop
    setTimeout(() => {
      setLoopKey(k => k + 1);
      setPhase('scan');
    }, 1000);
  }, []);

  return (
    <div className="hero-demo-wrapper">
      <div className="hero-demo-device">
        {/* Device frame chrome */}
        <div className="hero-demo-chrome">
          <div className="hero-demo-dots">
            <span style={{ background: '#ff5f57' }} />
            <span style={{ background: '#ffbd2e' }} />
            <span style={{ background: '#28ca41' }} />
          </div>
          <div className="hero-demo-url-bar">
            <span className="hero-demo-lock">&#128274;</span>
            trakie.ai
          </div>
        </div>

        {/* Phase viewport */}
        <div className="hero-demo-viewport">
          <div className={`hero-demo-phase${phase === 'scan' ? ' active' : ''}`}>
            {phase === 'scan' && <HeroScanMini key={`scan-${loopKey}`} />}
          </div>
          <div className={`hero-demo-phase${phase === 'read' ? ' active' : ''}`}>
            {phase === 'read' && <HeroReadMini key={`read-${loopKey}`} />}
          </div>
          <div className={`hero-demo-phase${phase === 'autofill' ? ' active' : ''}`}>
            {phase === 'autofill' && <HeroAutofillMini key={`autofill-${loopKey}`} onComplete={handleAutofillComplete} />}
          </div>
        </div>

        {/* Phase indicator dots */}
        <div className="hero-demo-indicators">
          {(['scan', 'read', 'autofill'] as Phase[]).map((p) => (
            <div key={p} className={`hero-demo-indicator${phase === p ? ' active' : ''}`}>
              <span className="hero-demo-indicator-label">
                {p === 'scan' ? 'Scan' : p === 'read' ? 'Read' : 'Autofill'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* ═══════════════════════════════════════════════════════
           HERO DEMO — Device Frame
        ═══════════════════════════════════════════════════════ */
        .hero-demo-wrapper {
          width: 100%;
          max-width: 900px;
          margin: 36px auto 0;
          padding: 0 20px;
          opacity: 0;
          transform: translateY(30px);
          animation: heroDemoEnter 1s ease 1s forwards;
        }
        @keyframes heroDemoEnter {
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-demo-device {
          border-radius: 16px;
          overflow: hidden;
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04),
            0 25px 80px rgba(0,0,0,0.7),
            0 0 120px rgba(201,168,92,0.04);
        }

        .hero-demo-chrome {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: #1a1a1a;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          gap: 12px;
        }
        .hero-demo-dots {
          display: flex;
          gap: 6px;
        }
        .hero-demo-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .hero-demo-url-bar {
          flex: 1;
          background: rgba(255,255,255,0.06);
          border-radius: 6px;
          padding: 5px 12px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.3px;
        }
        .hero-demo-lock {
          font-size: 10px;
          margin-right: 6px;
        }

        .hero-demo-viewport {
          position: relative;
          height: 360px;
          overflow: hidden;
          background: #070709;
        }

        .hero-demo-phase {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }
        .hero-demo-phase.active {
          opacity: 1;
          pointer-events: auto;
        }

        /* Phase indicators */
        .hero-demo-indicators {
          display: flex;
          justify-content: center;
          gap: 24px;
          padding: 14px 16px;
          background: #111;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .hero-demo-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.35;
          transition: opacity 0.4s ease;
        }
        .hero-demo-indicator.active {
          opacity: 1;
        }
        .hero-demo-indicator::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          transition: all 0.4s ease;
        }
        .hero-demo-indicator.active::before {
          background: #4ade80;
          box-shadow: 0 0 8px rgba(74,222,128,0.5);
        }
        .hero-demo-indicator-label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }

        /* ═══════════════════════════════════════════════════════
           SCAN MINI
        ═══════════════════════════════════════════════════════ */
        .hero-scan {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 20px;
        }
        .hero-scan-label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(74,222,128,0.7);
          margin-bottom: 12px;
        }
        .hero-scan-viewfinder {
          position: relative;
          width: 100%;
          max-width: 680px;
          flex: 1;
          border-radius: 14px;
          overflow: hidden;
          background: rgba(0,0,0,0.55);
          box-shadow: 0 0 0 1px rgba(74,222,128,0.12);
        }
        .hero-scan-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(74,222,128,0.05) 0%, transparent 65%);
          animation: heroScanGlow 3s ease-in-out infinite;
        }
        @keyframes heroScanGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .hero-scan-bracket {
          position: absolute;
          z-index: 5;
          pointer-events: none;
        }
        .hero-scan-bracket svg {
          width: 32px;
          height: 32px;
        }
        .hero-scan-bracket.tl { top: 12px; left: 12px; }
        .hero-scan-bracket.tr { top: 12px; right: 12px; transform: scaleX(-1); }
        .hero-scan-bracket.bl { bottom: 12px; left: 12px; transform: scaleY(-1); }
        .hero-scan-bracket.br { bottom: 12px; right: 12px; transform: scale(-1); }

        .hero-scan-beam {
          position: absolute;
          left: 12px;
          right: 12px;
          height: 2px;
          z-index: 6;
          pointer-events: none;
          background: linear-gradient(90deg, transparent 0%, rgba(74,222,128,0.3) 10%, rgba(74,222,128,0.8) 50%, rgba(74,222,128,0.3) 90%, transparent 100%);
          box-shadow: 0 0 20px 4px rgba(74,222,128,0.15);
          animation: heroBeam 2.5s ease-in-out infinite;
        }
        @keyframes heroBeam {
          0% { top: 12px; }
          50% { top: calc(100% - 14px); }
          100% { top: 12px; }
        }

        .hero-scan-doc {
          position: absolute;
          top: 32px;
          left: 32px;
          right: 32px;
          bottom: 32px;
          z-index: 2;
          border-radius: 10px;
          background: #F5F2EA;
          border: 1px solid rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .hero-scan-doc-header {
          padding: 12px 18px 10px;
          background: #1C1C1C;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }
        .hero-scan-doc-title {
          font-family: var(--font-outfit), sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #C9A85C;
        }
        .hero-scan-doc-id {
          font-family: monospace;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }

        .hero-scan-rows {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 4px 0;
          justify-content: center;
        }
        .hero-scan-row {
          display: flex;
          align-items: center;
          padding: 10px 18px;
          gap: 10px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          opacity: 0;
          transform: translateY(6px);
          transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
          border-left: 3px solid transparent;
        }
        .hero-scan-row.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-scan-row.active {
          background: rgba(74,222,128,0.12);
          border-left-color: rgba(74,222,128,0.8);
        }
        .hero-scan-row-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
          background: #ccc;
          transition: all 0.3s ease;
        }
        .hero-scan-row.revealed .hero-scan-row-dot {
          background: #4ade80;
          box-shadow: 0 0 6px rgba(74,222,128,0.5);
        }
        .hero-scan-row-label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 11px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          flex-shrink: 0;
          min-width: 100px;
        }
        .hero-scan-row.revealed .hero-scan-row-label {
          color: #666;
        }
        .hero-scan-row-value {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 12px;
          color: #ccc;
          text-align: right;
          flex: 1;
          transition: color 0.3s ease;
        }
        .hero-scan-row.revealed .hero-scan-row-value {
          color: #1a1a1a;
        }

        /* ═══════════════════════════════════════════════════════
           READ MINI
        ═══════════════════════════════════════════════════════ */
        .hero-read {
          height: 100%;
          padding: 16px 20px;
        }
        .hero-read-split {
          display: flex;
          gap: 16px;
          height: 100%;
          max-width: 780px;
          margin: 0 auto;
        }

        /* Left invoice */
        .hero-read-invoice {
          flex: 0 0 46%;
          background: #F5F2EA;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 6px 30px rgba(0,0,0,0.5);
        }
        .hero-read-invoice-header {
          background: #1C1C1C;
          padding: 10px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .hero-read-invoice-title {
          font-family: var(--font-outfit), sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #C9A85C;
          text-transform: uppercase;
        }
        .hero-read-invoice-id {
          font-family: monospace;
          font-size: 10px;
          color: rgba(255,255,255,0.35);
        }
        .hero-read-inv-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 9px 16px;
          gap: 8px;
          border-left: 3px solid transparent;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .hero-read-inv-row.active {
          border-left-color: rgba(74,222,128,0.9);
          background: rgba(74,222,128,0.15);
        }
        .hero-read-inv-row.filled {
          border-left-color: rgba(74,222,128,0.3);
          background: rgba(74,222,128,0.05);
        }
        .hero-read-inv-label {
          font-family: sans-serif;
          font-size: 11px;
          color: #777;
          flex-shrink: 0;
          min-width: 70px;
        }
        .hero-read-inv-value {
          font-family: monospace;
          font-size: 10px;
          color: #999;
          text-align: right;
          word-break: break-all;
          transition: color 0.3s ease;
        }
        .hero-read-inv-row.filled .hero-read-inv-value {
          color: #1a1a1a;
          font-weight: 600;
        }

        /* Right fields */
        .hero-read-fields {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .hero-read-status {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 12px;
          margin-bottom: 4px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
        }
        .hero-read-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
          background: #C9A85C;
          animation: heroReadPulse 1s ease infinite;
          display: inline-block;
        }
        .hero-read-status-dot.done {
          background: #4ade80;
          animation: none;
        }
        @keyframes heroReadPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .hero-read-status-text {
          font-family: var(--font-outfit), sans-serif;
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.4px;
        }

        .hero-read-field {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          opacity: 0.35;
          transition: all 0.3s ease;
        }
        .hero-read-field.filled {
          border-color: rgba(74,222,128,0.4);
          background: rgba(74,222,128,0.06);
          opacity: 1;
        }
        .hero-read-field.popping {
          animation: heroFieldPop 0.35s ease both;
        }
        @keyframes heroFieldPop {
          from { transform: scale(0.96) translateX(5px); opacity: 0; }
          to { transform: scale(1) translateX(0); opacity: 1; }
        }
        .hero-read-field-label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 9px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .hero-read-field-value {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.3s ease;
        }
        .hero-read-field.filled .hero-read-field-value {
          color: rgba(255,255,255,0.85);
        }
        .hero-read-check {
          color: #4ade80;
          font-size: 10px;
          flex-shrink: 0;
        }

        /* ═══════════════════════════════════════════════════════
           AUTOFILL MINI
        ═══════════════════════════════════════════════════════ */
        .hero-autofill {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .hero-af-chrome {
          display: flex;
          align-items: center;
          padding: 8px 14px;
          background: #1a1a1a;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          gap: 10px;
        }
        .hero-af-dots {
          display: flex;
          gap: 5px;
        }
        .hero-af-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .hero-af-url {
          flex: 1;
          background: rgba(255,255,255,0.06);
          border-radius: 5px;
          padding: 4px 10px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.3px;
        }
        .hero-af-lock {
          font-size: 9px;
          margin-right: 5px;
        }

        .hero-af-app {
          flex: 1;
          background: #0d0d0d;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .hero-af-nav {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }
        .hero-af-nav-logo {
          height: 18px;
          width: auto;
          border-radius: 3px;
          object-fit: contain;
        }
        .hero-af-nav-brand {
          font-family: var(--font-outfit), sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
        }
        .hero-af-nav-sep {
          color: rgba(255,255,255,0.15);
          font-size: 14px;
        }
        .hero-af-nav-crumb {
          font-family: var(--font-outfit), sans-serif;
          font-size: 11px;
          color: rgba(255,255,255,0.35);
        }
        .hero-af-nav-live {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.2px;
          color: #4ade80;
          background: rgba(74,222,128,0.1);
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid rgba(74,222,128,0.2);
        }
        .hero-af-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          animation: heroAfPulse 1.2s ease infinite;
        }
        @keyframes heroAfPulse {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
          50% { opacity: 1; box-shadow: 0 0 0 4px rgba(74,222,128,0); }
        }

        .hero-af-fields {
          flex: 1;
          padding: 12px 16px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          align-content: start;
          overflow: hidden;
        }
        .hero-af-field {
          min-width: 0;
        }
        .hero-af-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 9px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .hero-af-dd-icon {
          font-size: 8px;
          color: rgba(255,255,255,0.2);
        }
        .hero-af-input {
          padding: 7px 10px;
          border-radius: 5px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          min-height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s ease;
        }
        .hero-af-input.typing {
          border-color: rgba(74,222,128,0.5);
          background: rgba(74,222,128,0.05);
          box-shadow: 0 0 12px rgba(74,222,128,0.08);
        }
        .hero-af-input.done {
          border-color: rgba(74,222,128,0.3);
          background: rgba(74,222,128,0.04);
        }
        .hero-af-value {
          font-family: var(--font-outfit), sans-serif;
          font-size: 11px;
          color: rgba(255,255,255,0.85);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hero-af-cursor {
          color: #4ade80;
          animation: heroCursorBlink 0.6s step-end infinite;
          margin-left: 1px;
        }
        @keyframes heroCursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .hero-af-badge {
          color: #4ade80;
          font-size: 10px;
          flex-shrink: 0;
          margin-left: 6px;
        }

        .hero-af-footer {
          padding: 8px 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
          font-family: var(--font-outfit), sans-serif;
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.3px;
          flex-shrink: 0;
        }

        /* ═══════════════════════════════════════════════════════
           RESPONSIVE
        ═══════════════════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .hero-demo-viewport {
            height: 320px;
          }
        }
        @media (max-width: 768px) {
          .hero-demo-wrapper {
            margin-top: 40px;
            padding: 0 16px;
          }
          .hero-demo-viewport {
            height: 280px;
          }
          .hero-read-split {
            flex-direction: column;
            gap: 10px;
          }
          .hero-read-invoice {
            flex: none;
          }
          .hero-read-fields {
            gap: 4px;
          }
          .hero-read-field {
            padding: 6px 10px;
          }
          .hero-read-status {
            padding: 6px 10px;
          }
          .hero-af-fields {
            grid-template-columns: 1fr;
            gap: 6px;
            padding: 8px 12px;
          }
          .hero-scan-doc {
            top: 24px;
            left: 20px;
            right: 20px;
            bottom: 24px;
          }
          .hero-scan-bracket svg {
            width: 24px;
            height: 24px;
          }
        }
        @media (max-width: 480px) {
          .hero-demo-viewport {
            height: 220px;
          }
          .hero-demo-chrome {
            padding: 8px 12px;
          }
          .hero-demo-dots span {
            width: 8px;
            height: 8px;
          }
          .hero-demo-url-bar {
            font-size: 10px;
            padding: 4px 8px;
          }
          .hero-demo-indicators {
            gap: 16px;
            padding: 10px 12px;
          }
          .hero-demo-indicator-label {
            font-size: 9px;
          }
          .hero-scan-label {
            font-size: 10px;
          }
          .hero-scan-row-label {
            min-width: 60px;
            font-size: 9px;
          }
          .hero-scan-row-value {
            font-size: 10px;
          }
          .hero-read-inv-label {
            font-size: 9px;
            min-width: 50px;
          }
          .hero-read-inv-value {
            font-size: 9px;
          }
          .hero-read-field-label {
            font-size: 8px;
          }
          .hero-read-field-value {
            font-size: 10px;
          }
          .hero-af-nav-live {
            font-size: 8px;
            padding: 3px 6px;
          }
          .hero-af-label {
            font-size: 8px;
          }
          .hero-af-value {
            font-size: 10px;
          }
          .hero-af-input {
            padding: 5px 8px;
            min-height: 24px;
          }
        }
      `}</style>
    </div>
  );
}
