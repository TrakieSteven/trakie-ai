'use client';

import { useEffect, useRef } from 'react';

export default function WelcomeScreen() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  // Welcome screen is currently disabled (hidden)
  return (
    <div className="welcome-screen" id="welcomeScreen" style={{ display: 'none' }}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          top: '-20%',
          left: 0,
          width: '100%',
          height: '120%',
          objectFit: 'cover',
          opacity: 0.4,
          filter: 'blur(2px)',
          zIndex: 0,
        }}
      >
        <source src="https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/welcome0.mov" type="video/quicktime" />
        <source src="https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/welcome0.mov" type="video/mp4" />
      </video>

      <div className="stats-ticker">
        <div className="ticker-content">
          <span>The AI layer NY dispensaries need</span>
          <span className="ticker-dot">&bull;</span>
          <span>100% METRC Compliant</span>
          <span className="ticker-dot">&bull;</span>
          <span>10x faster receiving</span>
          <span className="ticker-dot">&bull;</span>
          <span>Zero guesswork</span>
          <span className="ticker-dot">&bull;</span>
          <span>The AI layer NY dispensaries need</span>
          <span className="ticker-dot">&bull;</span>
          <span>100% METRC Compliant</span>
          <span className="ticker-dot">&bull;</span>
          <span>10x faster receiving</span>
          <span className="ticker-dot">&bull;</span>
          <span>Zero guesswork</span>
        </div>
      </div>

      <div className="gradient-accent"></div>

      <h1 className="title">Automate Receiving. Predict Demand. Accelerate Sales.</h1>

      <p className="welcome-subtitle">
        The future of cannabis retail operations.<br />
        Purpose-built for dispensaries at scale.
      </p>

      <div className="login-box">
        <input
          type="password"
          className="password-input"
          id="passwordInput"
          placeholder="Enter Password"
          autoComplete="off"
        />
        <button className="login-btn" id="loginBtn">
          Access Platform
        </button>
        <div className="error" id="errorMsg"></div>
        <div className="lockout-message" id="lockoutMsg" style={{ display: 'none' }}></div>
      </div>
    </div>
  );
}
