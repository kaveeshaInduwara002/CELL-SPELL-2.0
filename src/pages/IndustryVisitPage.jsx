import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import RegistrationForm from '../components/RegistrationForm';
import FormStatusGate from '../components/FormStatusGate';
import { ArrowLeftIcon, FactoryIcon } from '../components/SVGIcons';

export default function IndustryVisitPage() {
  return (
    <PageTransition variant="helix">
      <section className="register-page" id="register-industry-visit">
        <div className="container">
          <div className="register-page__header">
            <Link to="/" className="back-link" id="iv-back-btn">
              <ArrowLeftIcon size={18} />
              <span>Back to Home</span>
            </Link>
            <div className="register-page__title-group">
              <div className="register-page__icon">
                <FactoryIcon size={52} />
              </div>
              <h1 className="register-page__title">Industry Visit</h1>
              <p className="register-page__subtitle">
                Get an exclusive behind-the-scenes look at leading biotech and pharmaceutical companies
              </p>
            </div>
          </div>

          <FormStatusGate formKey="industry_visit">
            <div className="register-page__form-wrapper">
              <RegistrationForm
                eventSlug="industry-visit"
                title="Industry Visit Registration"
                subtitle="Fill in your details to register for the Industry Visit"
                eventPrefix="S"
                eventName="Industry Visit"
                eventDate="To be Announced"
                eventVenue="To be Announced"
                eventDetails="Get an exclusive behind-the-scenes look at leading biotech and pharmaceutical companies. Networking opportunities with industry professionals included."
              />
            </div>
          </FormStatusGate>
        </div>
      </section>
    </PageTransition>
  );
}
