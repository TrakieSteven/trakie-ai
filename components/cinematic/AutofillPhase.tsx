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
  { label: 'Vendor / Supplier', value: 'Mary Jane Farms LLC', type: 'text', section: 'details', confidence: 'high', width: 'half' },
  { label: 'Receiving Room', value: 'Vault', type: 'dropdown', section: 'details', confidence: 'high', width: 'half' },
  { label: 'Inventory Status', value: 'Ready for Sale', type: 'dropdown', section: 'details', confidence: 'high', width: 'full' },
  { label: 'Product Name', value: 'Sour Diesel | Hybrid | Flower | 3.5g', type: 'text', section: 'items', confidence: 'high', width: 'full' },
  { label: 'Batch / Lot ID', value: 'LOT-SD-0326-B', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'Package ID (METRC)', value: '1A4060300002F04000031847', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'Quantity Received', value: '48', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'Expiration Date', value: '12/2026', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'THC %', value: '24.5%', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'CBD %', value: '0.12%', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'Cost per Unit', value: '$12.00', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'Retail Price per Unit', value: '$25.00', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'Total Package Cost', value: '$576.00', type: 'text', section: 'items', confidence: 'high', width: 'full' },
  { label: 'Net Weight', value: '3.5g', type: 'text', section: 'items', confidence: 'high', width: 'half' },
  { label: 'Strain Type', value: '', type: 'text', section: 'items', confidence: 'uncertain', width: 'half' },
];

type FieldState = 'idle' | 'typing' | 'complete';

interface AutofillPhaseProps {
  onComplete: () => void;
}

export default function AutofillPhase({ onComplete }: AutofillPhaseProps) {
  const [fieldStates, setFieldStates] = useState<FieldState[]>(() => FIELDS.map(() => 'idle'));
  const [displayTexts, setDisplayTexts] = useState<string[]>(() => FIELDS.map(() => ''));
  const [allDone, setAllDone] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const cleanup = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timersRef.current = [];
    intervalsRef.current = [];
  }, []);

  useEffect(() => {
    cleanup();
    setFieldStates(FIELDS.map(() => 'idle'));
    setDisplayTexts(FIELDS.map(() => ''));
    setAllDone(false);

    let delay = 600;
    const CHAR_INTERVAL = 65;
    const FIELD_GAP = 500;

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

    // Fire onComplete 1.5s after last field finishes
    timersRef.current.push(setTimeout(() => {
      setAllDone(true);
      timersRef.current.push(setTimeout(() => {
        onCompleteRef.current();
      }, 1500));
    }, delay + 400));

    return cleanup;
  }, [cleanup]);

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
          {field.type === 'dropdown' && <span className="dform-dropdown-icon">&#9662;</span>}
        </label>
        <div className={inputClass}>
          <span className="dform-value">
            {text || (isDone && field.value === '' ? <span className="dform-empty">Not detected</span> : null)}
            {isTyping && <span className="dform-cursor">|</span>}
          </span>
          {isDone && (
            <span className={`dform-badge conf-${field.confidence}`}>
              {field.confidence === 'high' && '\u2713'}
              {field.confidence === 'uncertain' && '?'}
              {field.confidence === 'missing' && '!'}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="cinematic-phase cinematic-autofill">
      <div className="demo-container">
        <div className="dlive-window" style={{ marginBottom: 0 }}>
          {/* macOS chrome */}
          <div className="dlive-chrome">
            <div className="dlive-dots">
              <span className="dlive-dot" style={{ background: '#ff5f57' }} />
              <span className="dlive-dot" style={{ background: '#ffbd2e' }} />
              <span className="dlive-dot" style={{ background: '#28ca41' }} />
            </div>
            <div className="dlive-url-bar">
              <span className="dlive-url-lock">&#128274;</span>
              pos.dutchie.com / inventory / receive-transfer
            </div>
          </div>

          {/* Dutchie app */}
          <div className="dlive-app">
            <div className="dlive-nav">
              <div className="dlive-nav-logo">
                <img
                  src="/dutchie-logo.jpeg"
                  alt="Dutchie"
                  style={{ height: 20, marginRight: 6 }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span>Dutchie POS</span>
              </div>
              <span className="dlive-nav-sep">&rsaquo;</span>
              <span className="dlive-nav-crumb">Inventory</span>
              <span className="dlive-nav-sep">&rsaquo;</span>
              <span className="dlive-nav-crumb active">Receive Transfer</span>
              <div className="dlive-nav-live">
                <span className="dlive-live-dot" />
                TRAKIE AI AUTOFILLING
              </div>
            </div>

            <div className="dlive-page-header">
              <div>
                <h2 className="dlive-page-title">Receive Inbound Transfer</h2>
                <p className="dlive-page-sub">trakie.ai is reading your invoice and labels</p>
              </div>
              <span className="dlive-processing-badge">
                <span className="dlive-badge-dot" />
                {allDone ? 'Complete' : 'Processing'}
              </span>
            </div>

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

            <div className="dform-footer">
              <span className="dform-footer-note">
                {allDone
                  ? '14 fields filled \u00b7 1 requires manual review'
                  : 'Autofilling fields\u2026'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
