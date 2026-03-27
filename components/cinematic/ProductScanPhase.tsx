'use client';

import { useRef, useEffect } from 'react';

export default function ProductScanPhase() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <div className="cinematic-phase">
      <div className="scan-container">
        <div className="scan-label">Scanning Product Labels</div>
        <div className="scan-viewport" style={{ aspectRatio: '9/16', maxWidth: 320, margin: '0 auto' }}>
          <video
            ref={videoRef}
            src="/camera.mov"
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
