import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import RegistrationForm from '../components/RegistrationForm';
import FormStatusGate from '../components/FormStatusGate';
import { ArrowLeftIcon, CodeIcon } from '../components/SVGIcons';

export default function WorkshopPage() {
  return (
    <PageTransition variant="portal">
      <section className="register-page" id="register-workshop">
        <div className="container">
          <div className="register-page__header">
            <Link to="/" className="back-link" id="w-back-btn">
              <ArrowLeftIcon size={18} />
              <span>Back to Home</span>
            </Link>
            <div className="register-page__title-group">
              <div className="register-page__icon">
                <CodeIcon size={52} />
              </div>
              <h1 className="register-page__title">Workshop</h1>
              <p className="register-page__subtitle">
                Bioinformatics Workshop — Introduction to software + competition to solve a problem
              </p>
            </div>
          </div>

          <FormStatusGate formKey="workshop">
            <div className="register-page__form-wrapper">
              <RegistrationForm
                eventSlug="workshop"
                title="Workshop Registration"
                subtitle="Fill in your details to register for the Bioinformatics Workshop"
                eventPrefix="W"
                eventName="Bioinformatics Workshop"
                eventDate="TBA - To be announced"
                eventVenue="TBA - To be announced"
                eventDetails="Explore the intersection of biology and computing. Learn essential bioinformatics software, then compete in an exciting challenge. Certificates will be awarded to winners."
              />
            </div>
          </FormStatusGate>
        </div>
      </section>
    </PageTransition>
  );
}
