import React, { useState, useEffect, useCallback } from 'react';

/**
 * Reusable countdown timer component.
 * Displays days / hours / minutes / seconds until scheduledAt.
 * Timezone-aware: scheduledAt is stored as UTC, displayed in visitor's local time.
 *
 * @param {string} scheduledAt - ISO 8601 timestamp (UTC) for when form opens
 * @param {function} onComplete - Callback fired when countdown reaches zero
 */
export default function CountdownTimer({ scheduledAt, onComplete }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [completed, setCompleted] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    if (!scheduledAt) return { days: 0, hours: 0, mins: 0, secs: 0 };

    const target = new Date(scheduledAt);
    const now = new Date();
    const diff = Math.max(0, target - now);

    if (diff === 0 && !completed) {
      setCompleted(true);
      if (onComplete) onComplete();
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      mins: Math.floor((diff / (1000 * 60)) % 60),
      secs: Math.floor((diff / 1000) % 60),
    };
  }, [scheduledAt, onComplete, completed]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  // Format open time in Sri Lanka timezone (Asia/Colombo, UTC+5:30)
  const localOpenDate = scheduledAt
    ? new Date(scheduledAt).toLocaleString('en-LK', {
        timeZone: 'Asia/Colombo',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
        hour12: true,
      })
    : null;

  return (
    <div className="countdown-timer-wrapper">
      <div className="countdown" id="countdown-timer">
        <div className="countdown__item">
          <span className="countdown__number">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="countdown__label">Days</span>
        </div>
        <span className="countdown__separator">:</span>
        <div className="countdown__item">
          <span className="countdown__number">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="countdown__label">Hours</span>
        </div>
        <span className="countdown__separator">:</span>
        <div className="countdown__item">
          <span className="countdown__number">{String(timeLeft.mins).padStart(2, '0')}</span>
          <span className="countdown__label">Mins</span>
        </div>
        <span className="countdown__separator">:</span>
        <div className="countdown__item">
          <span className="countdown__number">{String(timeLeft.secs).padStart(2, '0')}</span>
          <span className="countdown__label">Secs</span>
        </div>
      </div>
      {localOpenDate && (
        <p className="countdown-opens-at">
          Opens: <strong>{localOpenDate}</strong>
        </p>
      )}
    </div>
  );
}
