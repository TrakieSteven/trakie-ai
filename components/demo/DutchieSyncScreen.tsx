'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatedCheckbox } from '../icons';

const syncItems = [
  'Inventory quantities updated',
  'Products added to online menu',
  'Pricing synchronized',
  'Categories assigned',
  'Stock levels updated',
];

interface DutchieSyncScreenProps {
  onComplete: () => void;
}

export default function DutchieSyncScreen({ onComplete }: DutchieSyncScreenProps) {
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let currentIndex = 0;

    function checkNextItem() {
      if (currentIndex < syncItems.length) {
        setCompletedItems((prev) => [...prev, currentIndex]);
        const prog = ((currentIndex + 1) / syncItems.length) * 100;
        setProgress(prog);
        currentIndex++;
        timerRef.current = setTimeout(checkNextItem, 500);
      } else {
        setShowCompletion(true);
        timerRef.current = setTimeout(onComplete, 1500);
      }
    }

    checkNextItem();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onComplete]);

  return (
    <div className="dutchie-sync-screen active">
      <div className="step-indicator">
        <div className="step-number">9</div>
        <span className="step-arrow">→</span>
        <span>SYNCING WITH DUTCHIE POS</span>
      </div>
      <div className="dutchie-sync-container">
        <h1 className="dutchie-sync-title">Dutchie POS Integration</h1>
        <p className="dutchie-sync-subtitle">
          Automatically updating your point-of-sale system...
        </p>

        <div className="dutchie-sync-list">
          {syncItems.map((item, i) => (
            <div
              key={i}
              className={`dutchie-sync-item${completedItems.includes(i) ? ' completed' : ''}`}
            >
              <div className="dutchie-checkbox">
                <AnimatedCheckbox checked={completedItems.includes(i)} color="#C9A961" />
              </div>
              <div className="dutchie-sync-label">{item}</div>
            </div>
          ))}
        </div>

        <div className="dutchie-progress-container">
          <div className="dutchie-progress-bar">
            <div
              className="dutchie-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="dutchie-progress-text">{Math.round(progress)}%</div>
        </div>

        <div className={`dutchie-completion-message${showCompletion ? ' show' : ''}`}>
          Dutchie POS synchronized successfully
        </div>
      </div>
    </div>
  );
}
