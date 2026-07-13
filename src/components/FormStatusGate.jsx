import React from 'react';
import { Link } from 'react-router-dom';
import useFormConfig from '../hooks/useFormConfig';
import CountdownTimer from './CountdownTimer';
import { LockIcon, Hourglass, Sparkles, ArrowLeftIcon } from './SVGIcons';
import { supabase } from '../lib/supabaseClient';

/**
 * Public-facing form gate component.
 * Wraps a registration form and renders the appropriate state:
 *   - open: renders children (the form)
 *   - closed: renders styled "Registration Closed" card
 *   - coming_soon: renders countdown timer + event info
 *
 * Updates in real-time via Supabase Realtime (through useFormConfig).
 *
 * @param {string} formKey - 'workshop' | 'industry_visit'
 * @param {React.ReactNode} children - The registration form to render when open
 */
export default function FormStatusGate({ formKey, children }) {
  const { config, loading, refetch } = useFormConfig(formKey);

  const handleCountdownComplete = async () => {
    try {
      await supabase.rpc('check_scheduled_opens');
    } catch (err) {
      console.error('Failed to trigger scheduled open:', err);
    } finally {
      refetch();
    }
  };

  if (loading) {
    return (
      <div className="form-gate-loading">
        <div className="btn-spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        <span>Loading...</span>
      </div>
    );
  }

  const status = config?.status || 'open';

  if (status === 'open') {
    return <>{children}</>;
  }

  if (status === 'closed') {
    return <ClosedView config={config} />;
  }

  if (status === 'coming_soon') {
    return <ComingSoonView config={config} onCountdownComplete={handleCountdownComplete} />;
  }

  return <>{children}</>;
}

function ClosedView({ config }) {
  const closedAt = config?.updated_at
    ? new Date(config.updated_at).toLocaleString('en-LK', {
        timeZone: 'Asia/Colombo',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : null;

  return (
    <div className="form-gate-closed" id="registration-closed">
      <div className="form-gate-card">
        <div className="form-gate-icon-wrapper">
          <div className="form-gate-glow-ring" />
          <div className="form-gate-glow-ring form-gate-glow-ring--2" />
          <LockIcon size={72} />
        </div>

        <h2 className="form-gate-title">Registration Closed</h2>
        <p className="form-gate-subtitle">
          Registration for this event has ended. Thank you for your interest!
        </p>

        {closedAt && (
          <div className="form-gate-timestamp">
            <span>Closed on: {closedAt}</span>
          </div>
        )}

        <Link to="/" className="btn btn-secondary form-gate-btn" id="closed-home-btn">
          <ArrowLeftIcon size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function ComingSoonView({ config, onCountdownComplete }) {
  return (
    <div className="form-gate-coming-soon" id="registration-coming-soon">
      <div className="form-gate-card">
        <div className="form-gate-icon-wrapper">
          <div className="form-gate-glow-ring" />
          <div className="form-gate-glow-ring form-gate-glow-ring--2" />
          <div className="form-gate-lock-float">
            <Hourglass size={72} />
          </div>
        </div>

        <h2 className="form-gate-title">
          <span className="shimmer-text">
            {config?.title || 'Coming Soon'}
          </span>
        </h2>

        {config?.description && (
          <p className="form-gate-subtitle">{config.description}</p>
        )}

        {config?.scheduled_open_at && (
          <CountdownTimer
            scheduledAt={config.scheduled_open_at}
            onComplete={onCountdownComplete}
          />
        )}

        {config?.schedule_info && (
          <div className="form-gate-schedule-info">
            {typeof config.schedule_info === 'object' && config.schedule_info !== null ? (
              <ul className="schedule-info-list">
                {Object.entries(config.schedule_info).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{String(config.schedule_info)}</p>
            )}
          </div>
        )}

        {/* Decorative sparkles */}
        <div className="coming-soon__sparkles" aria-hidden="true">
          <Sparkles size={24} className="cs-sparkle cs-sparkle--1" />
          <Sparkles size={18} className="cs-sparkle cs-sparkle--2" />
          <Sparkles size={20} className="cs-sparkle cs-sparkle--3" />
        </div>

        <Link to="/" className="btn btn-secondary form-gate-btn" id="coming-soon-home-btn">
          <ArrowLeftIcon size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
