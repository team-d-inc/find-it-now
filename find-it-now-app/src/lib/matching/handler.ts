import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';
import { verifyToken } from '@/lib/auth/authToken';
import { LostItemReport, ReportStatus } from '@/generated/prisma';
import { findSimilarLostItems } from '../gemini-ai/aiEmbedding';
import { LostItemReportWithEmbedding, MatchingResult } from '@/types/type';

type MatchResult = {
  success: boolean;
  report?: LostItemReport;
  items?: MatchingResult[];
};

export async function handleMatchRequest(request: Request, reportId: string): Promise<MatchResult> {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token || !verifyToken(token, reportId)) {
    console.error('Invalid token');
    return { success: false };
  }

  const report = await prisma.lostItemReport.findUnique({
    where: { id: reportId },
    include: {
      organization: {
        select: {
          name: true,
        },
      },
    },
  }) as LostItemReportWithEmbedding | null;
  if (!report) {
    console.error('Report not found');
    return { success: false };
  }

  // Check if report is older than 3 months
  const threeMonthsAgo = dayjs().subtract(3, 'month');
  if (dayjs(report.createdAt).isBefore(threeMonthsAgo)) {
    console.error('Report is older than 3 months');
    return { success: false };
  }

  // if the report is requested, return the report
  if (report.status === ReportStatus.REQUESTED) {
    return { success: true, report };
  }

  const lostItems = await findSimilarLostItems(report.id);

  return { success: true, report, items: lostItems };
}
