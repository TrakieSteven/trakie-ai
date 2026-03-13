'use client';

import { useEffect, useRef } from 'react';

interface InvoiceScreenProps {
  onAdvance: () => void;
}

export default function InvoiceScreen({ onAdvance }: InvoiceScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setAttribute('webkit-playsinline', 'true');
    }
  }, []);

  return (
    <div className="invoice-screen active" onClick={onAdvance}>
      <div className="step-indicator">
        <div className="step-number">2</div>
        <span className="step-arrow">→</span>
        <span>PROCESS INVOICE</span>
      </div>
      <div className="invoice-video-container">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/invoice1.mov" type="video/quicktime" />
          <source src="/invoice1.mov" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
