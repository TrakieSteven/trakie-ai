'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatedCheckbox } from '../icons';

const metrcPackages = [
  'Sunset Sherbert (3.5g)',
  'Strawnana Vape (1g)',
  'Durban Poison (1g)',
  'Blackberry Lemon (100mg)',
  'Blue Raspberry (100mg)',
];

interface MetrcVaultScreenProps {
  onComplete: () => void;
}

export default function MetrcVaultScreen({ onComplete }: MetrcVaultScreenProps) {
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let currentIndex = 0;

    function checkNextItem() {
      if (currentIndex < metrcPackages.length) {
        setCompletedItems((prev) => [...prev, currentIndex]);
        const prog = ((currentIndex + 1) / metrcPackages.length) * 100;
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
    <div className="metrc-vault-screen active">
      <div className="step-indicator">
        <div className="step-number">6</div>
        <span className="step-arrow">→</span>
        <span>ADDING TO METRC VAULT</span>
      </div>
      <div className="metrc-vault-container">
        <h1 className="metrc-vault-title">Automated METRC Entry</h1>
        <p className="metrc-vault-subtitle">Processing 5 packages for state compliance...</p>

        <div className="metrc-package-list">
          {metrcPackages.map((pkg, i) => (
            <div
              key={i}
              className={`metrc-package-item${completedItems.includes(i) ? ' completed' : ''}`}
            >
              <div className="metrc-checkbox">
                <AnimatedCheckbox checked={completedItems.includes(i)} color="#7fb800" />
              </div>
              <div className="metrc-product-name">{pkg}</div>
              <div className="metrc-status">Vault Entry Complete</div>
            </div>
          ))}
        </div>

        <div className="metrc-progress-container">
          <div className="metrc-progress-bar">
            <div
              className="metrc-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="metrc-progress-text">{Math.round(progress)}%</div>
        </div>

        <div className={`metrc-completion-message${showCompletion ? ' show' : ''}`}>
          All packages successfully added to METRC vault
        </div>
      </div>
    </div>
  );
}
