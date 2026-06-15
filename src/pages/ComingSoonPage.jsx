import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { ArrowLeftIcon, LockIcon, Hourglass, Sparkles } from '../components/SVGIcons';

export default function ComingSoonPage() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    // Placeholder countdown — set a date ~30 days from now
    const target = new Date();
    target.setDate(target.getDate() + 30);
    target.setHours(0, 0, 0, 0);

    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, target - now);
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageTransition variant="helix">
      <section className="coming-soon-page" id="coming-soon">
        <div className="container">
          <Link to="/" className="back-link back-link--centered" id="cs-back-btn">
            <ArrowLeftIcon size={18} />
            <span>Back to Home</span>
          </Link>

          <div className="coming-soon__card">
            {/* Animated lock icon */}
            <div className="coming-soon__icon-wrapper">
              <div className="coming-soon__glow-ring" />
              <div className="coming-soon__glow-ring coming-soon__glow-ring--2" />
              <div className="coming-soon__lock">
                <LockIcon size={80} />
              </div>
              <div className="coming-soon__hourglass">
                <Hourglass size={48} />
              </div>
            </div>

            {/* Title with shimmer */}
            <h1 className="coming-soon__title">
              <span className="shimmer-text">Coming Soon</span>
            </h1>

            <p className="coming-soon__subtitle">
              The Industry Visit is being prepared. Something magical is about to happen...
            </p>

            {/* Countdown timer */}
            <div className="countdown" id="countdown-timer">
              <div className="countdown__item">
                <span className="countdown__number">{String(countdown.days).padStart(2, '0')}</span>
                <span className="countdown__label">Days</span>
              </div>
              <span className="countdown__separator">:</span>
              <div className="countdown__item">
                <span className="countdown__number">{String(countdown.hours).padStart(2, '0')}</span>
                <span className="countdown__label">Hours</span>
              </div>
              <span className="countdown__separator">:</span>
              <div className="countdown__item">
                <span className="countdown__number">{String(countdown.mins).padStart(2, '0')}</span>
                <span className="countdown__label">Mins</span>
              </div>
              <span className="countdown__separator">:</span>
              <div className="countdown__item">
                <span className="countdown__number">{String(countdown.secs).padStart(2, '0')}</span>
                <span className="countdown__label">Secs</span>
              </div>
            </div>

            {/* Decorative sparkles */}
            <div className="coming-soon__sparkles" aria-hidden="true">
              <Sparkles size={24} className="cs-sparkle cs-sparkle--1" />
              <Sparkles size={18} className="cs-sparkle cs-sparkle--2" />
              <Sparkles size={20} className="cs-sparkle cs-sparkle--3" />
            </div>

            <Link to="/" className="btn btn-secondary coming-soon__btn" id="cs-home-btn">
              <ArrowLeftIcon size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
