'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface FieldDef {
  label: string;
  value: string;
  type: 'text' | 'dropdown';
  section: 'details' | 'items';
  confidence: 'high' | 'uncertain' | 'missing';
  width?: 'full' | 'half';
}

const FIELDS: FieldDef[] = [
  // Details section
  { label: 'Vendor / Supplier', value: 'Green Leaf Farms LLC', type: 'text', section: 'details', confidence: 'high', width: 'half' },
  { label: 'Receiving Room', value: 'Vault', type: 'dropdown', section: 'details', confidence: 'high', width: 'half' },
  { label: 'Inventory Status', value: 'Ready for Sale', type: 'dropdown', section: 'details', confidence: 'high', width: 'full' },
  // Items section
  { label: 'Product Name', value: 'Jeeter | Gelato | Hybrid | Pre-roll 1g 5pk', type: 'text', section: 'items', confidence: 'high', width: 'full' },
  { label: 'Batch / Lot ID', value: 'LOT-GEL-0126-A', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'Package ID (METRC)', value: '1A4060300002F04000027491', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'Quantity Received', value: '24', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'Expiration Date', value: '09/2027', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'THC %', value: '22.4%', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'CBD %', value: '0.08%', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'Cost per Unit', value: '$8.50', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'Retail Price per Unit', value: '$17.00', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'Total Package Cost', value: '$204.00', type: 'text', section: 'items', confidence: 'high', width: 'full' },
  { label: 'Ingredients', value: '', type: 'text', section: 'items', confidence: 'uncertain', width: 'half' },
  { label: 'Allergens', value: '', type: 'text', section: 'items', confidence: 'missing', width: 'half' },
];

type FieldState = 'idle' | 'typing' | 'complete';

