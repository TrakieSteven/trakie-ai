'use client';

import { useEffect } from 'react';

export default function Watermark() {
  useEffect(() => {
    const watermark = document.createElement('div');
    watermark.id = 'security-watermark';
    watermark.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.7);
      border: 1px solid rgba(201, 169, 97, 0.3);
      padding: 8px 16px;
      font-family: 'Outfit', sans-serif;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.6);
      z-index: 999999;
      pointer-events: none;
      user-select: none;
      letter-spacing: 0.5px;
    `;
    watermark.textContent = '© 2025 Trakie Inc. • Confidential Demo';
    document.body.appendChild(watermark);

    return () => {
      const el = document.getElementById('security-watermark');
      if (el) el.remove();
    };
  }, []);

  return null;
}
