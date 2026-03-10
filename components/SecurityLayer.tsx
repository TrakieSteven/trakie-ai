'use client';

import { useEffect } from 'react';

export default function SecurityLayer() {
  useEffect(() => {
    // 1. ANTI-IFRAME PROTECTION
    if (window.top !== window.self) {
      window.top!.location.href = window.self.location.href;
    }

    // 2. CONSOLE WARNING
    console.log('%c⚠️ STOP!', 'color: red; font-size: 50px; font-weight: bold;');
    console.log('%cThis is a browser feature intended for developers.', 'font-size: 18px;');
    console.log(
      '%cIf someone told you to copy/paste something here, it is a scam.',
      'font-size: 16px;'
    );
    console.log('%c© 2025 Trakie Inc. All Rights Reserved.', 'font-size: 14px; color: #C9A961;');
    console.log(
      '%cUnauthorized copying, modification, or distribution is prohibited.',
      'font-size: 12px;'
    );

    // 4. RIGHT-CLICK PROTECTION
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener('contextmenu', handleContextMenu);

    // 5. KEY COMBINATION PROTECTION
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // 6. DEVTOOLS DETECTION
    const devtools = { isOpen: false };
    const threshold = 160;
    const devtoolsInterval = setInterval(() => {
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        if (!devtools.isOpen) {
          devtools.isOpen = true;
          console.clear();
          console.log('%c⚠️ Developer tools detected', 'color: red; font-size: 20px;');
          console.log(
            '%c© 2025 Trakie Inc. - Unauthorized access prohibited',
            'font-size: 14px;'
          );
        }
      } else {
        devtools.isOpen = false;
      }
    }, 1000);

    // 7. COPYRIGHT NOTICE
    const copyrightNotice = document.createComment(`
      ========================================
      © 2025 Trakie Inc. All Rights Reserved.

      This software and its contents are proprietary and confidential.
      Unauthorized copying, modification, distribution, or use is strictly prohibited.

      For licensing inquiries: contact@trakie.ai
      ========================================
    `);
    document.body.appendChild(copyrightNotice);

    // 8. SESSION TRACKING
    const sessionData = {
      id: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      started: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
      url: window.location.href,
    };
    console.log('Session initiated:', sessionData.id);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(devtoolsInterval);
    };
  }, []);

  return null;
}
