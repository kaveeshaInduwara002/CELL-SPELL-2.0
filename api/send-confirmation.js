// ============================================================
// api/send-confirmation.js — Vercel Serverless Function
// ============================================================
// Endpoint: POST /api/send-confirmation
//
// Called by the frontend AFTER a successful Supabase registration.
// This function:
//   1. Validates the request (requires registration_id)
//   2. Fetches the registration from Supabase (using service role key)
//   3. Generates the appropriate HTML email template
//   4. Sends the email via Resend
//   5. Logs the result to the email_logs table
//   6. Returns success/failure (registration is already saved regardless)
//
// This is a "fire-and-forget" pattern — the user's registration
// is already confirmed in Supabase before this endpoint is called.
// ============================================================

import { supabaseAdmin } from './lib/supabase.js';
import { resend } from './lib/resend.js';
import {
  EMAIL_FROM,
  workshopConfirmationTemplate,
  industryVisitConfirmationTemplate,
} from './lib/emailTemplates.js';

// -------------------------------------------------------
// CUSTOMIZE: Update email subjects per event type
// -------------------------------------------------------
const EMAIL_SUBJECTS = {
  workshop: '🧬 Workshop Registration Confirmed — Cell Spell 2.0',
  'industry-visit': '🏭 Industry Visit Registration Confirmed — Cell Spell 2.0',
};

export default async function handler(req, res) {
  // -------------------------------------------------------
  // 1. Only allow POST requests
  // -------------------------------------------------------
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    });
  }

  // -------------------------------------------------------
  // 2. Extract and validate the registration_id from body
  // -------------------------------------------------------
  const { registration_id } = req.body || {};

  if (!registration_id || typeof registration_id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid registration_id.',
    });
  }

  try {
    // -------------------------------------------------------
    // 3. Fetch the registration from Supabase
    //    Using service role key (bypasses RLS)
    // -------------------------------------------------------
    const { data: registration, error: fetchError } = await supabaseAdmin
      .from('registrations')
      .select('registration_id, event_slug, full_name, email, sliit_reg_number, faculty, year_semester, created_at')
      .eq('registration_id', registration_id)
      .single();

    if (fetchError || !registration) {
      console.error('[send-confirmation] Registration not found:', fetchError?.message);
      return res.status(404).json({
        success: false,
        error: 'Registration not found.',
      });
    }

    // -------------------------------------------------------
    // 4. Check if email was already sent (prevent duplicates)
    // -------------------------------------------------------
    const { data: existingLog } = await supabaseAdmin
      .from('email_logs')
      .select('id')
      .eq('registration_id', registration_id)
      .eq('status', 'sent')
      .single();

    if (existingLog) {
      // Email already sent successfully — skip silently
      return res.status(200).json({
        success: true,
        emailSent: true,
        message: 'Confirmation email was already sent.',
      });
    }

    // -------------------------------------------------------
    // 5. Generate the appropriate email template
    // -------------------------------------------------------
    const templateData = {
      fullName: registration.full_name,
      registrationId: registration.registration_id,
      email: registration.email,
      sliitRegNumber: registration.sliit_reg_number,
      faculty: registration.faculty,
      yearSemester: registration.year_semester,
    };

    let htmlBody;
    let subject;

    switch (registration.event_slug) {
      case 'workshop':
        htmlBody = workshopConfirmationTemplate(templateData);
        subject = EMAIL_SUBJECTS['workshop'];
        break;
      case 'industry-visit':
        htmlBody = industryVisitConfirmationTemplate(templateData);
        subject = EMAIL_SUBJECTS['industry-visit'];
        break;
      default:
        // Fallback: use workshop template for unknown event types
        console.warn(`[send-confirmation] Unknown event_slug: ${registration.event_slug}, using workshop template.`);
        htmlBody = workshopConfirmationTemplate(templateData);
        subject = `Registration Confirmed — Cell Spell 2.0`;
        break;
    }

    // -------------------------------------------------------
    // 6. Send the email via Resend
    // -------------------------------------------------------
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: EMAIL_FROM,
      to: registration.email,
      subject: subject,
      html: htmlBody,
    });

    // -------------------------------------------------------
    // 7. Log the result to email_logs table
    // -------------------------------------------------------
    if (emailError) {
      // Email sending failed — log the error
      console.error('[send-confirmation] Resend error:', emailError);

      await supabaseAdmin.from('email_logs').insert({
        registration_id: registration.registration_id,
        event_slug: registration.event_slug,
        recipient_email: registration.email,
        status: 'failed',
        resend_id: null,
        error_message: emailError.message || JSON.stringify(emailError),
      });

      // Return success to the user (registration is saved),
      // but flag that the email failed
      return res.status(200).json({
        success: true,
        emailSent: false,
        error: 'Registration saved, but confirmation email could not be sent. Our team will follow up.',
      });
    }

    // Email sent successfully — log it
    await supabaseAdmin.from('email_logs').insert({
      registration_id: registration.registration_id,
      event_slug: registration.event_slug,
      recipient_email: registration.email,
      status: 'sent',
      resend_id: emailData?.id || null,
      error_message: null,
    });

    console.log(`[send-confirmation] Email sent to ${registration.email} (Resend ID: ${emailData?.id})`);

    return res.status(200).json({
      success: true,
      emailSent: true,
      resendId: emailData?.id,
    });
  } catch (err) {
    // -------------------------------------------------------
    // 8. Catch unexpected errors
    // -------------------------------------------------------
    console.error('[send-confirmation] Unexpected error:', err);

    // Try to log the failure (best-effort)
    try {
      await supabaseAdmin.from('email_logs').insert({
        registration_id: registration_id,
        event_slug: 'unknown',
        recipient_email: 'unknown',
        status: 'failed',
        resend_id: null,
        error_message: err.message || 'Unexpected server error',
      });
    } catch (logErr) {
      console.error('[send-confirmation] Failed to log error:', logErr);
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error. Registration is saved, but email could not be sent.',
    });
  }
}
