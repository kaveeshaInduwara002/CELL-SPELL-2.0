import React from 'react';
import { WavyDNADivider, CellSpellLogo, GitHubIcon, TwitterIcon, InstagramIcon } from './SVGIcons';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footer-divider-svg">
        <WavyDNADivider />
      </div>

      <div className="container">
        <div className="footer-content">
          <div className="footer-brand-group">
            <CellSpellLogo size={28} />
            <span className="footer-brand">Cell Spell 2.0</span>
          </div>

          <p className="footer-tagline">
            Where Biology Meets Dark Magic
          </p>

          <div className="footer-socials">
            <a href="#" className="social-link" aria-label="GitHub" id="footer-github">
              <GitHubIcon size={18} />
            </a>
            <a href="#" className="social-link" aria-label="Twitter" id="footer-twitter">
              <TwitterIcon size={18} />
            </a>
            <a href="#" className="social-link" aria-label="Instagram" id="footer-instagram">
              <InstagramIcon size={18} />
            </a>
          </div>

          <p className="footer-text">
            Made with <span className="heart">♥</span> · © {year} Cell Spell 2.0
          </p>
        </div>
      </div>
    </footer>
  );
}
