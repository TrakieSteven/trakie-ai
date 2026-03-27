'use client';

import { useState, useEffect } from 'react';

interface ProcessingPhaseProps {
  label?: string;
}

export default function ProcessingPhase({ label = 'reading invoice' }: ProcessingPhaseProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cinematic-phase">
      <div className="processing-center">
        <p className="processing-text">trakie.ai {label}{dots}</p>
        <div className="processing-bar-track">
          <div className="processing-bar-fill" />
        </div>
      </div>
    </div>
  );
}
