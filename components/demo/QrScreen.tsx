'use client';

import { useEffect, useRef } from 'react';

interface QrScreenProps {
  stepNumber: number;
  stepLabel: string;
  videoSrc: string;
  onAdvance: () => void;
}

export default function QrScreen({ stepNumber, stepLabel, videoSrc, onAdvance }: QrScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setAttribute('webkit-playsinline', 'true');
    }
  }, []);

  return (
    <div className="qr-screen active" onClick={onAdvance}>
      <div className="step-indicator">
        <div className="step-number">{stepNumber}</div>
        <span className="step-arrow">→</span>
        <span>{stepLabel}</span>
      </div>
      <div className="qr-video-container">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={videoSrc} type="video/quicktime" />
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
