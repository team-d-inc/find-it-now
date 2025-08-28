import { verifyRegistrationToken } from '@/lib/email/organizationRegistration';

export interface TokenValidationResult {
  isValid: boolean;
  email?: string;
  error?: 'missing' | 'expired' | 'invalid';
  errorMessage?: string;
}

/**
 * Validates registration token and returns structured result
 * Used by both page rendering and form submission
 */
export function validateRegistrationToken(token?: string): TokenValidationResult {
  // Check if token exists
  if (!token) {
    return {
      isValid: false,
      error: 'missing',
      errorMessage: 'Registration token is required'
    };
  }

  // Verify token with JWT
  const verificationResult = verifyRegistrationToken(token);

  if (!verificationResult.valid) {
    const isExpired = verificationResult.error === 'Token expired';
    return {
      isValid: false,
      error: isExpired ? 'expired' : 'invalid',
      errorMessage: isExpired
        ? 'Registration link has expired'
        : 'Invalid registration token'
    };
  }

  return {
    isValid: true,
    email: verificationResult.email
  };
}

/**
 * Gets user-friendly error messages for different error types
 */
export function getTokenErrorDisplay(error: TokenValidationResult['error']) {
  switch (error) {
    case 'missing':
      return {
        title: 'Invalid Registration Link',
        message: 'A valid registration link is required.\nTo register your organization, please request\na registration link from the home page.'
      };
    case 'expired':
      return {
        title: 'Registration Link Expired',
        message: 'The registration link has expired (7 days). Please request a new registration link.'
      };
    case 'invalid':
    default:
      return {
        title: 'Invalid Registration Link',
        message: 'This link is invalid. Please use a valid registration link.'
      };
  }
}