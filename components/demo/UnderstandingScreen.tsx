'use client';

import { useEffect } from 'react';

interface UnderstandingScreenProps {
  stepNumber: number;
  stepLabel: string;
  title: string;
  onComplete: () => void;
  delay: number;
}

export default function UnderstandingScreen({
  stepNumber,
  stepLabel,
  title,
  onComplete,
  delay,
}: UnderstandingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, delay);
    return () => clearTimeout(timer);
  }, [onComplete, delay]);

  return (
    <div className="understanding-screen active">
      <div className="step-indicator">
        <div className="step-number">{stepNumber}</div>
        <span className="step-arrow">→</span>
        <span>{stepLabel}</span>
      </div>
      <h1 className="understanding-title">{title}</h1>
      <div className="understanding-dots">...</div>
    </div>
  );
}
