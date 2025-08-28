import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApprovalEmail({
  institutionName,
  adminName,
  inviteLink,
}: {
  email: string;
  institutionName: string;
  adminName: string;
  inviteLink: string;
}) {
  try {
    // For testing with Resend free plan, send to verified email only
    const testEmail = 'finditnow.d.inc@gmail.com';
    const { data, error } = await resend.emails.send({
      from: 'FindItNow <noreply@resend.dev>',
      to: [testEmail], // Use verified email for testing
      subject: `FindItNow - ${institutionName} Registration Approved`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Registration Approval Notification</h1>
          <p>Dear ${adminName},</p>

          <p>Your registration for <strong>${institutionName}</strong> on FindItNow has been approved.</p>

          <h2>Account Setup</h2>
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
            <p><strong>Complete your account setup by clicking the link below:</strong></p>
            <p style="text-align: center; margin: 20px 0;">
              <a href="${inviteLink}" 
                 style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Set Up Your Password
              </a>
            </p>
            <p style="font-size: 14px; color: #6b7280;">
              This link will expire in 24 hours for security reasons.
            </p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;">
              <strong>Important:</strong> Please set up your password within 24 hours to access your account.
            </p>
          </div>
          
          <h3>Next Steps</h3>
          <ol style="color: #374151;">
            <li>Click the "Set Up Your Password" button above</li>
            <li>Create a secure password for your account</li>
            <li>Review and update your institution information</li>
            <li>Create staff accounts for your team</li>
            <li>Start managing your institution's lost and found items</li>
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
    throw error;
  }
}

export async function sendRejectionEmail({
  institutionName,
  reason,
}: {
  email: string;
  institutionName: string;
  reason: string;
}) {
  try {
    // For testing with Resend free plan, send to verified email only
    const testEmail = 'finditnow.d.inc@gmail.com';

    const { data, error } = await resend.emails.send({
      from: 'FindItNow <noreply@resend.dev>',
      to: [testEmail], // Use verified email for testing
      subject: `FindItNow - ${institutionName} Registration Update`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Registration Status Update</h1>
          <p>Dear Administrator,</p>
          
          <p>We regret to inform you that your registration for <strong>${institutionName}</strong> on FindItNow requires further review.</p>
          
          <h2>Review Comments</h2>
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
            <p style="margin: 0; color: #991b1b;">${reason}</p>
          </div>
          
          <h3>Next Steps</h3>
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
            <p style="margin: 0; color: #0c4a6e;">
              <strong>What you can do:</strong><br>
              • Address the concerns mentioned above<br>
              • Submit a new application with updated information<br>
              • Contact our support team if you need clarification
            </p>
          </div>
          
          <p>If you believe this decision was made in error or if you have addressed the concerns mentioned above, 
          please feel free to resubmit your application or contact our support team.</p>
          
          <p>Thank you for your interest in FindItNow. We appreciate your understanding.</p>
          
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
    throw error;
  }
}

export async function sendRevertEmail({
  institutionName,
}: {
  email: string;
  institutionName: string;
}) {
  try {
    // For testing with Resend free plan, send to verified email only
    const testEmail = 'finditnow.d.inc@gmail.com';

    const { data, error } = await resend.emails.send({
      from: 'FindItNow <noreply@resend.dev>',
      to: [testEmail], // Use verified email for testing
      subject: `FindItNow - ${institutionName} Registration Under Review`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0ea5e9;">Registration Status Update</h1>
          <p>Dear Administrator,</p>

          <p>The registration status for <strong>${institutionName}</strong> on FindItNow has been updated and is now under review again.</p>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
            <p style="margin: 0; color: #0c4a6e;">
              <strong>Status:</strong> Under Review<br>
              Our team will re-evaluate your application and notify you of the decision shortly.
            </p>
          </div>

          <h3>What happens next?</h3>
          <ul style="color: #374151;">
            <li>Our team will review your application again</li>
            <li>You will receive an email notification with the final decision</li>
            <li>No action is required from you at this time</li>
          </ul>

          <p>If you have any questions or concerns, please don't hesitate to contact our support team.</p>

          <p>Thank you for your patience.</p>

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
    throw error;
  }
}

export async function sendInvitationEmail({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  email,
  inviteLink,
  organizationName,
}: {
  email: string;
  inviteLink: string;
  organizationName: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'FindItNow <noreply@resend.dev>',
      // to: [email],
      to: ['finditnow.d.inc@gmail.com'], // Use verified email for testing
      subject: `FindItNow - Welcome`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0ea5e9;">Activate Your Account</h1>
          <p>Dear User,</p>

          <p>Welcome to ${organizationName}! An account has been created for you as a staff member. To activate your account and set up your password, please click the link below:</p>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
            <p style="margin: 0; color: #0c4a6e;">
              <a href="${inviteLink}" style="color: #0ea5e9; text-decoration: none;">Activate Account</a>
            </p>
          </div>

          <p>This activation link will expire in 24 hours. If it expires, you can request a new activation link from the login page.</p>

          <p>If you did not expect this email, please ignore it.</p>

          <p>We're excited to have you join us!</p>

          <p>Best regards,</p>
          <p>${organizationName} Team</p>

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
    throw error;
  }
}
