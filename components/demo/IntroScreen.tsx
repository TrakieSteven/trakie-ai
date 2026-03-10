'use client';

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="intro-comparison" id="introComparison">
      <div className="start-receiving-container">
        <h1 className="start-receiving-title">START RECEIVING</h1>
        <p className="start-receiving-subtitle">
          Purpose-built AI for cannabis retail operations.<br />
          From invoice to inventory in under 60 seconds.
        </p>
        <button className="start-receiving-btn" onClick={onStart}>
          <span className="btn-icon">📦</span>
          <span>Begin Automated Receiving</span>
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
}
