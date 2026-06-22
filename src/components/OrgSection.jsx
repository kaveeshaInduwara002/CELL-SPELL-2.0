import React from 'react';
import { useScrollReveal } from './useScrollReveal';

export default function OrgSection() {
  const [headerRef, headerVisible] = useScrollReveal();
  const [card1Ref, card1Visible] = useScrollReveal();
  const [card2Ref, card2Visible] = useScrollReveal();

  return (
    <section className="org-section" id="organizers">
      <div className="container">
        <div
          ref={headerRef}
          className={`section-header reveal ${headerVisible ? 'visible' : ''}`}
        >
          <div className="section-label">ORGANIZED BY</div>
          <h2 className="section-title">Brought to you by</h2>
        </div>

        <div className="org-grid">
          {/* Card 1: SLIIT IEEE Student Branch */}
          <div
            ref={card1Ref}
            className={`org-card reveal reveal-delay-1 ${card1Visible ? 'visible' : ''}`}
            id="org-card-sliit-ieee"
          >
            <a
              href="https://ieeesliit.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="org-logo-link"
              aria-label="SLIIT IEEE Student Branch Website"
            >
              <div className="org-logo-container">
                <img
                  src="/logos/sliit-ieee-logo.png?v=2"
                  alt="SLIIT IEEE Student Branch Logo"
                  className="org-logo-img org-sliit-logo"
                />
              </div>
            </a>
            
            <div className="org-card-content">
              <span className="org-card-eyebrow sliit">Organized by</span>
              <h3 className="org-card-heading">SLIIT IEEE Student Branch</h3>
              <p className="org-card-body">
                The SLIIT IEEE Student Branch is dedicated to advancing technology
                for humanity — fostering innovation, promoting technological accessibility,
                and building the professional competencies of tomorrow's engineers. We
                bridge the gap between academia, research, and industry, empowering
                SLIIT undergraduates to become future leaders in science and technology
                across Sri Lanka and beyond.
              </p>
              <p className="org-card-tagline sliit">
                Shaping the future of technology — one student at a time.
              </p>
            </div>
          </div>

          {/* Card 2: IEEE EMBS Chapter */}
          <div
            ref={card2Ref}
            className={`org-card reveal reveal-delay-2 ${card2Visible ? 'visible' : ''}`}
            id="org-card-ieee-embs"
          >
            <div className="org-combined-logo-wrapper">
              <div className="org-logo-container org-combined-logo-container">
                <img
                  src="/logos/embs-sliit-combined.png?v=2"
                  alt="IEEE EMBS & SLIIT Student Branch Logo"
                  className="org-logo-img org-combined-logo"
                />
                <a
                  href="https://www.linkedin.com/in/embs-ieee-a152432b1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="org-overlay-link left"
                  aria-label="SLIIT IEEE Student Branch LinkedIn"
                />
                <a
                  href="https://www.embs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="org-overlay-link right"
                  aria-label="IEEE EMBS Website"
                />
              </div>
            </div>
            {/* Clear space & society name beneath the logo image as required by EMBS Brand Guidelines */}
            <div className="org-logo-society-name">
              IEEE Engineering Medicine & Biology Society
            </div>

            <div className="org-card-content">
              <span className="org-card-eyebrow embs">Technical Chapter</span>
              <h3 className="org-card-heading">
                IEEE Engineering Medicine & Biology Society
              </h3>
              <p className="org-card-body">
                IEEE EMBS is the world's largest international society of biomedical
                engineers, connecting over 10,000 members across 97 countries.
                Through IEEE EMBS, members gain access to cutting-edge knowledge,
                ideas, and the brightest minds shaping one of the fastest-growing
                fields in science — where engineering meets medicine and biology
                to transform human health.
              </p>
              <p className="org-card-tagline embs">
                Where biomedical innovation meets student ambition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
