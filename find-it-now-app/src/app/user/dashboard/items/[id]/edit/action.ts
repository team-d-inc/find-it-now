"use server";

import { PATHS } from "@/constants/paths";
import { Material, Condition, Size, ItemStatus } from "@/generated/prisma";
import { saveLostItemEmbedding } from "@/lib/gemini-ai/aiEmbedding";
import { prisma } from "@/lib/prisma";
import { LostItemInput } from "@/schemas/lostItemSchemas";
import { authorizeUser } from "@/services/profileService";
import { parseLostItemFormData } from "@/utils/data/parseLostItemData";
import { revalidatePath } from "next/cache";

export async function updateLostItem(
  id: string,
  data: LostItemInput,
  imageUrls: string[]
) {
  try {
    const profile = await authorizeUser("all");
    
    const { colors, contents, identifiableFeatures, disposalDate } = parseLostItemFormData(
      data.colors,
      data.contents,
      data.identifiableFeatures,
      profile
    );

    const item = await prisma.lostItem.update({
      where: { id },
      data: {
        title: data.title,
        specificLocation: data.locationFound || "",
        categoryId: data.category,
        dateFound: data.date ? new Date(data.date + "T00:00:00") : new Date(),
        colors: colors,
        brand: data.brand || null,
        size: data.size as Size,
        material: data.material as Material,
        condition: data.condition as Condition,
        identifiableFeatures: identifiableFeatures,
        contents: contents,
        description: data.description || null,
        imageUrls,
        thumbnailUrl: imageUrls[0],
        organizationId: profile.organizationId,
        disposalDate,
        status: data.status as ItemStatus,
      },
    });

    await saveLostItemEmbedding(item);

    revalidatePath(PATHS.lostItemEdit({ itemId: id }));

    return { success: true };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function deleteLostItem(id: string) {
  try {
    const profile = await authorizeUser("all");

    // Verify the item belongs to the user's organization
    const item = await prisma.lostItem.findUnique({
      where: { id },
      select: {
        organizationId: true,
        imageUrls: true
      }
    });

    if (!item) {
      return { success: false, error: "Item not found" };
    }

    if (item.organizationId !== profile.organizationId) {
      return { success: false, error: "Unauthorized" };
    }

    // Delete the item
    await prisma.lostItem.delete({
      where: { id }
    });

    // TODO: Delete images from storage if needed
    // item.imageUrls.forEach(url => deleteImageFromStorage(url));

    revalidatePath(PATHS.lostItems());

    return { success: true };
  } catch (error) {
    console.error("Failed to delete item:", error);
    return { success: false, error: error };
  }
}
