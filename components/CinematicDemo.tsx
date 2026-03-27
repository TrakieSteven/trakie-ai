'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import TitlePhase from './cinematic/TitlePhase';
import QrPhase from './cinematic/QrPhase';
import ScanPhase from './cinematic/ScanPhase';
import InvoiceReadingPhase from './cinematic/InvoiceReadingPhase';
import ProductScanPhase from './cinematic/ProductScanPhase';
import ProductReadingPhase from './cinematic/ProductReadingPhase';
import AutofillPhase from './cinematic/AutofillPhase';
import CompletionPhase from './cinematic/CompletionPhase';

type Phase = 'title' | 'qr' | 'scan' | 'processing' | 'productscan' | 'productprocessing' | 'autofill' | 'completion';

const PHASE_ORDER: Phase[] = ['title', 'qr', 'scan', 'processing', 'productscan', 'productprocessing', 'autofill', 'completion'];

const PHASE_DURATIONS: Partial<Record<Phase, number>> = {
  title: 3000,
  qr: 5000,
  scan: 4000,
  processing: 4500,       // 6 steps × 520ms + overhead
  productscan: 4000,
  productprocessing: 3500, // 5 steps × 540ms + overhead
  // autofill: driven by onComplete callback
  completion: 5000,
};

export default function CinematicDemo() {
  const [phase, setPhase] = useState<Phase>('title');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loopKey, setLoopKey] = useState(0);

  const advanceTo = useCallback((next: Phase) => {
    setPhase(next);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const duration = PHASE_DURATIONS[phase];
    if (!duration) return; // autofill is callback-driven

    const currentIdx = PHASE_ORDER.indexOf(phase);
    const nextPhase = PHASE_ORDER[(currentIdx + 1) % PHASE_ORDER.length];

    timerRef.current = setTimeout(() => {
      if (nextPhase === 'title') {
        setLoopKey(k => k + 1);
      }
      advanceTo(nextPhase);
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, advanceTo]);

  const handleAutofillComplete = useCallback(() => {
    advanceTo('completion');
  }, [advanceTo]);

  return (
    <div className="cinematic-demo">
      {phase === 'title' && (
        <div key={`title-${loopKey}`} className="cinematic-phase-in">
          <TitlePhase />
        </div>
      )}
      {phase === 'qr' && (
        <div key={`qr-${loopKey}`} className="cinematic-phase-in">
          <QrPhase />
        </div>
      )}
      {phase === 'scan' && (
        <div key={`scan-${loopKey}`} className="cinematic-phase-in">
          <ScanPhase />
        </div>
      )}
      {phase === 'processing' && (
        <div key={`processing-${loopKey}`} className="cinematic-phase-in">
          <InvoiceReadingPhase />
        </div>
      )}
      {phase === 'productscan' && (
        <div key={`productscan-${loopKey}`} className="cinematic-phase-in">
          <ProductScanPhase />
        </div>
      )}
      {phase === 'productprocessing' && (
        <div key={`productprocessing-${loopKey}`} className="cinematic-phase-in">
          <ProductReadingPhase />
        </div>
      )}
      {phase === 'autofill' && (
        <div key={`autofill-${loopKey}`} className="cinematic-phase-in">
          <AutofillPhase onComplete={handleAutofillComplete} />
        </div>
      )}
      {phase === 'completion' && (
        <div key={`completion-${loopKey}`} className="cinematic-phase-in">
          <CompletionPhase />
        </div>
      )}
    </div>
  );
}
