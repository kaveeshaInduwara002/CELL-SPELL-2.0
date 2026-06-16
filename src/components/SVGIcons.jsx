import React from 'react';

/* =============================================
   Cell Spell 2.0 — SVG Icon Library
   All inline SVGs with neon green + black palette
   Support CSS filter: drop-shadow for glow effects
   ============================================= */

// ---------- DNA Helix ----------
export function DNAHelix({ size = 48, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`svg-icon svg-dna ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M20 4C20 4 44 16 44 32C44 48 20 60 20 60"
        stroke="url(#dna-grad-1)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M44 4C44 4 20 16 20 32C20 48 44 60 44 60"
        stroke="url(#dna-grad-2)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Rungs */}
      {[12, 20, 28, 36, 44, 52].map((y, i) => (
        <line
          key={i}
          x1={24 + Math.sin((y / 60) * Math.PI * 2) * 4}
          y1={y}
          x2={40 - Math.sin((y / 60) * Math.PI * 2) * 4}
          y2={y}
          stroke="#39ff14"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={0.5 + (i % 2) * 0.3}
        />
      ))}
      <defs>
        <linearGradient id="dna-grad-1" x1="20" y1="4" x2="20" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#39ff14" />
          <stop offset="0.5" stopColor="#00ff88" />
          <stop offset="1" stopColor="#39ff14" />
        </linearGradient>
        <linearGradient id="dna-grad-2" x1="44" y1="4" x2="44" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00ffc8" />
          <stop offset="0.5" stopColor="#22c55e" />
          <stop offset="1" stopColor="#00ffc8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ---------- Cell Blob Mascot ----------
export function CellBlob({ size = 64, className = '', animated = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={`svg-icon svg-cell-blob ${className} ${animated ? 'animated' : ''}`}
      aria-hidden="true"
    >
      {/* Outer membrane */}
      <ellipse
        cx="40"
        cy="40"
        rx="30"
        ry="28"
        fill="url(#cell-fill)"
        stroke="#39ff14"
        strokeWidth="1.5"
        opacity="0.9"
      />
      {/* Nucleus */}
      <circle cx="38" cy="38" r="10" fill="url(#nucleus-fill)" stroke="#22c55e" strokeWidth="1" />
      {/* Nucleolus */}
      <circle cx="36" cy="36" r="3.5" fill="#166534" opacity="0.8" />
      {/* Organelles */}
      <ellipse cx="52" cy="32" rx="5" ry="3" fill="#15803d" opacity="0.5" transform="rotate(-20 52 32)" />
      <ellipse cx="28" cy="52" rx="4" ry="2.5" fill="#15803d" opacity="0.4" transform="rotate(30 28 52)" />
      <circle cx="50" cy="50" r="2.5" fill="#14532d" opacity="0.4" />
      {/* Highlight / shine */}
      <ellipse cx="30" cy="26" rx="8" ry="4" fill="white" opacity="0.15" transform="rotate(-30 30 26)" />
      {/* Cute eyes */}
      <circle cx="34" cy="34" r="2" fill="#0a160a" />
      <circle cx="44" cy="33" r="2" fill="#0a160a" />
      <circle cx="35" cy="33" r="0.8" fill="white" />
      <circle cx="45" cy="32" r="0.8" fill="white" />
      {/* Smile */}
      <path d="M36 40 Q39 44 42 40" stroke="#0a160a" strokeWidth="1" fill="none" strokeLinecap="round" />
      <defs>
        <radialGradient id="cell-fill" cx="0.35" cy="0.35" r="0.65">
          <stop stopColor="#22c55e" stopOpacity="0.3" />
          <stop offset="0.6" stopColor="#15803d" stopOpacity="0.2" />
          <stop offset="1" stopColor="#0a120a" stopOpacity="0.1" />
        </radialGradient>
        <radialGradient id="nucleus-fill" cx="0.4" cy="0.4" r="0.6">
          <stop stopColor="#22c55e" stopOpacity="0.4" />
          <stop offset="1" stopColor="#14532d" stopOpacity="0.6" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ---------- Leaf Motif ----------
export function LeafMotif({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={`svg-icon svg-leaf ${className}`}
      aria-hidden="true"
    >
      <path
        d="M24 44C24 44 8 34 8 20C8 10 16 4 24 4C32 4 40 10 40 20C40 34 24 44 24 44Z"
        fill="url(#leaf-fill)"
        stroke="#39ff14"
        strokeWidth="1.5"
      />
      {/* Veins */}
      <path d="M24 10V38" stroke="#39ff14" strokeWidth="1" opacity="0.5" />
      <path d="M24 18L16 14" stroke="#22c55e" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
      <path d="M24 18L32 14" stroke="#22c55e" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
      <path d="M24 26L14 22" stroke="#22c55e" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
      <path d="M24 26L34 22" stroke="#22c55e" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
      <path d="M24 34L18 31" stroke="#22c55e" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      <path d="M24 34L30 31" stroke="#22c55e" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      <defs>
        <linearGradient id="leaf-fill" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22c55e" stopOpacity="0.15" />
          <stop offset="1" stopColor="#14532d" stopOpacity="0.08" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ---------- Magical Sparkles ----------
export function Sparkles({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={`svg-icon svg-sparkles ${className}`}
      aria-hidden="true"
    >
      {/* Main star */}
      <path
        d="M20 4L22.5 16L34 18L22.5 20L20 32L17.5 20L6 18L17.5 16Z"
        fill="#39ff14"
        opacity="0.9"
      />
      {/* Small stars */}
      <path d="M8 8L9 12L12 10L9 11Z" fill="#39ff14" opacity="0.5" />
      <path d="M32 6L33 10L36 8L33 9Z" fill="#00ff88" opacity="0.4" />
      <path d="M10 30L11 33L14 32L11 32Z" fill="#00ffc8" opacity="0.4" />
      <path d="M34 28L34.5 31L37 30L34.5 30Z" fill="#39ff14" opacity="0.3" />
      {/* Dots */}
      <circle cx="6" cy="20" r="1" fill="#39ff14" opacity="0.6" />
      <circle cx="34" cy="36" r="1" fill="#00ff88" opacity="0.5" />
    </svg>
  );
}

// ---------- Potion Flask ----------
export function PotionFlask({ size = 48, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      className={`svg-icon svg-flask ${className}`}
      aria-hidden="true"
    >
      {/* Neck */}
      <rect x="22" y="6" width="12" height="14" rx="2" stroke="#39ff14" strokeWidth="1.5" fill="none" />
      {/* Cork */}
      <rect x="23" y="4" width="10" height="4" rx="1.5" fill="#166534" stroke="#22c55e" strokeWidth="0.8" />
      {/* Body */}
      <path
        d="M22 20L12 36C10 40 12 48 20 50H36C44 48 46 40 44 36L34 20"
        fill="url(#flask-fill)"
        stroke="#39ff14"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Liquid */}
      <path
        d="M16 38C16 38 22 36 28 38C34 40 40 38 40 38L44 36C44 36 44 46 36 49H20C12 46 12 36 12 36Z"
        fill="#39ff14"
        opacity="0.2"
      />
      {/* Bubbles */}
      <circle cx="24" cy="42" r="2" fill="#39ff14" opacity="0.4" />
      <circle cx="32" cy="40" r="1.5" fill="#00ff88" opacity="0.3" />
      <circle cx="28" cy="44" r="1" fill="#39ff14" opacity="0.5" />
      <defs>
        <linearGradient id="flask-fill" x1="28" y1="20" x2="28" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0a120a" stopOpacity="0.6" />
          <stop offset="1" stopColor="#132613" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ---------- Microscope ----------
export function Microscope({ size = 48, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      className={`svg-icon svg-microscope ${className}`}
      aria-hidden="true"
    >
      {/* Eyepiece */}
      <rect x="24" y="4" width="8" height="6" rx="2" stroke="#39ff14" strokeWidth="1.5" fill="none" />
      {/* Tube */}
      <rect x="26" y="10" width="4" height="18" rx="1" fill="#166534" stroke="#22c55e" strokeWidth="1" />
      {/* Objective */}
      <circle cx="28" cy="30" r="4" stroke="#39ff14" strokeWidth="1.5" fill="none" />
      <circle cx="28" cy="30" r="2" fill="#39ff14" opacity="0.3" />
      {/* Stage */}
      <rect x="16" y="34" width="24" height="3" rx="1" fill="#15803d" stroke="#22c55e" strokeWidth="0.8" />
      {/* Arm */}
      <path d="M34 16L40 20L40 36" stroke="#39ff14" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Base */}
      <path d="M14 48H42C42 48 42 42 36 40H20C14 42 14 48 14 48Z" fill="#0d1a0d" stroke="#39ff14" strokeWidth="1.5" />
      {/* Focus knob */}
      <circle cx="40" cy="28" r="3" fill="#132613" stroke="#22c55e" strokeWidth="1" />
    </svg>
  );
}

// ---------- Lock Icon (for Coming Soon) ----------
export function LockIcon({ size = 64, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      className={`svg-icon svg-lock ${className}`}
      aria-hidden="true"
    >
      {/* Lock body */}
      <rect
        x="16"
        y="32"
        width="40"
        height="30"
        rx="6"
        fill="url(#lock-body-fill)"
        stroke="#39ff14"
        strokeWidth="2"
      />
      {/* Shackle */}
      <path
        d="M24 32V22C24 15.4 29.4 10 36 10C42.6 10 48 15.4 48 22V32"
        stroke="#39ff14"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Keyhole */}
      <circle cx="36" cy="44" r="4" fill="#39ff14" opacity="0.6" />
      <rect x="34.5" y="47" width="3" height="6" rx="1" fill="#39ff14" opacity="0.4" />
      {/* Glow ring */}
      <circle
        cx="36"
        cy="44"
        r="8"
        stroke="#39ff14"
        strokeWidth="0.8"
        opacity="0.2"
        fill="none"
      />
      <defs>
        <linearGradient id="lock-body-fill" x1="36" y1="32" x2="36" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#132613" />
          <stop offset="1" stopColor="#0a120a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ---------- Hourglass Icon ----------
export function Hourglass({ size = 64, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`svg-icon svg-hourglass ${className}`}
      aria-hidden="true"
    >
      {/* Top frame */}
      <rect x="14" y="6" width="36" height="4" rx="2" fill="#15803d" stroke="#39ff14" strokeWidth="1" />
      {/* Bottom frame */}
      <rect x="14" y="54" width="36" height="4" rx="2" fill="#15803d" stroke="#39ff14" strokeWidth="1" />
      {/* Glass */}
      <path
        d="M18 10L18 24C18 28 24 32 32 32C24 32 18 36 18 40L18 54"
        stroke="#39ff14"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M46 10L46 24C46 28 40 32 32 32C40 32 46 36 46 40L46 54"
        stroke="#39ff14"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Sand top */}
      <path d="M22 14H42V22C42 26 38 30 32 30C26 30 22 26 22 22Z" fill="#39ff14" opacity="0.12" />
      {/* Sand bottom */}
      <path d="M22 50H42V42C42 38 38 34 32 34C26 34 22 38 22 42Z" fill="#39ff14" opacity="0.2" />
      {/* Falling sand */}
      <line x1="32" y1="30" x2="32" y2="34" stroke="#39ff14" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
    </svg>
  );
}

// ---------- Form Field Icons (small, 20px) ----------
export function PersonIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`svg-field-icon ${className}`}>
      <circle cx="12" cy="8" r="4" stroke="#39ff14" strokeWidth="1.5" />
      <path d="M4 20C4 16.5 7.5 14 12 14C16.5 14 20 16.5 20 20" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IDCardIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`svg-field-icon ${className}`}>
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="#39ff14" strokeWidth="1.5" />
      <circle cx="8" cy="11" r="2.5" stroke="#39ff14" strokeWidth="1" />
      <line x1="14" y1="9" x2="20" y2="9" stroke="#39ff14" strokeWidth="1" strokeLinecap="round" />
      <line x1="14" y1="12" x2="19" y2="12" stroke="#39ff14" strokeWidth="1" strokeLinecap="round" />
      <line x1="5" y1="17" x2="11" y2="17" stroke="#39ff14" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function EmailIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`svg-field-icon ${className}`}>
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="#39ff14" strokeWidth="1.5" />
      <path d="M2 7L12 14L22 7" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PhoneIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`svg-field-icon ${className}`}>
      <path
        d="M5 4H9L11 9L8.5 10.5C9.5 13 11 14.5 13.5 15.5L15 13L20 15V19C20 20.1 19.1 21 18 21C9.7 21 3 14.3 3 6C3 4.9 3.9 4 5 4Z"
        stroke="#39ff14"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GraduationIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`svg-field-icon ${className}`}>
      <path d="M2 10L12 5L22 10L12 15Z" stroke="#39ff14" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 12V17C6 17 9 20 12 20C15 20 18 17 18 17V12" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="10" x2="22" y2="17" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CalendarIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`svg-field-icon ${className}`}>
      <rect x="3" y="4" width="18" height="18" rx="3" stroke="#39ff14" strokeWidth="1.5" />
      <line x1="3" y1="10" x2="21" y2="10" stroke="#39ff14" strokeWidth="1.5" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function GenderIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`svg-field-icon ${className}`}>
      <circle cx="9" cy="12" r="4" stroke="#39ff14" strokeWidth="1.5" fill="none" />
      <line x1="12" y1="9" x2="17" y2="4" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="14,4 17,4 17,7" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="9" y1="16" x2="9" y2="21" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="19" x2="11" y2="19" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ---------- Title / Salutation Icon ----------
export function TitleIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`svg-field-icon ${className}`}>
      <circle cx="12" cy="7" r="4" stroke="#39ff14" strokeWidth="1.5" />
      <path d="M4 21C4 17 7.5 14 12 14C16.5 14 20 17 20 21" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 3L12 1L15 3" stroke="#39ff14" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

// ---------- Field Validation Icons ----------
export function FieldTickIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`svg-field-icon field-validation-icon ${className}`}>
      <circle cx="12" cy="12" r="10" stroke="#4ade80" strokeWidth="1.5" className="validation-circle" />
      <path d="M7 12.5L10.5 16L17 9" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="validation-check" />
    </svg>
  );
}

export function FieldCrossIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`svg-field-icon field-validation-icon ${className}`}>
      <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="1.5" className="validation-circle" />
      <path d="M8 8L16 16M16 8L8 16" stroke="#f87171" strokeWidth="2" strokeLinecap="round" className="validation-cross" />
    </svg>
  );
}

// ---------- Animated Success Page Icons ----------
export function AnimatedCheckmark({ size = 80, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={`svg-icon animated-checkmark ${className}`}>
      <circle
        cx="40" cy="40" r="36"
        stroke="url(#check-grad)" strokeWidth="3"
        className="checkmark-circle"
        fill="none"
      />
      <path
        d="M24 40L35 52L56 28"
        stroke="#39ff14" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        className="checkmark-path"
        fill="none"
      />
      {/* Glow ring */}
      <circle cx="40" cy="40" r="38" stroke="#39ff14" strokeWidth="1" opacity="0.15" fill="none" className="checkmark-glow-ring" />
      <defs>
        <linearGradient id="check-grad" x1="4" y1="4" x2="76" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#39ff14" />
          <stop offset="0.5" stopColor="#00ff88" />
          <stop offset="1" stopColor="#39ff14" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AnimatedTicketIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" className={`svg-icon animated-ticket ${className}`}>
      {/* Ticket body */}
      <rect x="4" y="14" width="48" height="28" rx="4" stroke="#39ff14" strokeWidth="2" fill="none" className="ticket-body" />
      {/* Notches */}
      <path d="M18 14V12C18 10.9 18.9 10 20 10H36C37.1 10 38 10.9 38 12V14" stroke="#39ff14" strokeWidth="1.5" fill="none" className="ticket-top" />
      {/* Perforation line */}
      <line x1="18" y1="14" x2="18" y2="42" stroke="#39ff14" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      {/* Star badge */}
      <path d="M34 25L36 29L40 29.5L37 32.5L38 36.5L34 34.5L30 36.5L31 32.5L28 29.5L32 29Z" fill="#39ff14" opacity="0.3" stroke="#39ff14" strokeWidth="1" className="ticket-star" />
      {/* ID lines */}
      <line x1="8" y1="22" x2="14" y2="22" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="8" y1="28" x2="14" y2="28" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="8" y1="34" x2="12" y2="34" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function AnimatedCalendarLargeIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" className={`svg-icon animated-calendar ${className}`}>
      <rect x="6" y="10" width="44" height="38" rx="5" stroke="#39ff14" strokeWidth="2" fill="none" className="calendar-body" />
      <line x1="6" y1="22" x2="50" y2="22" stroke="#39ff14" strokeWidth="1.5" className="calendar-divider" />
      <line x1="18" y1="6" x2="18" y2="14" stroke="#39ff14" strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="6" x2="38" y2="14" stroke="#39ff14" strokeWidth="2" strokeLinecap="round" />
      {/* Date cells */}
      <rect x="14" y="28" width="8" height="6" rx="1.5" fill="#39ff14" opacity="0.2" />
      <rect x="24" y="28" width="8" height="6" rx="1.5" fill="#39ff14" opacity="0.15" />
      <rect x="34" y="28" width="8" height="6" rx="1.5" fill="#39ff14" opacity="0.1" />
      <rect x="14" y="38" width="8" height="6" rx="1.5" fill="#39ff14" opacity="0.1" />
      <rect x="24" y="38" width="8" height="6" rx="1.5" fill="#39ff14" opacity="0.25" className="calendar-active-date" />
    </svg>
  );
}

export function AnimatedLocationPinIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" className={`svg-icon animated-pin ${className}`}>
      <path
        d="M28 6C18.6 6 11 13.6 11 23C11 35 28 50 28 50C28 50 45 35 45 23C45 13.6 37.4 6 28 6Z"
        stroke="#39ff14" strokeWidth="2" fill="none" className="pin-body"
      />
      <circle cx="28" cy="23" r="7" stroke="#39ff14" strokeWidth="1.5" fill="none" className="pin-dot" />
      <circle cx="28" cy="23" r="3" fill="#39ff14" opacity="0.3" />
      {/* Pulse rings */}
      <circle cx="28" cy="23" r="10" stroke="#39ff14" strokeWidth="0.8" opacity="0.15" fill="none" className="pin-pulse" />
    </svg>
  );
}

export function AnimatedInfoIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" className={`svg-icon animated-info ${className}`}>
      <circle cx="28" cy="28" r="22" stroke="#39ff14" strokeWidth="2" fill="none" className="info-circle" />
      <circle cx="28" cy="16" r="2.5" fill="#39ff14" opacity="0.8" />
      <line x1="28" y1="24" x2="28" y2="42" stroke="#39ff14" strokeWidth="3" strokeLinecap="round" className="info-line" />
      {/* Decorative dots */}
      <circle cx="28" cy="28" r="25" stroke="#39ff14" strokeWidth="0.5" opacity="0.1" fill="none" />
    </svg>
  );
}

export function AnimatedDoorIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`svg-icon animated-door ${className}`}>
      {/* Door frame */}
      <rect x="3" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Door opening */}
      <path d="M17 4L21 7V17L17 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="door-open" />
      {/* Door handle */}
      <circle cx="14" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
      {/* Arrow out */}
      <path d="M19 12H23M23 12L21 10M23 12L21 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="door-arrow" />
    </svg>
  );
}


export function CellSpellLogo({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={`svg-icon svg-logo ${className}`}
      aria-label="Cell Spell Logo"
    >
      {/* Outer cell membrane */}
      <circle cx="24" cy="24" r="20" stroke="url(#logo-ring)" strokeWidth="2" fill="none" />
      {/* Inner glow ring */}
      <circle cx="24" cy="24" r="16" stroke="#39ff14" strokeWidth="0.5" opacity="0.3" fill="none" />
      {/* DNA strands */}
      <path
        d="M16 12C16 12 32 18 32 24C32 30 16 36 16 36"
        stroke="#39ff14"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M32 12C32 12 16 18 16 24C16 30 32 36 32 36"
        stroke="#00ff88"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Center nucleus */}
      <circle cx="24" cy="24" r="4" fill="#39ff14" opacity="0.25" />
      <circle cx="24" cy="24" r="2" fill="#39ff14" opacity="0.5" />
      {/* Sparkle dots */}
      <circle cx="10" cy="16" r="1" fill="#39ff14" opacity="0.6" />
      <circle cx="38" cy="32" r="1" fill="#00ff88" opacity="0.5" />
      <circle cx="14" cy="38" r="0.8" fill="#00ffc8" opacity="0.4" />
      <defs>
        <linearGradient id="logo-ring" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#39ff14" />
          <stop offset="0.5" stopColor="#00ff88" />
          <stop offset="1" stopColor="#39ff14" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ---------- Factory / Industry Icon ----------
export function FactoryIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" className={`svg-icon ${className}`} aria-hidden="true">
      {/* Building */}
      <rect x="6" y="28" width="44" height="22" rx="2" fill="#0d1a0d" stroke="#39ff14" strokeWidth="1.5" />
      {/* Smokestacks */}
      <rect x="12" y="14" width="6" height="14" rx="1" fill="#132613" stroke="#22c55e" strokeWidth="1" />
      <rect x="24" y="8" width="6" height="20" rx="1" fill="#132613" stroke="#22c55e" strokeWidth="1" />
      {/* Smoke */}
      <circle cx="15" cy="10" r="2" fill="#39ff14" opacity="0.15" />
      <circle cx="13" cy="7" r="1.5" fill="#39ff14" opacity="0.1" />
      <circle cx="27" cy="4" r="2" fill="#39ff14" opacity="0.15" />
      {/* Windows */}
      <rect x="12" y="34" width="5" height="5" rx="1" fill="#39ff14" opacity="0.2" />
      <rect x="22" y="34" width="5" height="5" rx="1" fill="#39ff14" opacity="0.2" />
      <rect x="32" y="34" width="5" height="5" rx="1" fill="#39ff14" opacity="0.2" />
      {/* Door */}
      <rect x="40" y="38" width="6" height="12" rx="1" fill="#39ff14" opacity="0.15" stroke="#39ff14" strokeWidth="0.8" />
    </svg>
  );
}

// ---------- Code / Workshop Icon ----------
export function CodeIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" className={`svg-icon ${className}`} aria-hidden="true">
      {/* Terminal window */}
      <rect x="4" y="8" width="48" height="40" rx="5" fill="#0d1a0d" stroke="#39ff14" strokeWidth="1.5" />
      {/* Title bar */}
      <rect x="4" y="8" width="48" height="10" rx="5" fill="#132613" />
      <rect x="4" y="14" width="48" height="4" fill="#132613" />
      {/* Traffic lights */}
      <circle cx="14" cy="13" r="2" fill="#f87171" opacity="0.7" />
      <circle cx="22" cy="13" r="2" fill="#fbbf24" opacity="0.7" />
      <circle cx="30" cy="13" r="2" fill="#4ade80" opacity="0.7" />
      {/* Code lines */}
      <text x="12" y="30" fontFamily="monospace" fontSize="8" fill="#39ff14" opacity="0.9">{'>'} _</text>
      <line x1="12" y1="36" x2="32" y2="36" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="12" y1="42" x2="38" y2="42" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

// ---------- Wavy DNA Divider ----------
export function WavyDNADivider({ className = '' }) {
  return (
    <svg
      width="100%"
      height="40"
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={`svg-divider ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0 20 Q100 5 200 20 T400 20 T600 20 T800 20 T1000 20 T1200 20"
        stroke="url(#divider-grad)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M0 20 Q100 35 200 20 T400 20 T600 20 T800 20 T1000 20 T1200 20"
        stroke="url(#divider-grad-2)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
      {/* Connection dots */}
      {[100, 300, 500, 700, 900, 1100].map((x, i) => (
        <circle key={i} cx={x} cy="20" r="2" fill="#39ff14" opacity={0.3 + (i % 2) * 0.2} />
      ))}
      <defs>
        <linearGradient id="divider-grad" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="transparent" />
          <stop offset="0.2" stopColor="#39ff14" />
          <stop offset="0.8" stopColor="#00ff88" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="divider-grad-2" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="transparent" />
          <stop offset="0.3" stopColor="#00ffc8" />
          <stop offset="0.7" stopColor="#22c55e" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ---------- Social Icons ----------
export function FacebookIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function LinkedInIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ---------- Arrow / Back Icon ----------
export function ArrowLeftIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M19 12H5M5 12L12 5M5 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
