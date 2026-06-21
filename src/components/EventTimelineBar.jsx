import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const EVENTS = [
  { key: 'workshop', label: 'Workshop' },
  { key: 'industry_visit', label: 'Industry Visit' },
];

/**
 * Subtle timeline bar shown on public form pages.
 * Shows: Workshop → Industry Visit with status indicators.
 *
 * @param {string} currentEvent - 'workshop' | 'industry_visit'
 */
export default function EventTimelineBar({ currentEvent }) {
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    supabase
      .from('form_configs')
      .select('form_key, status')
      .then(({ data }) => {
        if (data) {
          const map = {};
          data.forEach((c) => { map[c.form_key] = c.status; });
          setStatuses(map);
        }
      });

    const channel = supabase
      .channel('timeline-bar')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'form_configs' },
        (payload) => {
          setStatuses((prev) => ({
            ...prev,
            [payload.new.form_key]: payload.new.status,
          }));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'timeline-dot--open';
      case 'closed': return 'timeline-dot--closed';
      case 'coming_soon':
      default: return 'timeline-dot--coming-soon';
    }
  };

  return (
    <div className="event-timeline-bar" id="event-timeline">
      <div className="timeline-track">
        {EVENTS.map((event, i) => {
          const status = statuses[event.key] || 'coming_soon';
          const isCurrent = event.key === currentEvent;
          return (
            <React.Fragment key={event.key}>
              {i > 0 && <div className="timeline-connector" />}
              <div className={`timeline-step ${isCurrent ? 'timeline-step--current' : ''}`}>
                <div className={`timeline-dot ${getStatusColor(status)}`} />
                <div className="timeline-info">
                  <span className="timeline-label">{event.label}</span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
