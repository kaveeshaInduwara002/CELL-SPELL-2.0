import React from 'react';
import { WavyDNADivider, CellSpellLogo, InstagramIcon, FacebookIcon, LinkedInIcon } from './SVGIcons';

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
            <a href="https://www.facebook.com/share/19AiX5Nnwx/?mibextid=wwXIfr" className="social-link" aria-label="Facebook" id="footer-facebook" target="_blank" rel="noopener noreferrer">
              <FacebookIcon size={18} />
            </a>
            <a href="https://www.instagram.com/embs_sliit?igsh=MTlia3o1ZG55MG1ydg==" className="social-link" aria-label="Instagram" id="footer-instagram" target="_blank" rel="noopener noreferrer">
              <InstagramIcon size={18} />
            </a>
            <a href="https://www.linkedin.com/in/embs-ieee-a152432b1" className="social-link" aria-label="LinkedIn" id="footer-linkedin" target="_blank" rel="noopener noreferrer">
              <LinkedInIcon size={18} />
            </a>
          </div>

          <p className="footer-text">
            Made by Kaveesha Induwara · © {year} Cell Spell 2.0
          </p>
        </div>
      </div>
    </footer>
  );
}
