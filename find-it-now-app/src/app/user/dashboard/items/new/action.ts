'use server';

import { prisma } from '@/lib/prisma';
import { LostItemInput } from '@/schemas/lostItemSchemas';
import { PATHS } from '@/constants/paths';
import { authorizeUser } from '@/services/profileService';
import { ProfileWithOrganization } from '@/types/type';
import { Size, Material, Condition } from '@/generated/prisma';
import { revalidatePath } from 'next/cache';
import { parseLostItemFormData } from '@/utils/data/parseLostItemData';
import { saveLostItemEmbedding } from '@/lib/gemini-ai/aiEmbedding';

export async function createLostItem(data: LostItemInput, imageUrls: string[]) {
  try {
    const profile: ProfileWithOrganization = await authorizeUser('all');

    const { colors, contents, identifiableFeatures, disposalDate } = parseLostItemFormData(
      data.colors,
      data.contents,
      data.identifiableFeatures,
      profile,
    );

    const item = await prisma.lostItem.create({
      data: {
        title: data.title,
        specificLocation: data.locationFound || '',
        categoryId: data.category,
        dateFound: data.date ? new Date(data.date + 'T00:00:00') : new Date(),
        colors: colors,
        brand: data.brand || null,
        size: data.size as Size,
        material: data.material as Material,
        condition: (data.condition as Condition) ?? Condition.GOOD,
        identifiableFeatures: identifiableFeatures,
        contents: contents,
        description: data.description || null,
        imageUrls,
        thumbnailUrl: imageUrls[0],
        profileId: profile.id,
        organizationId: profile.organizationId,
        disposalDate,
      },
    });

    await saveLostItemEmbedding(item);

    revalidatePath(PATHS.lostItems());

    return { success: true };
  } catch (error) {
    console.error('Failed to register new lost item', error);
    return { success: false, error: 'Failed to create lost item' };
  }
}
