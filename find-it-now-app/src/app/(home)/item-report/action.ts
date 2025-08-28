'use server';

import { prisma } from '@/lib/prisma';
import { LostItemReportInput } from '@/schemas/lostItemSchemas';
import { sendLostItemReportConfirmationEmail } from '@/lib/email';
import { Size, Material, Condition } from '@/generated/prisma';
import { parseLostItemFormData } from '@/utils/data/parseLostItemData';
import { saveLostItemReportEmbedding } from '@/lib/gemini-ai/aiEmbedding';

export async function createLostItemReport(data: LostItemReportInput) {
  try {
    const { colors, contents, identifiableFeatures } = parseLostItemFormData(
      data.colors,
      data.contents,
      data.identifiableFeatures,
    );

    const report = await prisma.lostItemReport.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        title: data.title,
        organizationId: data.location,
        specificLocation: data.locationLost || '',
        categoryId: data.category,
        dateLost: new Date(data.date),
        colors: colors,
        brand: data.brand || null,
        size: data.size as Size,
        material: data.material as Material,
        condition: (data.condition as Condition) || Condition.GOOD,
        identifiableFeatures: identifiableFeatures,
        contents: contents,
        description: data.description || '',
      },
    });

    await saveLostItemReportEmbedding(report);

    const [organization] = await Promise.all([
      prisma.organization.findUnique({
        where: { id: data.location },
        select: { name: true },
      }),
    ]);

    try {
      await sendLostItemReportConfirmationEmail({
        report: report,
        organizationName: organization?.name || '',
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email', emailError);
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to create report', error);
    return { success: false };
  }
}
