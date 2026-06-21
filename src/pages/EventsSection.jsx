import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../components/useScrollReveal';
import { CodeIcon, FactoryIcon, Sparkles, LockIcon, Hourglass } from '../components/SVGIcons';
import useFormConfig from '../hooks/useFormConfig';

const getEventState = (formKey, status) => {
  switch (status) {
    case 'open':
      return {
        badge: 'Open',
        badgeClass: 'badge-active',
        ctaText: 'Register Now',
        ctaIcon: <Sparkles size={14} />,
        ctaClass: 'btn-primary',
        disabled: false,
      };
    case 'coming_soon':
      return {
        badge: 'Coming Soon',
        badgeClass: 'badge-coming-soon',
        ctaText: 'Coming Soon',
        ctaIcon: <Hourglass size={14} />,
        ctaClass: 'btn-secondary',
        disabled: false,
      };
    case 'closed':
      return {
        badge: 'Closed',
        badgeClass: 'badge-closed',
        ctaText: 'Closed',
        ctaIcon: <LockIcon size={14} />,
        ctaClass: 'btn-disabled',
        disabled: true,
      };
    default:
      return formKey === 'workshop'
        ? {
            badge: 'Open',
            badgeClass: 'badge-active',
            ctaText: 'Register Now',
            ctaIcon: <Sparkles size={14} />,
            ctaClass: 'btn-primary',
            disabled: false,
          }
        : {
            badge: 'Coming Soon',
            badgeClass: 'badge-coming-soon',
            ctaText: 'Coming Soon',
            ctaIcon: <Hourglass size={14} />,
            ctaClass: 'btn-secondary',
            disabled: false,
          };
  }
};

export default function EventsSection() {
  const [headerRef, headerVisible] = useScrollReveal();
  const { config: workshopConfig } = useFormConfig('workshop');
  const { config: ivConfig } = useFormConfig('industry_visit');

  const workshopStatus = workshopConfig?.status || 'open';
  const ivStatus = ivConfig?.status || 'coming_soon';

  const workshopState = getEventState('workshop', workshopStatus);
  const ivState = getEventState('industry_visit', ivStatus);

  const events = [
    {
      id: 'workshop',
      icon: <CodeIcon size={44} />,
      title: 'Workshop',
      subtitle: 'Bioinformatics Workshop',
      description:
        'Explore the intersection of biology and computing. Learn essential bioinformatics software, then compete in an exciting challenge to solve real biological problems using code.',
      features: [
        'Introduction to bioinformatics tools',
        'Hands-on software training',
        'Problem-solving competition',
        'Certificates for winners',
      ],
      ctaLink: '/register/workshop',
      ...workshopState,
    },
    {
      id: 'industry-visit',
      icon: <FactoryIcon size={44} />,
      title: 'Industry Visit',
      subtitle: 'Physical Event',
      description:
        'Something magical is brewing... Get an exclusive behind-the-scenes look at leading biotech and pharmaceutical companies. Stay tuned for the reveal!',
      features: [
        'Details to be announced',
        'In-person experience',
        'Industry networking',
        'More surprises ahead',
      ],
      ctaLink: '/register/industry-visit',
      ...ivState,
    },
  ];

  return (
    <section className="events-section" id="events">
      <div className="container">
        <div
          ref={headerRef}
          className={`section-header reveal ${headerVisible ? 'visible' : ''}`}
        >
          <div className="section-label">Our Events</div>
          <h2 className="section-title">
            Discover the <span className="highlight">Magic</span>
          </h2>
          <p className="section-subtitle">
            Two enchanting events designed to transform your understanding
            of biology and technology.
          </p>
        </div>

        <div className="events-grid">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EventCard({ event, delay }) {
  const [ref, visible] = useScrollReveal();

  const CardWrapper = event.disabled ? 'div' : Link;
  const wrapperProps = event.disabled
    ? {}
    : { to: event.ctaLink };

  return (
    <div
      ref={ref}
      className={`event-card reveal reveal-delay-${delay} ${visible ? 'visible' : ''} ${event.disabled ? 'disabled' : ''}`}
      id={`event-card-${event.id}`}
    >
      <div className="card-icon-svg">{event.icon}</div>
      <span className={`card-badge ${event.badgeClass}`}>{event.badge}</span>
      <h3 className="card-title">{event.title}</h3>
      <p className="card-subtitle-text">{event.subtitle}</p>
      <p className="card-description">{event.description}</p>
      <ul className="card-features">
        {event.features.map((feature, i) => (
          <li key={i}>
            <span className="feature-dot" />
            {feature}
          </li>
        ))}
      </ul>
      <CardWrapper
        className={`btn ${event.ctaClass}`}
        style={{ width: '100%', textAlign: 'center' }}
        id={`event-cta-${event.id}`}
        {...wrapperProps}
      >
        {event.ctaIcon}
        {event.ctaText}
      </CardWrapper>
    </div>
  );
}
