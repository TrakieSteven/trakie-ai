'use client';

import { useState, useRef, useCallback } from 'react';
import IntroScreen from './demo/IntroScreen';
import QrScreen from './demo/QrScreen';
import InvoiceScreen from './demo/InvoiceScreen';
import UnderstandingScreen from './demo/UnderstandingScreen';
import MetrcVaultScreen from './demo/MetrcVaultScreen';
import ProcessingScreen from './demo/ProcessingScreen';
import ReceivingFormScreen from './demo/ReceivingFormScreen';
import DutchieSyncScreen from './demo/DutchieSyncScreen';
import ResultsScreen from './demo/ResultsScreen';

type DemoStep =
  | 'intro'
  | 'qr'
  | 'invoice'
  | 'understandingInvoice'
  | 'product'
  | 'understandingProducts'
  | 'metrcVault'
  | 'processing'
  | 'receivingForm'
  | 'dutchieSync'
  | 'results';

interface ReceiveSectionProps {
  onNavigate: (section: string) => void;
  onOpenProductModal: (index: number) => void;
}

export default function ReceiveSection({ onNavigate, onOpenProductModal }: ReceiveSectionProps) {
  const [demoStep, setDemoStep] = useState<DemoStep>('intro');
  const receiveStartTimeRef = useRef<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const startReceiving = useCallback(() => {
    receiveStartTimeRef.current = Date.now();
    setDemoStep('qr');
  }, []);

  const advanceFromQr = useCallback(() => {
    setDemoStep('invoice');
  }, []);

  const advanceFromInvoice = useCallback(() => {
    setDemoStep('understandingInvoice');
  }, []);

  const advanceFromUnderstandingInvoice = useCallback(() => {
    setDemoStep('product');
  }, []);

  const advanceFromProduct = useCallback(() => {
    setDemoStep('understandingProducts');
  }, []);

  const advanceFromUnderstandingProducts = useCallback(() => {
    setDemoStep('metrcVault');
  }, []);

  const advanceFromMetrcVault = useCallback(() => {
    setDemoStep('processing');
  }, []);

  const advanceFromProcessing = useCallback(() => {
    setDemoStep('receivingForm');
  }, []);

  const advanceFromReceivingForm = useCallback(() => {
    setDemoStep('dutchieSync');
  }, []);

  const advanceFromDutchieSync = useCallback(() => {
    const elapsed = Math.floor((Date.now() - receiveStartTimeRef.current) / 1000);
    setElapsedTime(elapsed);
    setDemoStep('results');
  }, []);

  const restartDemo = useCallback(() => {
    setDemoStep('intro');
  }, []);

  return (
    <div className="receive-wrapper">
      <div className="demo-badge">LIVE DEMO</div>

      {demoStep === 'intro' && <IntroScreen onStart={startReceiving} />}

      {demoStep === 'qr' && (
        <QrScreen
          stepNumber={1}
          stepLabel="SCAN QR CODE"
          videoSrc="https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/camera0.mov"
          onAdvance={advanceFromQr}
        />
      )}

      {demoStep === 'invoice' && (
        <InvoiceScreen onAdvance={advanceFromInvoice} />
      )}

      {demoStep === 'understandingInvoice' && (
        <UnderstandingScreen
          stepNumber={3}
          stepLabel="AI READING INVOICE"
          title="Trakie understanding invoice"
          onComplete={advanceFromUnderstandingInvoice}
          delay={2000}
        />
      )}

      {demoStep === 'product' && (
        <QrScreen
          stepNumber={4}
          stepLabel="SCAN PRODUCTS"
          videoSrc="https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/camera.mov"
          onAdvance={advanceFromProduct}
        />
      )}

      {demoStep === 'understandingProducts' && (
        <UnderstandingScreen
          stepNumber={5}
          stepLabel="AI READING LABELS"
          title="Trakie understanding products"
          onComplete={advanceFromUnderstandingProducts}
          delay={2000}
        />
      )}

      {demoStep === 'metrcVault' && (
        <MetrcVaultScreen onComplete={advanceFromMetrcVault} />
      )}

      {demoStep === 'processing' && (
        <ProcessingScreen onComplete={advanceFromProcessing} />
      )}

      {demoStep === 'receivingForm' && (
        <ReceivingFormScreen onComplete={advanceFromReceivingForm} />
      )}

      {demoStep === 'dutchieSync' && (
        <DutchieSyncScreen onComplete={advanceFromDutchieSync} />
      )}

      {demoStep === 'results' && (
        <ResultsScreen
          elapsedTime={elapsedTime}
          onOpenProductModal={onOpenProductModal}
          onRestart={restartDemo}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
