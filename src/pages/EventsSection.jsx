import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../components/useScrollReveal';
import { CodeIcon, FactoryIcon, PotionFlask, Sparkles, LockIcon } from '../components/SVGIcons';

const EVENTS = [
  {
    id: 'workshop-1',
    icon: <CodeIcon size={44} />,
    badge: 'Open',
    badgeClass: 'badge-active',
    title: 'Workshop 01',
    subtitle: 'Bioinformatics Workshop',
    description:
      'Explore the intersection of biology and computing. Learn essential bioinformatics software, then compete in an exciting challenge to solve real biological problems using code.',
    features: [
      'Introduction to bioinformatics tools',
      'Hands-on software training',
      'Problem-solving competition',
      'Certificates for winners',
    ],
    ctaText: 'Register Now',
    ctaLink: '/register/workshop-1',
    ctaIcon: <Sparkles size={14} />,
    disabled: false,
  },
  {
    id: 'workshop-2',
    icon: <PotionFlask size={44} />,
    badge: 'Open',
    badgeClass: 'badge-active',
    title: 'Workshop 02',
    subtitle: 'Advanced Lab Workshop',
    description:
      'Delve deeper into advanced biotechnology techniques. A hands-on workshop featuring cutting-edge lab experiments and collaborative problem solving with industry experts.',
    features: [
      'Advanced lab techniques',
      'Industry expert mentorship',
      'Collaborative experiments',
      'Exclusive lab resources',
    ],
    ctaText: 'Register Now',
    ctaLink: '/register/workshop-2',
    ctaIcon: <Sparkles size={14} />,
    disabled: false,
  },
  {
    id: 'industry-visit',
    icon: <FactoryIcon size={44} />,
    badge: 'Coming Soon',
    badgeClass: 'badge-coming-soon',
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
    ctaText: 'Coming Soon',
    ctaLink: '/register/industry-visit',
    ctaIcon: <LockIcon size={14} />,
    disabled: true,
  },
];

export default function EventsSection() {
  const [headerRef, headerVisible] = useScrollReveal();

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
            Three enchanting events designed to transform your understanding
            of biology and technology.
          </p>
        </div>

        <div className="events-grid">
          {EVENTS.map((event, i) => (
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
        className={`btn ${event.disabled ? 'btn-disabled' : 'btn-primary'}`}
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
