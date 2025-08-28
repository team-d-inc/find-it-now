"use server";

import { prisma } from "@/lib/prisma";
import { PickupRequestStatus, ReportStatus, ItemStatus, LostItemReport } from "@/generated/prisma";
import { verifyToken } from "@/lib/auth/authToken";
import { sendPickupRequestConfirmationEmail } from "@/lib/email/pickupRequest";

type Props = {
  lostItemId: string;
  report: LostItemReport;
  token: string;
}

export async function createPickupRequest({ lostItemId, report, token }: Props) {
  try {
    // check token is valid
    if (!token || !verifyToken(token, report.id)) {
      console.error('Invalid token');
      return { success: false };
    }
    
    await prisma.$transaction(async (tx) => {
      // create pickup request
      await tx.pickupRequest.create({
        data: {
          lostItemId,
          lostItemReportId: report.id,
          status: PickupRequestStatus.PENDING,
        },
      });

      // change status of lost item to CLAIMED
      await tx.lostItem.update({
        where: { id: lostItemId },
        data: { status: ItemStatus.CLAIMED },
      });

      // update status of lost item report to REQUESTED
      await tx.lostItemReport.update({
        where: { id: report.id },
        data: { status: ReportStatus.REQUESTED },
      });
    });

    // send email to user
    await sendPickupRequestConfirmationEmail(report);

    return { success: true };
  } catch (error) {
    console.error("Failed to create pickup request", error);
    return { success: false };
  }
}
