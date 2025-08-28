'use server';

import { Organization } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { OrganizationFormInputs, organizationSchema } from '@/schemas/orgSchemas';
import { normalizeError } from '@/lib/error';
import { revalidatePath } from 'next/cache';

type Result = {
  success: boolean;
  data?: Organization;
  message?: string;
  status?: number;
};

export async function updateOrganization(
  organizationId: string,
  data: OrganizationFormInputs
): Promise<Result> {
  try {
    const validation = organizationSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: `Validation failed ${validation.error.format()}`,
        status: 400,
      };
    }

    const validatedData = validation.data;

    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!existingOrg) {
      return {
        success: false,
        message: 'Organization not found',
        status: 404,
      };
    }

    // Check if email is being changed and if it's already taken by another organization
    if (validatedData.email !== existingOrg.email) {
      const existingOrgWithEmail = await prisma.organization.findUnique({
        where: { email: validatedData.email },
      });

      if (existingOrgWithEmail) {
        return {
          success: false,
          message: 'Organization with this email already exists',
          status: 409,
        };
      }
    }

    // Update organization
    const updatedOrg = await prisma.organization.update({
      where: { id: organizationId },
      data: validatedData,
    });

    // Ensure the settings page shows fresh data on next render
    revalidatePath('/user/settings/organization');

    return {
      success: true,
      data: updatedOrg,
      message: 'Organization updated successfully',
      status: 200,
    };
  } catch (error) {
    console.error('Error updating organization:', error);
    const { message, status } = normalizeError(error);
    return { success: false, message, status };
  }
}

export async function updateOrganizationLogo(
  organizationId: string,
  logoUrl: string
): Promise<Result> {
  try {
    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!existingOrg) {
      return {
        success: false,
        message: 'Organization not found',
        status: 404,
      };
    }

    // Update only the logo URL
    const updatedOrg = await prisma.organization.update({
      where: { id: organizationId },
      data: { logoUrl },
    });

    // Revalidate settings page to reflect new logo
    revalidatePath('/user/settings/organization');

    return {
      success: true,
      data: updatedOrg,
      message: 'Organization logo updated successfully',
      status: 200,
    };
  } catch (error) {
    console.error('Error updating organization logo:', error);
    const { message, status } = normalizeError(error);
    return { success: false, message, status };
  }
}