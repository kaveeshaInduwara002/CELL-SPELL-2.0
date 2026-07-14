import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  PersonIcon,
  EmailIcon,
  PhoneIcon,
  IDCardIcon,
  GraduationIcon,
  CalendarIcon,
  FieldTickIcon,
  FieldCrossIcon,
  Sparkles,
} from './SVGIcons';

// Validation helpers
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
const validatePhone = (phone) => /^\d{10}$/.test(phone);
const validateNIC = (nic) => /^\d{12}$/.test(nic);
const validateName = (name) => /^[a-zA-Z\s.'\-]+$/.test(name.trim()) && name.trim().length >= 2;

const INITIAL_FORM = {
  full_name: '',
  sliit_reg_number: '',
  email: '',
  telephone: '',
  nic_number: '',
  faculty: '',
  year_semester: '',
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
  eventDate = 'To be Announced',
  eventVenue = 'To be Announced',
  eventDetails = '',
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [duplicateErrors, setDuplicateErrors] = useState({
    sliit_reg_number: null,
    nic_number: null,
    email: null,
    telephone: null,
  });
  const [checkingFields, setCheckingFields] = useState({
    sliit_reg_number: false,
    nic_number: false,
    email: false,
    telephone: false,
  });
  const [availabilityChecked, setAvailabilityChecked] = useState({
    sliit_reg_number: false,
    nic_number: false,
    email: false,
    telephone: false,
  });

  const checkDuplicate = useCallback(async (fieldName, value) => {
    if (!value || !value.trim()) return;

    let isValidFormat = false;
    if (fieldName === 'email') isValidFormat = validateEmail(value.trim());
    else if (fieldName === 'telephone') isValidFormat = validatePhone(value.trim());
    else if (fieldName === 'nic_number') isValidFormat = validateNIC(value.trim());
    else if (fieldName === 'sliit_reg_number') isValidFormat = value.trim().length > 0;

    if (!isValidFormat) return;

    setCheckingFields((prev) => ({ ...prev, [fieldName]: true }));
    setDuplicateErrors((prev) => ({ ...prev, [fieldName]: null }));
    setAvailabilityChecked((prev) => ({ ...prev, [fieldName]: false }));

    try {
      const { data, error } = await supabase.rpc('check_registration_exists', {
        p_event_slug: eventSlug,
        p_field: fieldName,
        p_value: value.trim(),
      });

      if (error) throw error;

      if (data === true) {
        let msg = 'Already registered';
        if (fieldName === 'sliit_reg_number') msg = 'This SLIIT Registration Number is already registered.';
        else if (fieldName === 'nic_number') msg = 'This NIC Number is already registered.';
        else if (fieldName === 'email') msg = 'This Email Address is already registered.';
        else if (fieldName === 'telephone') msg = 'This Phone Number is already registered.';

        setDuplicateErrors((prev) => ({ ...prev, [fieldName]: msg }));
      } else {
        setDuplicateErrors((prev) => ({ ...prev, [fieldName]: null }));
        setAvailabilityChecked((prev) => ({ ...prev, [fieldName]: true }));
      }
    } catch (err) {
      console.error('Availability check failed:', err);
    } finally {
      setCheckingFields((prev) => ({ ...prev, [fieldName]: false }));
    }
  }, [eventSlug]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setDuplicateErrors((prev) => ({ ...prev, [name]: null }));
    setAvailabilityChecked((prev) => ({ ...prev, [name]: false }));
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
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (['email', 'telephone', 'nic_number', 'sliit_reg_number'].includes(name)) {
      checkDuplicate(name, value);
    }
  }, [checkDuplicate]);

  // Per-field validation status for animated icons
  const fieldStatus = useMemo(() => {
    const s = {};
    if (touched.full_name) s.full_name = validateName(form.full_name) ? 'valid' : 'invalid';
    
    if (touched.sliit_reg_number) {
      if (duplicateErrors.sliit_reg_number) s.sliit_reg_number = 'invalid';
      else if (checkingFields.sliit_reg_number) s.sliit_reg_number = 'loading';
      else s.sliit_reg_number = form.sliit_reg_number.trim().length > 0 ? 'valid' : 'invalid';
    }
    
    if (touched.email) {
      if (duplicateErrors.email) s.email = 'invalid';
      else if (checkingFields.email) s.email = 'loading';
      else s.email = validateEmail(form.email.trim()) ? 'valid' : 'invalid';
    }
    
    if (touched.telephone) {
      if (duplicateErrors.telephone) s.telephone = 'invalid';
      else if (checkingFields.telephone) s.telephone = 'loading';
      else s.telephone = validatePhone(form.telephone.trim()) ? 'valid' : 'invalid';
    }
    
    if (touched.nic_number) {
      if (duplicateErrors.nic_number) s.nic_number = 'invalid';
      else if (checkingFields.nic_number) s.nic_number = 'loading';
      else s.nic_number = validateNIC(form.nic_number.trim()) ? 'valid' : 'invalid';
    }
    
    if (touched.faculty) s.faculty = form.faculty ? 'valid' : 'invalid';
    if (touched.year_semester) s.year_semester = form.year_semester ? 'valid' : 'invalid';
    return s;
  }, [form, touched, duplicateErrors, checkingFields]);

  const validate = useCallback(() => {
    const errs = {};
    if (!validateName(form.full_name)) {
      errs.full_name = 'Name must contain only letters';
    }
    if (!form.sliit_reg_number.trim()) {
      errs.sliit_reg_number = 'SLIIT Registration Number is required';
    }
    if (!form.email.trim() || !validateEmail(form.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!form.telephone.trim() || !validatePhone(form.telephone.trim())) {
      errs.telephone = 'Must be exactly 10 digits (numbers only)';
    }
    if (!form.nic_number.trim() || !validateNIC(form.nic_number.trim())) {
      errs.nic_number = 'Must be exactly 12 digits (numbers only)';
    }
    if (!form.faculty) {
      errs.faculty = 'Please select your faculty';
    }
    if (!form.year_semester) {
      errs.year_semester = 'Please select your Year & Semester';
    }

    // Mark all fields as touched on submit
    setTouched({
      full_name: true,
      sliit_reg_number: true,
      email: true,
      telephone: true,
      nic_number: true,
      faculty: true,
      year_semester: true,
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
          p_year_semester: form.year_semester,
        });

        if (error) {
          setMessage({
            type: 'error',
            text: error.message || 'Something went wrong. Please try again.',
          });
        } else if (data && !data.success) {
          // RPC returned a validation/duplicate error
          const errorMsg = data.error || '';
          if (errorMsg.toLowerCase().includes('sliit')) {
            setDuplicateErrors((prev) => ({ ...prev, sliit_reg_number: errorMsg }));
            setErrors((prev) => ({ ...prev, sliit_reg_number: errorMsg }));
          } else if (errorMsg.toLowerCase().includes('nic')) {
            setDuplicateErrors((prev) => ({ ...prev, nic_number: errorMsg }));
            setErrors((prev) => ({ ...prev, nic_number: errorMsg }));
          } else if (errorMsg.toLowerCase().includes('email')) {
            setDuplicateErrors((prev) => ({ ...prev, email: errorMsg }));
            setErrors((prev) => ({ ...prev, email: errorMsg }));
          } else if (errorMsg.toLowerCase().includes('phone') || errorMsg.toLowerCase().includes('telephone')) {
            setDuplicateErrors((prev) => ({ ...prev, telephone: errorMsg }));
            setErrors((prev) => ({ ...prev, telephone: errorMsg }));
          } else {
            setMessage({
              type: 'error',
              text: errorMsg || 'Registration failed. Please try again.',
            });
          }
        } else if (data && data.success) {
          const regId = data.registration_id || `R${eventPrefix}001`;

          // Store in sessionStorage for refresh resilience
          sessionStorage.setItem('lastRegistrationRef', regId);

          // Fire-and-forget: send confirmation email via Vercel serverless function.
          // This does NOT block the user's redirect — if the email fails,
          // the registration is still saved and the failure is logged server-side.
          fetch('/api/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ registration_id: regId }),
          }).catch((emailErr) => {
            // Silently catch — email failure should never affect the user experience.
            // The server logs the error to the email_logs table for manual follow-up.
            console.warn('Confirmation email request failed (registration is still saved):', emailErr);
          });

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
    if (status === 'loading') {
      return (
        <span className="field-validation-wrapper">
          <span className="btn-spinner" style={{ width: 14, height: 14, borderWidth: 1.5, borderColor: 'var(--text-muted) transparent transparent transparent' }} />
        </span>
      );
    }
    return (
      <span className={`field-validation-wrapper ${status === 'valid' ? 'is-valid' : 'is-invalid'}`}>
        {status === 'valid' ? <FieldTickIcon /> : <FieldCrossIcon />}
      </span>
    );
  };

  const hasDuplicateErrors = useMemo(() => {
    return Object.values(duplicateErrors).some(Boolean);
  }, [duplicateErrors]);

  const isChecking = useMemo(() => {
    return Object.values(checkingFields).some(Boolean);
  }, [checkingFields]);

  return (
    <div className="glass-form-card" id={`form-${eventSlug}`}>
      {/* Top accent line */}
      <div className="glass-form-card__accent" />

      <div className="form-header">
        <h2 className="form-title">{title}</h2>
        <p className="form-subtitle">{subtitle}</p>
      </div>

      {message && (
        <div
          className={
            message.type === 'error' &&
            ['already', 'duplicate', 'exists', 'registered'].some(kw =>
              message.text?.toLowerCase().includes(kw)
            )
              ? 'duplicate-error-box'
              : `form-message ${message.type}`
          }
          role="alert"
        >
          {message.type === 'success' ? <CheckCircleIcon /> : <AlertIcon size={16} />}
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
        <div className={`floating-field ${errors.sliit_reg_number || duplicateErrors.sliit_reg_number ? 'has-error' : ''}`}>
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
          {(errors.sliit_reg_number || duplicateErrors.sliit_reg_number) && <div className="field-error"><AlertIcon size={12} /> {errors.sliit_reg_number || duplicateErrors.sliit_reg_number}</div>}
        </div>

        {/* Email */}
        <div className={`floating-field ${errors.email || duplicateErrors.email ? 'has-error' : ''}`}>
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
          {(errors.email || duplicateErrors.email) && <div className="field-error"><AlertIcon size={12} /> {errors.email || duplicateErrors.email}</div>}
        </div>

        {/* Telephone */}
        <div className={`floating-field ${errors.telephone || duplicateErrors.telephone ? 'has-error' : ''}`}>
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
          {(errors.telephone || duplicateErrors.telephone) && <div className="field-error"><AlertIcon size={12} /> {errors.telephone || duplicateErrors.telephone}</div>}
        </div>

        {/* NIC Number */}
        <div className={`floating-field ${errors.nic_number || duplicateErrors.nic_number ? 'has-error' : ''}`}>
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
          {(errors.nic_number || duplicateErrors.nic_number) && <div className="field-error"><AlertIcon size={12} /> {errors.nic_number || duplicateErrors.nic_number}</div>}
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
              required
            >
              <option value="" disabled>Select your Faculty</option>
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

        {/* Year & Semester */}
        <div className={`floating-field ${errors.year_semester ? 'has-error' : ''}`}>
          <div className="field-icon-wrapper">
            <CalendarIcon />
          </div>
          <div className="field-input-wrapper">
            <select
              id={`${eventSlug}-year_semester`}
              name="year_semester"
              className={`floating-select ${form.year_semester ? 'has-value' : ''}`}
              value={form.year_semester}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            >
              <option value="" disabled>Select your Year & Semester</option>
              <option value="1st Year 1st Semester">1st Year 1st Semester</option>
              <option value="1st Year 2nd Semester">1st Year 2nd Semester</option>
              <option value="2nd Year 1st Semester">2nd Year 1st Semester</option>
              <option value="2nd Year 2nd Semester">2nd Year 2nd Semester</option>
              <option value="3rd Year 1st Semester">3rd Year 1st Semester</option>
              <option value="3rd Year 2nd Semester">3rd Year 2nd Semester</option>
              <option value="4th Year 1st Semester">4th Year 1st Semester</option>
              <option value="4th Year 2nd Semester">4th Year 2nd Semester</option>
            </select>
            <label htmlFor={`${eventSlug}-year_semester`} className="floating-label floating-label--select">
              Year & Semester <span className="required">*</span>
            </label>
            {renderValidationIcon('year_semester')}
          </div>
          {errors.year_semester && <div className="field-error"><AlertIcon size={12} /> {errors.year_semester}</div>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-submit"
          disabled={submitting || hasDuplicateErrors || isChecking}
          id={`${eventSlug}-submit-btn`}
          aria-busy={submitting ? "true" : undefined}
          aria-label={submitting ? "Registering, please wait" : undefined}
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
