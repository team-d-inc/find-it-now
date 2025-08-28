'use server';

import { prisma } from '@/lib/prisma';
import { authorizeUser } from '@/services/profileService';
import {
  sendPickupRequestApprovalEmail,
  sendPickupRequestRejectionEmail,
} from '@/lib/email/pickupRequest';
import { ReportStatus } from '@/generated/prisma/client';

export async function approvePickupRequest(
  pickupRequestId: string,
  emailContent?: { subject: string; body: string },
) {
  try {
    // Authorize user
    const profile = await authorizeUser('all');

    const allowedRoles = ['SERVICE_ADMIN', 'ADMIN', 'STAFF'];
    if (!allowedRoles.includes(profile.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get pickup request with all relations
    const pickupRequest = await prisma.pickupRequest.findUnique({
      where: { id: pickupRequestId },
      include: {
        lostItemReport: {
          include: {
            organization: true,
            category: true,
          },
        },
      },
    });

    if (!pickupRequest) {
      return { success: false, error: 'Pickup request not found' };
    }

    // Check if already approved
    if (pickupRequest.status !== 'PENDING') {
      return { success: false, error: 'Pickup request is not in pending status' };
    }

    // Update pickup request status
    await prisma.pickupRequest.update({
      where: { id: pickupRequestId },
      data: {
        status: 'APPROVED',
        updatedAt: new Date(),
      },
    });

    // Send approval email
    try {
      if (emailContent?.subject && emailContent?.body) {
        await sendPickupRequestApprovalEmail({
          customSubject: emailContent.subject,
          customBody: emailContent.body,
        });
      }
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
      // Continue even if email fails - the approval is already processed
    }

    return { success: true };
  } catch (error) {
    console.error('Error approving pickup request:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function rejectPickupRequest(
  pickupRequestId: string,
  rejectionReason: string,
  emailContent?: { subject: string; body: string },
) {
  try {
    // Authorize user
    const profile = await authorizeUser('all');

    const allowedRoles = ['SERVICE_ADMIN', 'ADMIN', 'STAFF'];
    if (!allowedRoles.includes(profile.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    if (!rejectionReason?.trim()) {
      return { success: false, error: 'Rejection reason is required' };
    }

    // Get pickup request with all relations
    const pickupRequest = await prisma.pickupRequest.findUnique({
      where: { id: pickupRequestId },
      include: {
        lostItemReport: {
          include: {
            organization: true,
            category: true,
          },
        },
        lostItem: true,
      },
    });

    if (!pickupRequest) {
      return { success: false, error: 'Pickup request not found' };
    }

    // Check if already processed
    if (pickupRequest.status !== 'PENDING') {
      return { success: false, error: 'Pickup request is not in pending status' };
    }

    await prisma.$transaction(async (tx) => {
      // Update pickup request status and save rejection reason
      await tx.pickupRequest.update({
        where: { id: pickupRequestId },
        data: {
          status: 'REJECTED',
          rejectionReason: rejectionReason.trim(),
          updatedAt: new Date(),
        },
      });

      // If there's an associated lost item that is currently CLAIMED, update it to STORED
      if (pickupRequest.lostItem && pickupRequest.lostItem.status === 'CLAIMED') {
        await tx.lostItem.update({
          where: { id: pickupRequest.lostItem.id },
          data: {
            status: 'STORED',
            updatedAt: new Date(),
          },
        });
      }

      // update status of lost item report to REQUESTED
      await tx.lostItemReport.update({
        where: { id: pickupRequest.lostItemReportId },
        data: { status: ReportStatus.REPORTED },
      });
    });

    // Send rejection email
    try {
      if (emailContent?.subject && emailContent?.body) {
        await sendPickupRequestRejectionEmail({
          customSubject: emailContent.subject,
          customBody: emailContent.body,
        });
      }
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
      // Continue even if email fails - the rejection is already processed
    }

    return { success: true };
  } catch (error) {
    console.error('Error rejecting pickup request:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
