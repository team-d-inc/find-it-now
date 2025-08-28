import { EMAIL_SEND_TO } from '@/constants/system';
import { LostItemReport } from '@/generated/prisma';
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface PickupRequestEmailData {
  customSubject: string;
  customBody: string;
}

export async function sendPickupRequestApprovalEmail(data: PickupRequestEmailData) {
  try {
    // For testing with Resend free plan, send to verified email only
    const testEmail = 'finditnow.d.inc@gmail.com';

    const subject = data.customSubject;

    // Use plain text body as is
    const emailText = `${data.customBody || ''}\n\n---\nThis is an automated message from FindItNow. Please do not reply to this email.`;

    const { data: emailData, error } = await resend.emails.send({
      from: 'FindItNow <noreply@resend.dev>',
      to: [testEmail], // Use verified email for testing
      subject,
      text: emailText,
    });

    if (error) {
      throw error;
    }
    return emailData;
  } catch (error) {
    console.error('Failed to send pickup request approval email:', error);
    throw error;
  }
}

export async function sendPickupRequestRejectionEmail(data: PickupRequestEmailData) {
  try {
    // For testing with Resend free plan, send to verified email only
    const testEmail = 'finditnow.d.inc@gmail.com';

    const subject = data.customSubject;

    // Use plain text body as is
    const emailText = `${data.customBody || ''}\n\n---\nThis is an automated message from FindItNow. Please do not reply to this email.`;

    const { data: emailData, error } = await resend.emails.send({
      from: 'FindItNow <noreply@resend.dev>',
      to: [testEmail], // Use verified email for testing
      subject,
      text: emailText,
    });

    if (error) {
      throw error;
    }
    return emailData;
  } catch (error) {
    console.error('Failed to send pickup request rejection email:', error);
    throw error;
  }
}

export async function sendPickupRequestConfirmationEmail(report: LostItemReport) {
  let sendTo: string;

  try {
    if (process.env.NODE_ENV === 'production') {
      sendTo = report.email;
    } else {
      sendTo = EMAIL_SEND_TO;
    }

    const { data, error } = await resend.emails.send({
      from: 'FindItNow <noreply@resend.dev>',
      to: [sendTo],
      subject: `Pickup Request Confirmation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; font-size: 16px; line-height: 1.6;">
          <h3 style="font-size: 18px; margin-bottom: 18px;">Hi ${report.firstName},</h3>
          <p style="font-size: 16px; margin-bottom: 5px;">
            Thank you for submitting your pickup request.
            <br />
            Your request has been successfully recorded.
          </p>
          <p style="font-size: 16px; margin-bottom: 15px;">
            Please wait for the staff to review your request.
            <br />
            You will receive an email notification once the request is approved or rejected.
            Thank you for your patience.
          </p>
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 16px;">
            This is an automated message from FindItNow. Please do not reply to this email.
          </p>
      </div>
      `,
    });

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
