import React, { useEffect, useState } from 'react';

/**
 * Page transition wrapper — each registration page gets a unique
 * spell-cast entrance animation.
 *
 * Variants:
 *  - "particles"  → green particle burst converging
 *  - "mist"       → magical mist sweep from left
 *  - "helix"      → DNA helix dissolve
 *  - "portal"     → glowing circle expanding
 */
export default function PageTransition({ children, variant = 'portal' }) {
  const [phase, setPhase] = useState('enter'); // 'enter' | 'active'

  useEffect(() => {
    // Scroll to top on page entry
    window.scrollTo({ top: 0, behavior: 'instant' });

    const timer = setTimeout(() => {
      setPhase('active');
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`page-transition page-transition--${variant} page-transition--${phase}`}>
      {/* Overlay effect layer */}
      <div className="page-transition__overlay" aria-hidden="true">
        {variant === 'particles' && <ParticlesBurst />}
        {variant === 'portal' && <PortalRing />}
        {variant === 'mist' && <MistSweep />}
        {variant === 'helix' && <HelixDissolve />}
      </div>
      {/* Page content */}
      <div className="page-transition__content">
        {children}
      </div>
    </div>
  );
}

function ParticlesBurst() {
  return (
    <div className="pt-particles-burst">
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          className="pt-particle"
          style={{
            '--angle': `${(360 / 16) * i}deg`,
            '--delay': `${i * 0.03}s`,
            '--distance': `${80 + Math.random() * 120}px`,
          }}
        />
      ))}
    </div>
  );
}

function PortalRing() {
  return (
    <div className="pt-portal">
      <div className="pt-portal__ring" />
      <div className="pt-portal__ring pt-portal__ring--2" />
      <div className="pt-portal__ring pt-portal__ring--3" />
    </div>
  );
}

function MistSweep() {
  return (
    <div className="pt-mist">
      <div className="pt-mist__layer pt-mist__layer--1" />
      <div className="pt-mist__layer pt-mist__layer--2" />
    </div>
  );
}

function HelixDissolve() {
  return (
    <div className="pt-helix">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="pt-helix__rung"
          style={{ '--rung-delay': `${i * 0.06}s`, '--rung-y': `${12.5 * i}%` }}
        />
      ))}
    </div>
  );
}
