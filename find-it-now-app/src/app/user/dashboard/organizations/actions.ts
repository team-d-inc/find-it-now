"use server";

import { prisma } from "@/lib/prisma";
import { authorizeUser } from "@/services/profileService";

export async function approveInstitution(organizationId: string) {
  try {
    await authorizeUser("SERVICE_ADMIN");

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        profiles: {
          where: { role: "ADMIN" },
        },
      },
    });

    if (!organization) {
      return { success: false, error: "Organization not found" };
    }

    const adminProfile = organization.profiles[0];
    if (!adminProfile) {
      return { success: false, error: "Admin profile not found" };
    }

    const { sendApprovalEmail } = await import("@/lib/email");
    const jwt = await import("jsonwebtoken");

    // Generate custom JWT token instead of Supabase invite link
    const generatedToken = jwt.sign(
      { email: adminProfile.email }, 
      process.env.JWT_SECRET || 'default_secret_key', 
      {
        expiresIn: '7d', // 7 days expiration
      }
    );

    // Update institution and profile using Prisma transaction
    await prisma.$transaction(async (tx) => {
      await tx.organization.update({
        where: { id: organizationId },
        data: {
          isActive: true,
          approvalStatus: "APPROVED",
          approvedAt: new Date(),
          approvedBy: "temp-admin-id", // TODO: Use actual user ID
          updatedAt: new Date(),
        },
      });

      // Update admin profile status to INACTIVE (will be activated after password setup)
      // Do NOT create Supabase user here to avoid automatic emails
      await tx.profile.update({
        where: { id: adminProfile.id },
        data: {
          status: "INACTIVE", // Will be activated after password setup
          updatedAt: new Date(),
        },
      });
    });

    // Generate custom JWT-based invite link
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/set-password?email=${encodeURIComponent(adminProfile.email)}&token=${generatedToken}`;

    await sendApprovalEmail({
      email: adminProfile.email,
      institutionName: organization.name,
      adminName: `${adminProfile.firstName} ${adminProfile.lastName}`,
      inviteLink: inviteLink,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function rejectInstitution(
  organizationId: string,
  reason: string
) {
  try {
    await authorizeUser("SERVICE_ADMIN");

    if (!reason?.trim()) {
      return { success: false, error: "Rejection reason is required" };
    }

    // Get institution and admin profile data using Prisma
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        profiles: {
          where: { role: "ADMIN" },
        },
      },
    });

    if (!organization) {
      return { success: false, error: "Organization not found" };
    }

    const adminProfile = organization.profiles[0];
    if (!adminProfile) {
      return { success: false, error: "Admin profile not found" };
    }

    // Update institution status using Prisma
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        approvalStatus: "REJECTED",
        rejectionReason: reason,
        updatedAt: new Date(),
      },
    });

    // Send rejection email to admin user
    const { sendRejectionEmail } = await import("@/lib/email");
    await sendRejectionEmail({
      email: adminProfile.email,
      institutionName: organization.name,
      reason,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function revertDecision(organizationId: string) {
  try {
    await authorizeUser("SERVICE_ADMIN");

    // Get institution and admin profile data using Prisma
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        profiles: {
          where: { role: "ADMIN" },
        },
      },
    });

    if (!organization) {
      return { success: false, error: "Organization not found" };
    }

    const adminProfile = organization.profiles[0];
    if (!adminProfile) {
      return { success: false, error: "Admin profile not found" };
    }

    // Update institution and profiles using Prisma transaction
    await prisma.$transaction(async (tx) => {
      // Revert institution decision
      await tx.organization.update({
        where: { id: organizationId },
        data: {
          approvalStatus: "REVERTED",
          rejectionReason: null,
          isActive: false,
          updatedAt: new Date(),
        },
      });

      // Deactivate associated profiles
      await tx.profile.updateMany({
        where: { organizationId: organizationId },
        data: {
          status: "INACTIVE",
          updatedAt: new Date(),
        },
      });
    });

    // Send revert email to admin user
    const { sendRevertEmail } = await import("@/lib/email");
    await sendRevertEmail({
      email: adminProfile.email,
      institutionName: organization.name,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
