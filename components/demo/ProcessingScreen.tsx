'use client';

import { useEffect, useRef, useState } from 'react';

const processingStages = [
  { text: 'Scanning labels...', percent: 25 },
  { text: 'Extracting data...', percent: 50 },
  { text: 'Analyzing content...', percent: 75 },
  { text: 'Finalizing...', percent: 100 },
];

interface ProcessingScreenProps {
  onComplete: () => void;
}

export default function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [currentPercent, setCurrentPercent] = useState(0);
  const [processingText, setProcessingText] = useState('Scanning labels...');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stageRef = useRef(0);

  useEffect(() => {
    let percent = 0;
    intervalRef.current = setInterval(() => {
      if (percent < 100) {
        percent += 2;
        setCurrentPercent(percent);

        for (let i = 0; i < processingStages.length; i++) {
          if (percent >= processingStages[i].percent && stageRef.current === i) {
            setProcessingText(processingStages[i].text);
            stageRef.current++;
          }
        }
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 40);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleClick = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onComplete();
  };

  return (
    <div className="processing-screen active" onClick={handleClick}>
      <div className="step-indicator" style={{ top: '100px' }}>
        <div className="step-number">7</div>
        <span className="step-arrow">→</span>
        <span>PROCESSING DATA</span>
      </div>
      <div className="ai-processing-container">
        <div className="ai-processing-title">Trakie.ai thinking...</div>

        <div className="playstation-bar-container">
          <div
            className="playstation-bar-fill"
            style={{ width: `${currentPercent}%` }}
          />
          <div className="playstation-percentage">{currentPercent}%</div>
        </div>

        <div className="processing-text">{processingText}</div>
        <div className="processing-confidence">
          Confidence: <span>99.8%</span>
        </div>

        <div className="click-to-continue">Click anywhere to continue</div>
      </div>
    </div>
  );
}
