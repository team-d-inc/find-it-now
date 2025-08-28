import { Resend } from 'resend';
import { generateToken } from '@/lib/auth/authToken';
import { EMAIL_SEND_TO } from '@/constants/system';
import { formatDate } from '../utils';
import { LostItemReport } from '@/generated/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

type Props = {
  report: LostItemReport;
  organizationName: string;
};

export async function sendLostItemReportConfirmationEmail({ report, organizationName }: Props) {
  let sendTo: string;

  try {
    if (process.env.NODE_ENV === 'production') {
      sendTo = report.email;
    } else {
      sendTo = EMAIL_SEND_TO;
    }

    const token = generateToken(report.id);
    const matchingListUrl = `${process.env.NEXT_PUBLIC_APP_URL}/matching-list?reportId=${report.id}&token=${token}`;
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 3);

    const { data, error } = await resend.emails.send({
      from: 'FindItNow <noreply@resend.dev>',
      to: [sendTo],
      subject: `Lost Item Report Confirmation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; font-size: 16px; line-height: 1.6;">
          <h3 style="font-size: 24px; margin-bottom: 18px;">Hi ${report.firstName},</h3>
          <p style="font-size: 16px; margin-bottom: 15px;">
            Thank you for submitting your lost item report.
            Your report has been successfully recorded.
          </p>
          <p style="font-size: 18px; font-weight: bold; margin-bottom: 15px;"><strong>Next Steps</strong></p>
          <p style="font-size: 16px; margin-bottom: 15px;">
            1. If a match is found, you can request pickup.<br>
            2. The staff will review your request and approve or reject based on verification.<br>
            3. Once approved, you can visit ${organizationName} to collect your item within the designated pickup period.
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; font-size: 20px; margin-bottom: 15px;">Matching Item List</h3>
            <p style="font-size: 16px; margin-bottom: 15px;">
              Our AI will attempt to match your report with similar items. 
              You can view the latest matches at any time via the link below.
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${matchingListUrl}" style="background-color: #007A55; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
                View Matching Items
              </a>
            </div>
            <p style="font-size: 16px; color: #6b7280; margin-bottom: 10px;">
              If the button above doesn’t work, copy and paste this URL into your browser:<br>
              <a href="${matchingListUrl}" style="color: #3b82f6;">${matchingListUrl}</a>
            </p>
            <p style="font-size: 16px; color: #b91c1c;">
              ⚠️ This link is valid until <strong>${formatDate(expiryDate.toISOString())}</strong>
            </p>
          </div>
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
