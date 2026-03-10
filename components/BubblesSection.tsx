'use client';

import { useEffect, useRef, useCallback } from 'react';
import { categories } from '@/data/categories';

interface BubblesSectionProps {
  isActive: boolean;
  onCategoryClick: (name: string) => void;
}

function BubbleItem({ category, index, onCategoryClick }: {
  category: typeof categories[0];
  index: number;
  onCategoryClick: (name: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const videoLoadedRef = useRef(false);
  const middleTimeRef = useRef(0);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.setAttribute('webkit-playsinline', 'true');

    const handleMetadata = () => {
      if (isFinite(video.duration) && video.duration > 0) {
        middleTimeRef.current = video.duration / 2;
        video.currentTime = middleTimeRef.current;
      }
    };

    const handleCanPlay = () => {
      if (!videoLoadedRef.current && isFinite(video.duration) && video.duration > 0) {
        videoLoadedRef.current = true;
        video.style.display = 'block';
        if (emojiRef.current) emojiRef.current.style.display = 'none';
      }
    };

    const handleError = () => {
      video.style.display = 'none';
      if (emojiRef.current) emojiRef.current.style.display = 'flex';
    };

    video.addEventListener('loadedmetadata', handleMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    const video = videoRef.current;
    if (video && videoLoadedRef.current) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    const video = videoRef.current;
    if (video && videoLoadedRef.current) {
      video.pause();
      setTimeout(() => {
        if (!isHoveringRef.current && video) {
          video.currentTime = middleTimeRef.current;
        }
      }, 100);
    }
  };

  return (
    <div
      className="bubble"
      style={{ '--delay': index } as React.CSSProperties}
      onClick={() => onCategoryClick(category.name)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={emojiRef}
        style={{
          fontSize: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      >
        {category.emoji}
      </div>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'none',
        }}
      >
        <source src={category.video} type="video/quicktime" />
        <source src={category.video} type="video/mp4" />
      </video>
      <div className="bubble-label">{category.name}</div>
    </div>
  );
}

export default function BubblesSection({ isActive, onCategoryClick }: BubblesSectionProps) {
  return (
    <div className="bubbles-wrapper">
      <div className="bubbles-header">
        <h1 className="bubbles-title">Intelligent Inventory</h1>
        <p className="bubbles-subtitle">AI-curated selections for the modern customer</p>
      </div>
      <div className="bubbles-container" id="bubblesContainer">
        {isActive &&
          categories.map((category, index) => (
            <BubbleItem
              key={category.name}
              category={category}
              index={index}
              onCategoryClick={onCategoryClick}
            />
          ))}
      </div>
    </div>
  );
}
