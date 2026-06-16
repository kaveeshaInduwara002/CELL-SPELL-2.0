import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { CellSpellLogo } from '../components/SVGIcons';

export default function NotFoundPage() {
  return (
    <PageTransition variant="portal">
      <section className="not-found-page" id="not-found">
        <div className="container">
          <div className="not-found-card">
            <div className="not-found-glow" aria-hidden="true" />

            <div className="not-found-icon">
              <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                fill="none"
                className="svg-icon not-found-svg"
              >
                {/* Broken cell / portal */}
                <circle
                  cx="50" cy="50" r="40"
                  stroke="var(--neon-green)" strokeWidth="2" strokeDasharray="8 6"
                  opacity="0.4"
                  className="not-found-ring"
                />
                <circle
                  cx="50" cy="50" r="28"
                  stroke="var(--magic-emerald)" strokeWidth="1.5" strokeDasharray="5 5"
                  opacity="0.25"
                  className="not-found-ring not-found-ring--inner"
                />
                <text
                  x="50" y="55"
                  textAnchor="middle"
                  fontSize="28"
                  fontWeight="800"
                  fontFamily="var(--font-display)"
                  fill="var(--neon-green)"
                  opacity="0.8"
                >
                  404
                </text>
              </svg>
            </div>

            <h1 className="not-found-title">Portal Not Found</h1>
            <p className="not-found-subtitle">
              This pathway doesn't exist in our realm.
              The spell you're looking for may have been moved or dissolved.
            </p>

            <Link to="/" className="btn btn-primary" id="not-found-home-btn">
              <CellSpellLogo size={18} />
              Return to Home
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
