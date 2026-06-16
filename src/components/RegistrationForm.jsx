import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  PersonIcon,
  EmailIcon,
  PhoneIcon,
  IDCardIcon,
  GraduationIcon,
  FieldTickIcon,
  FieldCrossIcon,
  Sparkles,
} from './SVGIcons';

// Validation helpers
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
const validatePhone = (phone) => /^\d{10}$/.test(phone);
const validateNIC = (nic) => /^\d{12}$/.test(nic);
const validateName = (name) => /^[a-zA-Z\s.'\\-]+$/.test(name.trim()) && name.trim().length >= 2;

const INITIAL_FORM = {
  full_name: '',
  sliit_reg_number: '',
  email: '',
  telephone: '',
  nic_number: '',
  faculty: 'Faculty of Humanities and Science',
};

const FACULTIES = [
  'Faculty of Humanities and Science',
  'Faculty of Engineering',
  'Faculty of Computing',
  'Business School',
];

// Inline SVG icons for form messages (replacing emoji)
function AlertIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function CheckCircleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

/**
 * Reusable registration form with floating labels, SVG field icons,
 * animated validation feedback, and redirect to success page.
 *
 * Uses the secure `submit_registration` RPC instead of direct table insert.
 */
export default function RegistrationForm({
  eventSlug,
  title,
  subtitle,
  eventPrefix = 'W',
  eventName = '',
  eventDate = 'TBA',
  eventVenue = 'TBA',
  eventDetails = '',
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => {
      if (prev[name]) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return prev;
    });
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  // Per-field validation status for animated icons
  const fieldStatus = useMemo(() => {
    const s = {};
    if (touched.full_name) s.full_name = validateName(form.full_name) ? 'valid' : 'invalid';
    if (touched.sliit_reg_number) s.sliit_reg_number = form.sliit_reg_number.trim().length > 0 ? 'valid' : 'invalid';
    if (touched.email) s.email = validateEmail(form.email.trim()) ? 'valid' : 'invalid';
    if (touched.telephone) s.telephone = validatePhone(form.telephone.trim()) ? 'valid' : 'invalid';
    if (touched.nic_number) s.nic_number = validateNIC(form.nic_number.trim()) ? 'valid' : 'invalid';
    if (touched.faculty) s.faculty = form.faculty ? 'valid' : 'invalid';
    return s;
  }, [form, touched]);

  const validate = useCallback(() => {
    const errs = {};
    if (!form.full_name.trim()) {
      errs.full_name = 'Full name is required';
    } else if (!validateName(form.full_name)) {
      errs.full_name = 'Name must contain only letters';
    }
    if (!form.sliit_reg_number.trim()) {
      errs.sliit_reg_number = 'SLIIT Registration Number is required';
    }
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!validateEmail(form.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!form.telephone.trim()) {
      errs.telephone = 'Telephone number is required';
    } else if (!validatePhone(form.telephone.trim())) {
      errs.telephone = 'Must be exactly 10 digits (numbers only)';
    }
    if (!form.nic_number.trim()) {
      errs.nic_number = 'NIC number is required';
    } else if (!validateNIC(form.nic_number.trim())) {
      errs.nic_number = 'Must be exactly 12 digits (numbers only)';
    }
    if (!form.faculty) errs.faculty = 'Please select your faculty';

    // Mark all fields as touched on submit
    setTouched({
      full_name: true,
      sliit_reg_number: true,
      email: true,
      telephone: true,
      nic_number: true,
      faculty: true,
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setMessage(null);
      if (!validate()) return;
      setSubmitting(true);

      try {
        // Call secure RPC instead of direct table insert
        const { data, error } = await supabase.rpc('submit_registration', {
          p_event_slug: eventSlug,
          p_full_name: form.full_name.trim(),
          p_sliit_reg_number: form.sliit_reg_number.trim().toUpperCase(),
          p_email: form.email.trim().toLowerCase(),
          p_telephone: form.telephone.trim(),
          p_nic_number: form.nic_number.trim(),
          p_faculty: form.faculty,
        });

        if (error) {
          setMessage({
            type: 'error',
            text: error.message || 'Something went wrong. Please try again.',
          });
        } else if (data && !data.success) {
          // RPC returned a validation/duplicate error
          setMessage({
            type: 'error',
            text: data.error || 'Registration failed. Please try again.',
          });
        } else if (data && data.success) {
          const regId = data.registration_id || `R${eventPrefix}001`;

          // Store in sessionStorage for refresh resilience
          sessionStorage.setItem('lastRegistrationRef', regId);

          // Navigate to success page with registration data
          navigate(`/success?ref=${encodeURIComponent(regId)}`, {
            state: {
              registrationId: regId,
              fullName: form.full_name.trim(),
              eventName,
              eventDate,
              eventVenue,
              eventDetails,
              eventPrefix,
            },
          });
        } else {
          setMessage({
            type: 'error',
            text: 'Unexpected response. Please try again.',
          });
        }
      } catch {
        setMessage({
          type: 'error',
          text: 'Network error. Please check your connection and try again.',
        });
      } finally {
        setSubmitting(false);
      }
    },
    [form, eventSlug, validate, navigate, eventPrefix, eventName, eventDate, eventVenue, eventDetails]
  );

  // Helper to render validation icon
  const renderValidationIcon = (fieldName) => {
    const status = fieldStatus[fieldName];
    if (!status) return null;
    return (
      <span className={`field-validation-wrapper ${status === 'valid' ? 'is-valid' : 'is-invalid'}`}>
        {status === 'valid' ? <FieldTickIcon /> : <FieldCrossIcon />}
      </span>
    );
  };

  return (
    <div className="glass-form-card" id={`form-${eventSlug}`}>
      {/* Top accent line */}
      <div className="glass-form-card__accent" />

      <div className="form-header">
        <h2 className="form-title">{title}</h2>
        <p className="form-subtitle">{subtitle}</p>
      </div>

      {message && (
        <div className={`form-message ${message.type}`} role="alert">
          {message.type === 'success' ? <CheckCircleIcon /> : <AlertIcon />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="glass-form">
        {/* Full Name */}
        <div className={`floating-field ${errors.full_name ? 'has-error' : ''}`}>
          <div className="field-icon-wrapper">
            <PersonIcon />
          </div>
          <div className="field-input-wrapper">
            <input
              id={`${eventSlug}-full_name`}
              name="full_name"
              type="text"
              className="floating-input"
              placeholder=" "
              value={form.full_name}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
            />
            <label htmlFor={`${eventSlug}-full_name`} className="floating-label">
              Full Name <span className="required">*</span>
            </label>
            {renderValidationIcon('full_name')}
          </div>
          {errors.full_name && <div className="field-error"><AlertIcon size={12} /> {errors.full_name}</div>}
        </div>

        {/* SLIIT Registration Number */}
        <div className={`floating-field ${errors.sliit_reg_number ? 'has-error' : ''}`}>
          <div className="field-icon-wrapper">
            <IDCardIcon />
          </div>
          <div className="field-input-wrapper">
            <input
              id={`${eventSlug}-sliit_reg_number`}
              name="sliit_reg_number"
              type="text"
              className="floating-input"
              placeholder=" "
              value={form.sliit_reg_number}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor={`${eventSlug}-sliit_reg_number`} className="floating-label">
              SLIIT Registration Number (HS24000000) <span className="required">*</span>
            </label>
            {renderValidationIcon('sliit_reg_number')}
          </div>
          {errors.sliit_reg_number && <div className="field-error"><AlertIcon size={12} /> {errors.sliit_reg_number}</div>}
        </div>

        {/* Email */}
        <div className={`floating-field ${errors.email ? 'has-error' : ''}`}>
          <div className="field-icon-wrapper">
            <EmailIcon />
          </div>
          <div className="field-input-wrapper">
            <input
              id={`${eventSlug}-email`}
              name="email"
              type="email"
              className="floating-input"
              placeholder=" "
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
            />
            <label htmlFor={`${eventSlug}-email`} className="floating-label">
              Email <span className="required">*</span>
            </label>
            {renderValidationIcon('email')}
          </div>
          {errors.email && <div className="field-error"><AlertIcon size={12} /> {errors.email}</div>}
        </div>

        {/* Telephone */}
        <div className={`floating-field ${errors.telephone ? 'has-error' : ''}`}>
          <div className="field-icon-wrapper">
            <PhoneIcon />
          </div>
          <div className="field-input-wrapper">
            <input
              id={`${eventSlug}-telephone`}
              name="telephone"
              type="tel"
              className="floating-input"
              placeholder=" "
              value={form.telephone}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="tel"
              maxLength={10}
            />
            <label htmlFor={`${eventSlug}-telephone`} className="floating-label">
              Telephone (WhatsApp) <span className="required">*</span>
            </label>
            {renderValidationIcon('telephone')}
          </div>
          {errors.telephone && <div className="field-error"><AlertIcon size={12} /> {errors.telephone}</div>}
        </div>

        {/* NIC Number */}
        <div className={`floating-field ${errors.nic_number ? 'has-error' : ''}`}>
          <div className="field-icon-wrapper">
            <IDCardIcon />
          </div>
          <div className="field-input-wrapper">
            <input
              id={`${eventSlug}-nic_number`}
              name="nic_number"
              type="text"
              className="floating-input"
              placeholder=" "
              value={form.nic_number}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={12}
            />
            <label htmlFor={`${eventSlug}-nic_number`} className="floating-label">
              NIC Number (12 digits) <span className="required">*</span>
            </label>
            {renderValidationIcon('nic_number')}
          </div>
          {errors.nic_number && <div className="field-error"><AlertIcon size={12} /> {errors.nic_number}</div>}
        </div>

        {/* Faculty */}
        <div className={`floating-field ${errors.faculty ? 'has-error' : ''}`}>
          <div className="field-icon-wrapper">
            <GraduationIcon />
          </div>
          <div className="field-input-wrapper">
            <select
              id={`${eventSlug}-faculty`}
              name="faculty"
              className={`floating-select ${form.faculty ? 'has-value' : ''}`}
              value={form.faculty}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {FACULTIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <label htmlFor={`${eventSlug}-faculty`} className="floating-label floating-label--select">
              Faculty <span className="required">*</span>
            </label>
            {renderValidationIcon('faculty')}
          </div>
          {errors.faculty && <div className="field-error"><AlertIcon size={12} /> {errors.faculty}</div>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-submit"
          disabled={submitting}
          id={`${eventSlug}-submit-btn`}
        >
          {submitting ? (
            <>
              <span className="btn-spinner" />
              Registering...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Register Now
            </>
          )}
        </button>
      </form>
    </div>
  );
}
