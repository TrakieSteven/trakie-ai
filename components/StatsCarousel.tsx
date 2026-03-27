'use client';

import { useEffect, useRef } from 'react';

const stats = [
  { number: '7x', label: 'Faster Than Manual' },
  { number: '99.9%', label: 'Accuracy Rate' },
  { number: '100%', label: 'Compliant' },
  { number: '$0', label: 'Setup Costs' },
  { number: '$3,847', label: 'Weekly Savings' },
  { number: '45s', label: 'Average Receive' },
];

const SPEED = 0.8; // px per frame at 60fps ≈ 48px/s

export default function StatsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartOffset = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const tick = () => {
      if (!pausedRef.current) {
        offsetRef.current += SPEED;
        const half = track.scrollWidth / 2;
        if (offsetRef.current >= half) offsetRef.current -= half;
        track.style.transform = `translateX(${-offsetRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartOffset.current = offsetRef.current;
    pausedRef.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !trackRef.current) return;
    const delta = touchStartX.current - e.touches[0].clientX;
    const half = trackRef.current.scrollWidth / 2;
    let next = touchStartOffset.current + delta;
    next = ((next % half) + half) % half;
    offsetRef.current = next;
    trackRef.current.style.transform = `translateX(${-next}px)`;
  };

  const onTouchEnd = () => {
    pausedRef.current = false;
    touchStartX.current = null;
  };

  return (
    <section className="vogue-stats">
      <div
        className="vogue-stats-carousel"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="vogue-stats-track" ref={trackRef}>
          {[...stats, ...stats].map((stat, i) => (
            <div className="vogue-stat-box" key={i}>
              <div className="vogue-stat-number">{stat.number}</div>
              <div className="vogue-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
