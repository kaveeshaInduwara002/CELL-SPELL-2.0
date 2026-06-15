import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CellSpellLogo } from './SVGIcons';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  const scrollToEvents = (e) => {
    e.preventDefault();
    if (isHome) {
      const el = document.getElementById('events');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container">
        <Link to="/" className="nav-brand" id="nav-logo">
          <CellSpellLogo size={32} className="nav-logo-svg" />
          <span className="nav-brand-text">
            Cell Spell<span className="nav-brand-version">2.0</span>
          </span>
        </Link>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li>
            <Link
              to="/"
              className={`nav-link ${isHome ? 'active' : ''}`}
              id="nav-home"
            >
              Home
            </Link>
          </li>
          {isHome ? (
            <li>
              <a
                href="#events"
                className="nav-link"
                onClick={scrollToEvents}
                id="nav-events"
              >
                Events
              </a>
            </li>
          ) : (
            <li>
              <Link to="/" className="nav-link" id="nav-events">
                Events
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/register/workshop-1"
              className={`nav-link ${location.pathname === '/register/workshop-1' ? 'active' : ''}`}
              id="nav-workshop-1"
            >
              Workshop 01
            </Link>
          </li>
          <li>
            <Link
              to="/register/workshop-2"
              className={`nav-link ${location.pathname === '/register/workshop-2' ? 'active' : ''}`}
              id="nav-workshop-2"
            >
              Workshop 02
            </Link>
          </li>
        </ul>

        <button
          className={`nav-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          id="nav-toggle-btn"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="nav-overlay"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}
