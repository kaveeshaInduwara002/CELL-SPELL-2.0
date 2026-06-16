import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link, useSearchParams } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import {
  AnimatedCheckmark,
  AnimatedTicketIcon,
  AnimatedCalendarLargeIcon,
  AnimatedLocationPinIcon,
  AnimatedInfoIcon,
  AnimatedDoorIcon,
} from '../components/SVGIcons';

// Simple seeded PRNG for deterministic shapes
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Count-up animation hook
function useCountUp(target, duration = 1500, delay = 800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const animate = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(eased * target));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return value;
}

// Parse registration number → numeric part
function parseRegNumber(regId) {
  if (!regId) return { prefix: 'RW', num: 1 };
  const match = regId.match(/^(R[A-Z])(\d+)$/);
  if (match) return { prefix: match[1], num: parseInt(match[2], 10) };
  return { prefix: 'RW', num: 1 };
}

// Floating geometric shapes background — deterministic
function FloatingShapes() {
  const rand = seededRandom(99);
  const shapes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    type: i % 3 === 0 ? 'hexagon' : i % 3 === 1 ? 'circle' : 'diamond',
    size: 20 + rand() * 40,
    left: rand() * 100,
    delay: rand() * 8,
    duration: 15 + rand() * 20,
    opacity: 0.03 + rand() * 0.06,
  }));

  return (
    <div className="success-floating-shapes" aria-hidden="true">
      {shapes.map((s) => (
        <svg
          key={s.id}
          className="floating-shape"
          width={s.size}
          height={s.size}
          viewBox="0 0 40 40"
          style={{
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            opacity: s.opacity,
          }}
        >
          {s.type === 'hexagon' && (
            <polygon
              points="20,2 36,11 36,29 20,38 4,29 4,11"
              stroke="#39ff14"
              strokeWidth="1"
              fill="none"
            />
          )}
          {s.type === 'circle' && (
            <circle cx="20" cy="20" r="16" stroke="#00ff88" strokeWidth="1" fill="none" />
          )}
          {s.type === 'diamond' && (
            <polygon
              points="20,2 38,20 20,38 2,20"
              stroke="#00ffc8"
              strokeWidth="1"
              fill="none"
            />
          )}
        </svg>
      ))}
    </div>
  );
}

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const state = location.state;

  // Try to recover registration reference from multiple sources
  const refFromUrl = searchParams.get('ref');
  const refFromStorage = typeof sessionStorage !== 'undefined'
    ? sessionStorage.getItem('lastRegistrationRef')
    : null;

  // If we have state, store the ref for resilience
  useEffect(() => {
    if (state?.registrationId) {
      sessionStorage.setItem('lastRegistrationRef', state.registrationId);
    }
  }, [state]);

  // Determine what we can show
  const hasFullState = !!state;
  const registrationRef = state?.registrationId || refFromUrl || refFromStorage;

  // Redirect to home only if we have absolutely nothing
  useEffect(() => {
    if (!hasFullState && !registrationRef) {
      navigate('/', { replace: true });
    }
  }, [hasFullState, registrationRef, navigate]);

  if (!hasFullState && !registrationRef) return null;

  const {
    registrationId = registrationRef || 'RW001',
    fullName = 'Student',
    eventName = 'Event',
    eventDate = 'TBA',
    eventVenue = 'TBA',
    eventDetails = 'More details will be shared via email.',
    eventPrefix = 'W',
  } = state || {
    registrationId: registrationRef,
  };

  const { prefix, num } = parseRegNumber(registrationId);

  return (
    <PageTransition variant="particles">
      <section className="success-page" id="success-page">
        <FloatingShapes />
        <div className="container">
          <div className="success-content">
            {/* Card 1: Checkmark + Success Message */}
            <SuccessCard delay={1} className="success-hero-card">
              <div className="success-checkmark-wrapper">
                <AnimatedCheckmark size={100} />
              </div>
              <h1 className="success-title">Registration Successful!</h1>
              <p className="success-greeting">
                Welcome, {fullName}!
              </p>
            </SuccessCard>

            {/* Card 2: Registration Number */}
            <SuccessCard delay={2} className="success-reg-card">
              <div className="success-card-icon">
                <AnimatedTicketIcon size={52} />
              </div>
              <div className="success-card-label">Your Registration Number</div>
              <CountUpRegNumber prefix={prefix} targetNum={num} />
            </SuccessCard>

            {/* Card 3: Event Date */}
            <SuccessCard delay={3}>
              <div className="success-card-icon">
                <AnimatedCalendarLargeIcon size={48} />
              </div>
              <div className="success-card-label">Event Date</div>
              <div className="success-card-value">{eventDate}</div>
            </SuccessCard>

            {/* Card 4: Venue */}
            <SuccessCard delay={4}>
              <div className="success-card-icon">
                <AnimatedLocationPinIcon size={48} />
              </div>
              <div className="success-card-label">Venue</div>
              <div className="success-card-value">{eventVenue}</div>
            </SuccessCard>

            {/* Card 5: Event Details */}
            <SuccessCard delay={5}>
              <div className="success-card-icon">
                <AnimatedInfoIcon size={48} />
              </div>
              <div className="success-card-label">Event Details</div>
              <div className="success-card-value success-card-value--small">
                {eventDetails || `You are registered for ${eventName}. Further details will be shared via email.`}
              </div>
            </SuccessCard>

            {/* Close Portal Button */}
            <div className="success-card stagger-6">
              <Link to="/" className="btn btn-close-portal" id="close-portal-btn">
                <span className="close-portal-ripple" />
                <AnimatedDoorIcon size={22} />
                <span>Close Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

// Stagger-animated card wrapper
function SuccessCard({ children, delay = 1, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 350);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`success-card stagger-${delay} ${visible ? 'stagger-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

// Count-up registration number display
function CountUpRegNumber({ prefix, targetNum }) {
  const count = useCountUp(targetNum, 1200, 1200);
  const display = `${prefix}${String(count).padStart(3, '0')}`;

  return (
    <div className="success-reg-number">
      <span className="reg-number-text">{display}</span>
    </div>
  );
}
