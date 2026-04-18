'use client';

/* ═══════════════════════════════════════════════════════
   MENU SCORE — "Your menu score. Locked in."
   Placed after How It Works section
═══════════════════════════════════════════════════════ */

export default function MenuScore() {
  return (
    <section className="menu-score">
      <div className="menu-score-inner">
        <span className="menu-score-eyebrow">Menu Quality</span>
        <h2 className="menu-score-title">Your menu score. Locked in.</h2>
        <div className="menu-score-rule" />

        <div className="menu-score-body">
          <p>
            Trakie&apos;s AI generates accurate product descriptions, ingredients, and allergens automatically during receiving. Every product enters your system complete, correct, and menu-ready.
          </p>
          <p>
            No extra work. No dedicated team. No more embarrassing gaps on your menu.
          </p>
        </div>

        <div className="menu-score-highlight">
          <div className="menu-score-stat">
            <span className="menu-score-from">2/5</span>
            <span className="menu-score-arrow">&rarr;</span>
            <span className="menu-score-to">4.9/5</span>
          </div>
          <p className="menu-score-cta">One dispensary went from 2/5 to 4.9/5. That&apos;s Trakie.</p>
        </div>
      </div>

      <style>{`
        .menu-score {
          padding: 100px 24px 80px;
          max-width: 700px;
          margin: 0 auto;
        }
        .menu-score-inner {
          text-align: center;
        }
        .menu-score-eyebrow {
          font-family: var(--font-outfit), sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #C9A961;
          display: block;
          margin-bottom: 16px;
        }
        .menu-score-title {
          font-family: var(--font-bodoni), 'Bodoni Moda', serif;
          font-size: clamp(26px, 5vw, 40px);
          font-weight: 400;
          color: #FAFAF8;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        .menu-score-rule {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #C9A961, transparent);
          margin: 24px auto 0;
        }
        .menu-score-body {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .menu-score-body p {
          font-family: var(--font-outfit), sans-serif;
          font-size: 20px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.85);
          text-align: center;
          max-width: 620px;
          margin: 0 auto;
        }
        .menu-score-highlight {
          margin-top: 48px;
          padding: 32px 24px;
          border-radius: 14px;
          background: rgba(74, 222, 128, 0.03);
          border: 1px solid rgba(74, 222, 128, 0.12);
        }
        .menu-score-stat {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 16px;
        }
        .menu-score-from {
          font-family: var(--font-bodoni), 'Bodoni Moda', serif;
          font-size: clamp(32px, 6vw, 48px);
          font-weight: 400;
          color: rgba(255, 255, 255, 0.25);
          letter-spacing: -0.5px;
        }
        .menu-score-arrow {
          font-size: 28px;
          color: rgba(201, 169, 97, 0.5);
        }
        .menu-score-to {
          font-family: var(--font-bodoni), 'Bodoni Moda', serif;
          font-size: clamp(32px, 6vw, 48px);
          font-weight: 400;
          color: #4ade80;
          letter-spacing: -0.5px;
        }
        .menu-score-cta {
          font-family: var(--font-outfit), sans-serif;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          line-height: 1.5;
        }

        @media (max-width: 480px) {
          .menu-score {
            padding: 72px 20px 56px;
          }
          .menu-score-body p {
            font-size: 17px;
          }
          .menu-score-highlight {
            padding: 24px 20px;
            margin-top: 36px;
          }
        }
      `}</style>
    </section>
  );
}
