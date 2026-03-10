'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const stats = [
  { number: '7x', label: 'Faster Than Manual' },
  { number: '99.9%', label: 'Accuracy Rate' },
  { number: '100%', label: 'Compliant' },
  { number: '$0', label: 'Setup Costs' },
  { number: '$3,847', label: 'Weekly Savings' },
  { number: '45s', label: 'Average Receive' },
];

export default function StatsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const loopCountRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const pages = Math.ceil(stats.length / 3);

  const updateTransform = useCallback((index: number) => {
    if (!trackRef.current || !trackRef.current.children[0]) return;
    const cardWidth = (trackRef.current.children[0] as HTMLElement).offsetWidth;
    const gap = 30;
    trackRef.current.style.transform = `translateX(-${index * (cardWidth + gap) * 3}px)`;
  }, []);

  const nextStat = useCallback(() => {
    setCurrentIndex((prev) => {
      let next = prev + 1;
      if (next >= pages) {
        next = 0;
        loopCountRef.current++;
        if (loopCountRef.current >= 8) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
      }
      return next;
    });
  }, [pages]);

  useEffect(() => {
    updateTransform(currentIndex);
  }, [currentIndex, updateTransform]);

  useEffect(() => {
    intervalRef.current = setInterval(nextStat, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [nextStat]);

  const goToStat = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="vogue-stats">
      <div className="vogue-stats-container">
        <div className="vogue-stats-carousel">
          <div className="vogue-stats-track" id="statsTrack" ref={trackRef}>
            {stats.map((stat, i) => (
              <div className="vogue-stat-box" key={i}>
                <div className="vogue-stat-number">{stat.number}</div>
                <div className="vogue-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-controls">
          <div className="carousel-dots" id="carouselDots">
            {Array.from({ length: pages }, (_, i) => (
              <div
                key={i}
                className={`carousel-dot${i === currentIndex ? ' active' : ''}`}
                onClick={() => goToStat(i)}
              />
            ))}
          </div>
          <button className="carousel-arrow" onClick={nextStat}>
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
