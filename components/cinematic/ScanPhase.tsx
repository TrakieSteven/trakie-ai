'use client';

import { useRef, useEffect } from 'react';

export default function ScanPhase() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <div className="cinematic-phase">
      <div className="scan-container">
        <div className="scan-label">Scanning Invoice</div>
        <div className="scan-viewport">
          <video
            ref={videoRef}
            src="/invoice1.mov"
            muted
            playsInline
            loop
            className="scan-video"
          />
          <div className="scan-overlay" />
        </div>
      </div>
    </div>
  );
}
