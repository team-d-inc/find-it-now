'use server';

import { Role } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { OrganizationWithUserFormInputs, organizationWithUserSchema } from '@/schemas/orgSchemas';
import { normalizeError } from '@/lib/error';
import { validateRegistrationToken } from '@/lib/auth/registrationToken';

type Result = {
  success: boolean;
  message?: string;
  status?: number;
};

export async function createOrganization(data: OrganizationWithUserFormInputs, token?: string): Promise<Result> {
  try {
    // Server-side token validation (security critical)
    const tokenValidation = validateRegistrationToken(token);
    if (!tokenValidation.isValid) {
      return {
        success: false,
        message: tokenValidation.errorMessage!,
        status: 401,
      };
    }

    const validation = organizationWithUserSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: `Validation failed ${validation.error.format()}`,
        status: 400,
      };
    }

    const { organization, user } = validation.data;

    // Verify email address matches token
    if (organization.email !== tokenValidation.email) {
      return {
        success: false,
        message: 'Email address does not match token',
        status: 400,
      };
    }

    // Create organization and admin user in transaction
    // Note: Organization existence is already checked in page.tsx
    const createOrg = await prisma.$transaction(async (prisma) => {
      const newOrg = await prisma.organization.create({
        data: organization,
      });

      await prisma.profile.create({
        data: {
          email: user.email,
          organizationId: newOrg.id,
          firstName: user.firstname,
          lastName: user.lastname,
          role: Role.ADMIN,
        },
      });

      return {
        success: true,
      };
    });

    return createOrg;
  } catch (error) {
    console.error('Error creating organization and user:', error);
    const { message, status } = normalizeError(error);
    return { success: false, message, status };
  }
}
