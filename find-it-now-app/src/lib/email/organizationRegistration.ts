import { Resend } from 'resend';
import jwt from 'jsonwebtoken';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrganizationRegistrationEmail(email: string) {
  try {
    // Generate token with 7 days expiration
    const token = jwt.sign(
      { email, purpose: 'organization_registration' },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '7d' }
    );

    // Create registration link with token only
    const registrationLink = `${process.env.NEXT_PUBLIC_APP_URL}/register?token=${token}`;

    // For testing with Resend free plan, send to verified email only
    // TODO: Change to the email address of the organization administrator
    const testEmail = 'finditnow.d.inc@gmail.com';

    const { data, error } = await resend.emails.send({
      from: 'FindItNow <noreply@resend.dev>',
      to: [testEmail], // Use verified email for testing
      subject: 'FindItNow - Organization Registration Link',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2E765E;">Organization Registration</h1>
          <p>Dear Organization Administrator,</p>

          <p>Thank you for your interest in joining FindItNow! We've received a request to register an organization with this email address.</p>

          <h2>Complete Your Registration</h2>
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #2E765E;">
            <p><strong>Click the link below to complete your organization registration:</strong></p>
            <p style="text-align: center; margin: 20px 0;">
              <a href="${registrationLink}"
                style="background-color: #2E765E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Complete Registration
              </a>
            </p>
            <p style="font-size: 14px; color: #6b7280;">
              This link will expire in 7 days for security reasons.
            </p>
          </div>

          <div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;">
              <strong>Important:</strong> If you didn't request this registration link, please ignore this email.
            </p>
          </div>

          <h3>What happens next?</h3>
          <ol style="color: #374151;">
            <li>Click the "Complete Registration" button above</li>
            <li>Fill out your organization details</li>
            <li>Submit your application for review</li>
            <li>Wait for approval from our team</li>
            <li>Receive your account setup instructions via email</li>
          </ol>

          <p>If you have any questions or need assistance, please contact our support team.</p>

          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
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
    console.error('Failed to send organization registration email:', error);
    throw error;
  }
}

export function verifyRegistrationToken(token: string) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key') as {
      email: string;
      purpose: string;
    };

    if (payload.purpose !== 'organization_registration') {
      return { valid: false, error: 'Invalid token purpose' };
    }

    return { valid: true, email: payload.email };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { valid: false, error: 'Token expired' };
    }
    return { valid: false, error: 'Invalid token' };
  }
}