'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface FieldDef {
  label: string;
  value: string;
  type: 'text' | 'dropdown';
  section: 'details' | 'items';
  confidence: 'high' | 'uncertain' | 'missing';
}

const FIELDS: FieldDef[] = [
  { label: 'Vendor', value: 'Green Health LLC', type: 'text', section: 'details', confidence: 'high' },
  { label: 'Room', value: 'Vault', type: 'dropdown', section: 'details', confidence: 'high' },
  { label: 'Inventory Status', value: 'Ready', type: 'dropdown', section: 'details', confidence: 'high' },
  { label: 'Product Name', value: 'Jeeter | Gelato | Hybrid | Pre-roll 1g 5pk', type: 'text', section: 'items', confidence: 'high' },
  { label: 'Batch / Lot ID', value: 'LOT-GEL-0126-A', type: 'text', section: 'items', confidence: 'high' },
  { label: 'Package ID (METRC)', value: '1A4060300002F04000027491', type: 'text', section: 'items', confidence: 'high' },
  { label: 'Quantity', value: '24', type: 'text', section: 'items', confidence: 'high' },
  { label: 'Expiration Date', value: '09/2027', type: 'text', section: 'items', confidence: 'high' },
  { label: 'THC%', value: '22.4%', type: 'text', section: 'items', confidence: 'high' },
  { label: 'CBD%', value: '0.08%', type: 'text', section: 'items', confidence: 'high' },
  { label: 'Cost per unit', value: '$8.50', type: 'text', section: 'items', confidence: 'high' },
  { label: 'Price per unit', value: '$17.00', type: 'text', section: 'items', confidence: 'high' },
  { label: 'Total package cost', value: '$204.00', type: 'text', section: 'items', confidence: 'high' },
  { label: 'Ingredients', value: '', type: 'text', section: 'items', confidence: 'uncertain' },
  { label: 'Allergens', value: '', type: 'text', section: 'items', confidence: 'missing' },
];

type FieldState = 'idle' | 'typing' | 'complete';

function ConfidenceBadge({ confidence }: { confidence: 'high' | 'uncertain' | 'missing' }) {
  if (confidence === 'high') {
    return <span className="ai-badge high">&#10003;</span>;
  }
  if (confidence === 'uncertain') {
    return <span className="ai-badge uncertain">?</span>;
  }
  return <span className="ai-badge missing">!</span>;
}

export default function DemoAutofillSection() {
  const [fieldStates, setFieldStates] = useState<FieldState[]>(() => FIELDS.map(() => 'idle'));
  const [displayTexts, setDisplayTexts] = useState<string[]>(() => FIELDS.map(() => ''));
  const [showComplete, setShowComplete] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
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

    let delay = 500;
    const CHAR_INTERVAL = 30;
    const FIELD_GAP = 400;

    FIELDS.forEach((field, idx) => {
      const startDelay = delay;

      if (field.type === 'dropdown' || field.value === '') {
        // Instant snap for dropdowns and empty fields
        const t = setTimeout(() => {
          setFieldStates(prev => { const n = [...prev]; n[idx] = 'typing'; return n; });
          setDisplayTexts(prev => { const n = [...prev]; n[idx] = field.value; return n; });

          const t2 = setTimeout(() => {
            setFieldStates(prev => { const n = [...prev]; n[idx] = 'complete'; return n; });
          }, 150);
          timersRef.current.push(t2);
        }, startDelay);
        timersRef.current.push(t);
        delay += FIELD_GAP;
      } else {
        // Typewriter for text fields
        const typingDuration = field.value.length * CHAR_INTERVAL;

        const t = setTimeout(() => {
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
              const t3 = setTimeout(() => {
                setFieldStates(prev => { const n = [...prev]; n[idx] = 'complete'; return n; });
              }, 100);
              timersRef.current.push(t3);
            }
          }, CHAR_INTERVAL);
          intervalsRef.current.push(interval);
        }, startDelay);
        timersRef.current.push(t);
        delay += Math.max(typingDuration, FIELD_GAP);
      }
    });

    // Completion message
    const completeTimer = setTimeout(() => {
      setShowComplete(true);
      const doneTimer = setTimeout(() => setAnimationDone(true), 500);
      timersRef.current.push(doneTimer);
    }, delay + 1500);
    timersRef.current.push(completeTimer);
  }, [cleanup]);

  useEffect(() => {
    runAnimation();
    return cleanup;
  }, [runAnimation, cleanup]);

  const handleReplay = () => {
    runAnimation();
  };

  const detailFields = FIELDS.map((f, i) => ({ ...f, idx: i })).filter(f => f.section === 'details');
  const itemFields = FIELDS.map((f, i) => ({ ...f, idx: i })).filter(f => f.section === 'items');

  const renderField = (field: FieldDef & { idx: number }) => {
    const state = fieldStates[field.idx];
    const text = displayTexts[field.idx];
    const confidenceClass = state === 'complete' ? `confidence-${field.confidence}` : '';
    const stateClass = state === 'typing' ? 'typing' : state === 'complete' ? 'complete' : '';

    return (
      <div className="form-field" key={field.idx}>
        <label>{field.label}{field.type === 'dropdown' && ' \u25BE'}</label>
        <div className={`animated-input ${stateClass} ${confidenceClass}`}>
          <span className="typing-text">
            {text}
            {state === 'typing' && <span className="demo-cursor">|</span>}
          </span>
          {state === 'complete' && <ConfidenceBadge confidence={field.confidence} />}
        </div>
      </div>
    );
  };

  return (
    <div className="demo-page">
      <div className="demo-container">
        <h1 className="demo-title">Watch Trakie AI in Action</h1>
        <p className="demo-subtitle">See how Trakie automatically fills your Dutchie receiving forms</p>

        <div className="demo-form">
          <div className="demo-form-section">
            <h3>Receiving Details</h3>
            <div className="form-row">
              {renderField(detailFields[0])}
              {renderField(detailFields[1])}
            </div>
            <div className="form-row demo-full-width">
              {renderField(detailFields[2])}
            </div>
          </div>

          <div className="demo-form-section">
            <h3>Items Received</h3>
            <div className="form-row demo-full-width">
              {renderField(itemFields[0])}
            </div>
            <div className="form-row">
              {renderField(itemFields[1])}
              {renderField(itemFields[2])}
            </div>
            <div className="form-row">
              {renderField(itemFields[3])}
              {renderField(itemFields[4])}
            </div>
            <div className="form-row">
              {renderField(itemFields[5])}
              {renderField(itemFields[6])}
            </div>
            <div className="form-row">
              {renderField(itemFields[7])}
              {renderField(itemFields[8])}
            </div>
            <div className="form-row demo-full-width">
              {renderField(itemFields[9])}
            </div>
            <div className="form-row">
              {renderField(itemFields[10])}
              {renderField(itemFields[11])}
            </div>
          </div>
        </div>

        <div className={`demo-complete-message${showComplete ? ' visible' : ''}`}>
          <p>Demo complete &mdash; Trakie fills your forms in under 60 seconds</p>
          {animationDone && (
            <button className="demo-replay-btn" onClick={handleReplay}>
              Replay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
