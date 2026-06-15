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
} from './SVGIcons';

// Validation helpers
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
const validatePhone = (phone) => /^\d{10}$/.test(phone);
const validateNIC = (nic) => /^\d{12}$/.test(nic);
const validateName = (name) => /^[a-zA-Z\s.'\-]+$/.test(name.trim()) && name.trim().length >= 2;

const INITIAL_FORM = {
  full_name: '',
  email: '',
  telephone: '',
  nic_number: '',
  faculty: '',
};

const FACULTIES = [
  'Faculty of Humanities and Science',
  'Faculty of Engineering',
  'Faculty of Computing',
  'Business School',
];

/**
 * Reusable registration form with floating labels, SVG field icons,
 * animated validation feedback, and redirect to success page.
 */
export default function RegistrationForm({
  tableName,
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
        const payload = {
          full_name: form.full_name.trim(),
          email: form.email.trim().toLowerCase(),
          telephone: form.telephone.trim(),
          nic_number: form.nic_number.trim(),
          faculty: form.faculty,
        };

        const { data, error } = await supabase
          .from(tableName)
          .insert([payload])
          .select('registration_id')
          .single();

        if (error) {
          if (error.code === '23505') {
            if (error.message.includes('nic_number')) {
              setMessage({
                type: 'error',
                text: 'This NIC Number has already been registered!',
              });
            } else {
              setMessage({
                type: 'error',
                text: 'You have already registered for this event.',
              });
            }
          } else if (error.code === '23514') {
            setMessage({
              type: 'error',
              text: 'Please check your input values and try again.',
            });
          } else {
            setMessage({
              type: 'error',
              text: error.message || 'Something went wrong. Please try again.',
            });
          }
        } else {
          // Navigate to success page with registration data
          navigate('/success', {
            state: {
              registrationId: data?.registration_id || `R${eventPrefix}001`,
              fullName: form.full_name.trim(),
              eventName,
              eventDate,
              eventVenue,
              eventDetails,
              eventPrefix,
            },
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
    [form, tableName, validate, navigate, eventPrefix, eventName, eventDate, eventVenue, eventDetails]
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
    <div className="glass-form-card" id={`form-${tableName}`}>
      {/* Top accent line */}
      <div className="glass-form-card__accent" />

      <div className="form-header">
        <h2 className="form-title">{title}</h2>
        <p className="form-subtitle">{subtitle}</p>
      </div>

      {message && (
        <div className={`form-message ${message.type}`} role="alert">
          <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
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
              id={`${tableName}-full_name`}
              name="full_name"
              type="text"
              className="floating-input"
              placeholder=" "
              value={form.full_name}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
            />
            <label htmlFor={`${tableName}-full_name`} className="floating-label">
              Full Name <span className="required">*</span>
            </label>
            {renderValidationIcon('full_name')}
          </div>
          {errors.full_name && <div className="field-error">⚠ {errors.full_name}</div>}
        </div>

        {/* Email */}
        <div className={`floating-field ${errors.email ? 'has-error' : ''}`}>
          <div className="field-icon-wrapper">
            <EmailIcon />
          </div>
          <div className="field-input-wrapper">
            <input
              id={`${tableName}-email`}
              name="email"
              type="email"
              className="floating-input"
              placeholder=" "
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
            />
            <label htmlFor={`${tableName}-email`} className="floating-label">
              Email <span className="required">*</span>
            </label>
            {renderValidationIcon('email')}
          </div>
          {errors.email && <div className="field-error">⚠ {errors.email}</div>}
        </div>

        {/* Telephone */}
        <div className={`floating-field ${errors.telephone ? 'has-error' : ''}`}>
          <div className="field-icon-wrapper">
            <PhoneIcon />
          </div>
          <div className="field-input-wrapper">
            <input
              id={`${tableName}-telephone`}
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
            <label htmlFor={`${tableName}-telephone`} className="floating-label">
              Telephone (10 digits) <span className="required">*</span>
            </label>
            {renderValidationIcon('telephone')}
          </div>
          {errors.telephone && <div className="field-error">⚠ {errors.telephone}</div>}
        </div>

        {/* NIC Number */}
        <div className={`floating-field ${errors.nic_number ? 'has-error' : ''}`}>
          <div className="field-icon-wrapper">
            <IDCardIcon />
          </div>
          <div className="field-input-wrapper">
            <input
              id={`${tableName}-nic_number`}
              name="nic_number"
              type="text"
              className="floating-input"
              placeholder=" "
              value={form.nic_number}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={12}
            />
            <label htmlFor={`${tableName}-nic_number`} className="floating-label">
              NIC Number (12 digits) <span className="required">*</span>
            </label>
            {renderValidationIcon('nic_number')}
          </div>
          {errors.nic_number && <div className="field-error">⚠ {errors.nic_number}</div>}
        </div>

        {/* Faculty */}
        <div className={`floating-field ${errors.faculty ? 'has-error' : ''}`}>
          <div className="field-icon-wrapper">
            <GraduationIcon />
          </div>
          <div className="field-input-wrapper">
            <select
              id={`${tableName}-faculty`}
              name="faculty"
              className={`floating-select ${form.faculty ? 'has-value' : ''}`}
              value={form.faculty}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select your faculty</option>
              {FACULTIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <label htmlFor={`${tableName}-faculty`} className="floating-label floating-label--select">
              Faculty <span className="required">*</span>
            </label>
            {renderValidationIcon('faculty')}
          </div>
          {errors.faculty && <div className="field-error">⚠ {errors.faculty}</div>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-submit"
          disabled={submitting}
          id={`${tableName}-submit-btn`}
        >
          {submitting ? (
            <>
              <span className="btn-spinner" />
              Registering...
            </>
          ) : (
            'Register Now ✨'
          )}
        </button>
      </form>
    </div>
  );
}
