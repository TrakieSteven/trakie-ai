'use client';

export default function CompletionPhase() {
  return (
    <div className="cinematic-phase">
      <div className="completion-wrap">
        <h2 className="completion-heading">Receive Inventory in 60 Seconds</h2>
        <div className="completion-comparison">
          <div className="completion-stat">
            <span className="completion-stat-label">Manual</span>
            <span className="completion-stat-value manual">30–45 min</span>
          </div>
          <div className="completion-vs">vs</div>
          <div className="completion-stat">
            <span className="completion-stat-label">trakie.ai</span>
            <span className="completion-stat-value trakie">45 seconds</span>
          </div>
        </div>
        <p className="completion-summary">15 fields filled &middot; METRC synced &middot; Dutchie updated</p>
      </div>
    </div>
  );
}
