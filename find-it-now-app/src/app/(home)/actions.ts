"use server";

import { sendOrganizationRegistrationEmail } from '@/lib/email/organizationRegistration';

export async function sendOrganizationRegistrationLink(email: string) {
  try {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Please enter a valid email address'
      };
    }

    await sendOrganizationRegistrationEmail(email);

    return {
      success: true,
      message: 'Registration link sent successfully'
    };
  } catch (error) {
    console.error('Error sending organization registration link:', error);
    return {
      success: false,
      error: 'Failed to send registration link. Please try again.'
    };
  }
}