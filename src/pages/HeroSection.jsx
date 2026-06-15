import React from 'react';
import { Link } from 'react-router-dom';
import { CellBlob, DNAHelix, Sparkles } from '../components/SVGIcons';

export default function HeroSection() {
  return (
    <section className="hero" id="hero">
      {/* Animated SVG decorations */}
      <div className="hero-svg-field" aria-hidden="true">
        <div className="hero-dna hero-dna--left">
          <DNAHelix size={60} />
        </div>
        <div className="hero-dna hero-dna--right">
          <DNAHelix size={50} />
        </div>
        <div className="hero-cell hero-cell--1">
          <CellBlob size={40} />
        </div>
        <div className="hero-cell hero-cell--2">
          <CellBlob size={30} />
        </div>
        <div className="hero-sparkle hero-sparkle--1">
          <Sparkles size={28} />
        </div>
        <div className="hero-sparkle hero-sparkle--2">
          <Sparkles size={22} />
        </div>
        <div className="hero-sparkle hero-sparkle--3">
          <Sparkles size={18} />
        </div>
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="pulse-dot" />
          Registrations Now Open
        </div>

        <h1 className="hero-title">
          <span className="cell">Cell </span>
          <span className="spell">Spell</span>
          <span className="version">2.0</span>
        </h1>

        <p className="hero-subtitle">
          Dive into the enchanting world of <strong>biotechnology</strong> &{' '}
          <strong>bioinformatics</strong>. Experience hands-on industry exposure,
          cutting-edge workshops, and magical physical events that bridge
          biology and technology.
        </p>

        <div className="hero-buttons">
          <Link to="/register/workshop-1" className="btn btn-primary" id="hero-register-w1">
            <Sparkles size={18} />
            Register for Workshop 01
          </Link>
          <Link to="/register/workshop-2" className="btn btn-secondary" id="hero-register-w2">
            <Sparkles size={18} />
            Register for Workshop 02
          </Link>
          <Link to="/register/industry-visit" className="btn btn-disabled-link" id="hero-coming-soon">
            Coming Soon Event
          </Link>
        </div>
      </div>
    </section>
  );
}
