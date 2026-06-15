import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import RegistrationForm from '../components/RegistrationForm';
import { ArrowLeftIcon, PotionFlask } from '../components/SVGIcons';

export default function Workshop2Page() {
  return (
    <PageTransition variant="mist">
      <section className="register-page" id="register-workshop-2">
        <div className="container">
          <div className="register-page__header">
            <Link to="/" className="back-link" id="w2-back-btn">
              <ArrowLeftIcon size={18} />
              <span>Back to Home</span>
            </Link>
            <div className="register-page__title-group">
              <div className="register-page__icon">
                <PotionFlask size={52} />
              </div>
              <h1 className="register-page__title">Workshop 02</h1>
              <p className="register-page__subtitle">
                Advanced Lab Workshop — Hands-on experiments with industry expert mentorship
              </p>
            </div>
          </div>

          <div className="register-page__form-wrapper">
            <RegistrationForm
              tableName="industry_visit_registrations"
              title="Workshop 02 Registration"
              subtitle="Fill in your details to register for the Advanced Lab Workshop"
              eventPrefix="I"
              eventName="Advanced Lab Workshop"
              eventDate="Coming Soon"
              eventVenue="Faculty of Science Lab Complex"
              eventDetails="Delve deeper into advanced biotechnology techniques. Hands-on workshop featuring cutting-edge lab experiments and collaborative problem solving with industry experts."
            />
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
