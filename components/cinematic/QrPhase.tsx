'use client';

import { useRef, useEffect, useState } from 'react';

export default function QrPhase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
    const t = setTimeout(() => setConnected(true), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="cinematic-phase">
      <div className="scan-container">
        <div className="scan-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {connected ? (
            <span style={{ color: 'rgba(74,222,128,1)', display: 'flex', alignItems: 'center', gap: 6, animation: 'fadeUp 0.4s ease both' }}>
              <span style={{ fontSize: 16 }}>✓</span> Phone Connected
            </span>
          ) : (
            <span>Scanning QR Code · Connecting Phone</span>
          )}
        </div>
        <div className="scan-viewport" style={{ aspectRatio: '9/16', maxWidth: 320, margin: '0 auto' }}>
          <video
            ref={videoRef}
            src="/camera0.mov"
            muted
            playsInline
            loop
            className="scan-video"
          />
          <div className="scan-overlay" />
          {connected && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.45)',
              animation: 'fadeUp 0.5s ease both',
            }}>
              <div style={{
                background: 'rgba(74,222,128,0.15)',
                border: '1.5px solid rgba(74,222,128,0.6)',
                borderRadius: 12,
                padding: '18px 32px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
                <div style={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: 16, fontWeight: 600, color: 'rgba(74,222,128,1)', letterSpacing: 1 }}>Connected</div>
                <div style={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Desktop + Phone synced</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
