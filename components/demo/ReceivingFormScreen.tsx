'use client';

import { useEffect, useRef, useState } from 'react';

const formFields = [
  { label: 'SUPPLIER NAME', value: 'Premium Cannabis Distributors' },
  { label: 'INVOICE NUMBER', value: 'INV-2024-1547' },
  { label: 'DELIVERY DATE', value: '12/15/2024' },
  { label: 'PRODUCTS RECEIVED', value: '5 Items' },
];

const productItems = [
  'Sunset Sherbert • 250 units',
  'Strawnana Vape • 500 units',
  'Durban Poison • 250 units',
  'Blackberry Lemon • 55 units',
  'Blue Raspberry • 32 units',
];

interface ReceivingFormScreenProps {
  onComplete: () => void;
}

export default function ReceivingFormScreen({ onComplete }: ReceivingFormScreenProps) {
  const [fieldTexts, setFieldTexts] = useState<string[]>(formFields.map(() => ''));
  const [fieldStates, setFieldStates] = useState<('idle' | 'typing' | 'complete')[]>(
    formFields.map(() => 'idle')
  );
  const [productTexts, setProductTexts] = useState<string[]>(productItems.map(() => ''));
  const [productStates, setProductStates] = useState<('hidden' | 'visible' | 'complete')[]>(
    productItems.map(() => 'hidden')
  );
  const [totalItems, setTotalItems] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Animate form inputs (500ms delay between each)
    formFields.forEach((field, index) => {
      const timer = setTimeout(() => {
        setFieldStates((prev) => {
          const next = [...prev];
          next[index] = 'typing';
          return next;
        });

        let charIndex = 0;
        const interval = setInterval(() => {
          if (charIndex < field.value.length) {
            charIndex++;
            const text = field.value.substring(0, charIndex);
            setFieldTexts((prev) => {
              const next = [...prev];
              next[index] = text;
              return next;
            });
          } else {
            clearInterval(interval);
            setFieldStates((prev) => {
              const next = [...prev];
              next[index] = 'complete';
              return next;
            });
          }
        }, 30);
        intervalsRef.current.push(interval);
      }, index * 500);
      timersRef.current.push(timer);
    });

    // Animate product list (starts after 2000ms)
    productItems.forEach((product, index) => {
      const timer = setTimeout(() => {
        setProductStates((prev) => {
          const next = [...prev];
          next[index] = 'visible';
          return next;
        });

        let charIndex = 0;
        const interval = setInterval(() => {
          if (charIndex < product.length) {
            charIndex++;
            const text = product.substring(0, charIndex);
            setProductTexts((prev) => {
              const next = [...prev];
              next[index] = text;
              return next;
            });
          } else {
            clearInterval(interval);
            setProductStates((prev) => {
              const next = [...prev];
              next[index] = 'complete';
              return next;
            });
          }
        }, 20);
        intervalsRef.current.push(interval);
      }, 2000 + index * 400);
      timersRef.current.push(timer);
    });

    // Animate numbers counting up at 4000ms
    const numberTimer = setTimeout(() => {
      const targets = [
        { setter: setTotalItems, final: 5 },
        { setter: setTotalUnits, final: 1087 },
      ];

      targets.forEach(({ setter, final }) => {
        let current = 0;
        const increment = final / 30;
        const interval = setInterval(() => {
          current += increment;
          if (current >= final) {
            setter(final);
            clearInterval(interval);
          } else {
            setter(Math.floor(current));
          }
        }, 30);
        intervalsRef.current.push(interval);
      });
    }, 4000);
    timersRef.current.push(numberTimer);

    // Enable complete button at 4500ms
    const btnTimer = setTimeout(() => {
      setButtonEnabled(true);
    }, 4500);
    timersRef.current.push(btnTimer);

    return () => {
      intervalsRef.current.forEach(clearInterval);
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="receiving-form-screen active">
      <div className="step-indicator" style={{ top: '100px' }}>
        <div className="step-number">8</div>
        <span className="step-arrow">→</span>
        <span>VERIFY &amp; COMPLETE</span>
      </div>
      <div className="receiving-form-container">
        <h2 className="form-screen-title">Complete Receiving</h2>
        <p className="form-screen-subtitle">
          Trakie AI has processed your products. Verify details below.
        </p>

        <div className="dutchie-form">
          <div className="form-row">
            {formFields.slice(0, 2).map((field, i) => (
              <div className="form-field" key={i}>
                <label>{field.label}</label>
                <div className={`animated-input${fieldStates[i] === 'typing' ? ' typing' : ''}${fieldStates[i] === 'complete' ? ' complete' : ''}`}>
                  <span className="typing-text">{fieldTexts[i]}</span>
                  <span className="checkmark-icon">✓</span>
                </div>
              </div>
            ))}
          </div>

          <div className="form-row">
            {formFields.slice(2, 4).map((field, i) => (
              <div className="form-field" key={i + 2}>
                <label>{field.label}</label>
                <div className={`animated-input${fieldStates[i + 2] === 'typing' ? ' typing' : ''}${fieldStates[i + 2] === 'complete' ? ' complete' : ''}`}>
                  <span className="typing-text">{fieldTexts[i + 2]}</span>
                  <span className="checkmark-icon">✓</span>
                </div>
              </div>
            ))}
          </div>

          <div className="products-processing">
            <div className="processing-header">PROCESSING PRODUCTS</div>
            <div className="product-list-animated">
              {productItems.map((_, i) => (
                <div
                  key={i}
                  className={`product-item-animated${productStates[i] === 'visible' || productStates[i] === 'complete' ? ' visible' : ''}${productStates[i] === 'complete' ? ' complete' : ''}`}
                >
                  <span className="product-text">{productTexts[i]}</span>
                  <span className="product-check">✓</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-summary">
            <div className="summary-item">
              <span>TOTAL ITEMS:</span>
              <strong className="animated-number">{totalItems.toLocaleString()}</strong>
            </div>
            <div className="summary-item">
              <span>TOTAL UNITS:</span>
              <strong className="animated-number">{totalUnits.toLocaleString()}</strong>
            </div>
            <div className="summary-item">
              <span>PROCESSING TIME:</span>
              <strong className="highlight">45 seconds</strong>
            </div>
          </div>

          <button
            type="button"
            className="complete-receiving-btn"
            style={{
              opacity: buttonEnabled ? 1 : 0.3,
              pointerEvents: buttonEnabled ? 'auto' : 'none',
            }}
            onClick={onComplete}
          >
            ✓ Complete Receiving
          </button>
        </div>
      </div>
    </div>
  );
}