export default function DemoAutofillSection() {
  const [fieldStates, setFieldStates] = useState<FieldState[]>(() => FIELDS.map(() => 'idle'));
  const [displayTexts, setDisplayTexts] = useState<string[]>(() => FIELDS.map(() => ''));
  const [showComplete, setShowComplete] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [submitReady, setSubmitReady] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const cleanup = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timersRef.current = [];
    intervalsRef.current = [];
  }, []);

  const runAnimation = useCallback(() => {
    cleanup();
    setFieldStates(FIELDS.map(() => 'idle'));
    setDisplayTexts(FIELDS.map(() => ''));
    setShowComplete(false);
    setAnimationDone(false);
    setSubmitReady(false);

    let delay = 600;
    const CHAR_INTERVAL = 28;
    const FIELD_GAP = 380;

    FIELDS.forEach((field, idx) => {
      const startDelay = delay;

      if (field.type === 'dropdown' || field.value === '') {
        timersRef.current.push(setTimeout(() => {
          setFieldStates(prev => { const n = [...prev]; n[idx] = 'typing'; return n; });
          setDisplayTexts(prev => { const n = [...prev]; n[idx] = field.value; return n; });
          timersRef.current.push(setTimeout(() => {
            setFieldStates(prev => { const n = [...prev]; n[idx] = 'complete'; return n; });
          }, 180));
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
              }, 100));
            }
          }, CHAR_INTERVAL);
          intervalsRef.current.push(interval);
        }, startDelay));
        delay += Math.max(typingDuration, FIELD_GAP);
      }
    });

    timersRef.current.push(setTimeout(() => {
      setSubmitReady(true);
      timersRef.current.push(setTimeout(() => {
        setShowComplete(true);
        timersRef.current.push(setTimeout(() => setAnimationDone(true), 500));
      }, 800));
    }, delay + 600));
  }, [cleanup]);

  useEffect(() => {
    runAnimation();
    return cleanup;
  }, [runAnimation, cleanup]);

  const detailFields = FIELDS.map((f, i) => ({ ...f, idx: i })).filter(f => f.section === 'details');
  const itemFields = FIELDS.map((f, i) => ({ ...f, idx: i })).filter(f => f.section === 'items');

  const renderField = (field: FieldDef & { idx: number }) => {
    const state = fieldStates[field.idx];
    const text = displayTexts[field.idx];
    const isTyping = state === 'typing';
    const isDone = state === 'complete';

    const inputClass = [
      'dform-input',
      isTyping ? 'typing' : '',
      isDone ? 'done' : '',
      isDone ? `conf-${field.confidence}` : '',
    ].filter(Boolean).join(' ');

    return (
      <div key={field.idx} className={`dform-field${field.width === 'full' ? ' full' : ''}`}>
        <label className="dform-label">
          {field.label}
          {field.type === 'dropdown' && <span className="dform-dropdown-icon">▾</span>}
        </label>
        <div className={inputClass}>
          <span className="dform-value">
            {text || (isDone && field.value === '' ? <span className="dform-empty">Not detected</span> : null)}
            {isTyping && <span className="dform-cursor">|</span>}
          </span>
          {isDone && (
            <span className={`dform-badge conf-${field.confidence}`}>
              {field.confidence === 'high' && '✓'}
              {field.confidence === 'uncertain' && '?'}
              {field.confidence === 'missing' && '!'}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="demo-page">
      <div className="demo-container">
        {/* Page heading — stays dark-themed above the window */}
        <h1 className="demo-title">Watch Trakie AI in Action</h1>
        <p className="demo-subtitle">Dutchie receiving form — filled automatically in real time</p>

        {/* Browser window */}
        <div className="dlive-window" style={{ marginBottom: 0 }}>

          {/* macOS chrome */}
          <div className="dlive-chrome">
            <div className="dlive-dots">
              <span className="dlive-dot" style={{ background: '#ff5f57' }} />
              <span className="dlive-dot" style={{ background: '#ffbd2e' }} />
              <span className="dlive-dot" style={{ background: '#28ca41' }} />
            </div>
            <div className="dlive-url-bar">
              <span className="dlive-url-lock">🔒</span>
              pos.dutchie.com / inventory / receive-transfer
            </div>
          </div>

          {/* Dutchie app */}
          <div className="dlive-app">

            {/* Nav */}
            <div className="dlive-nav">
              <div className="dlive-nav-logo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#2d9d78" />
                  <path d="M8 12.5l2.5 2.5L16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Dutchie POS</span>
              </div>
              <span className="dlive-nav-sep">›</span>
              <span className="dlive-nav-crumb">Inventory</span>
              <span className="dlive-nav-sep">›</span>
              <span className="dlive-nav-crumb active">Receive Transfer</span>
              <div className="dlive-nav-live">
                <span className="dlive-live-dot" />
                TRAKIE AI AUTOFILLING
              </div>
            </div>

            {/* Page header */}
            <div className="dlive-page-header">
              <div>
                <h2 className="dlive-page-title">Receive Inbound Transfer</h2>
                <p className="dlive-page-sub">Trakie AI is reading your invoice and labels</p>
              </div>
              <span className="dlive-processing-badge">
                <span className="dlive-badge-dot" />
                {submitReady ? 'Complete' : 'Processing'}
              </span>
            </div>

            {/* Form body */}
            <div className="dform-body">

              <div className="dform-section">
                <div className="dform-section-title">Receiving Details</div>
                <div className="dform-grid">
                  {detailFields.map(f => renderField(f))}
                </div>
              </div>

              <div className="dform-section">
                <div className="dform-section-title">Item Details</div>
                <div className="dform-grid">
                  {itemFields.map(f => renderField(f))}
                </div>
              </div>

            </div>

            {/* Footer / submit */}
            <div className="dform-footer">
              <span className="dform-footer-note">
                {animationDone
                  ? '13 of 15 fields filled · 2 require manual review'
                  : 'Autofilling fields…'}
              </span>
              <button
                className={`dlive-confirm-btn${submitReady ? ' ready' : ''}`}
                disabled={!submitReady}
                onClick={runAnimation}
              >
                {submitReady ? '✓  Submit Receiving' : 'Autofilling…'}
              </button>
            </div>

          </div>
        </div>

        {/* Completion message */}
        <div className={`demo-complete-message${showComplete ? ' visible' : ''}`}>
          <p>Complete — Trakie fills your forms in under 60 seconds</p>
          {animationDone && (
            <button className="demo-replay-btn" onClick={runAnimation}>
              Replay
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
