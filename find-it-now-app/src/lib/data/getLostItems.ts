"use server";

import { PrismaClient } from "@/generated/prisma";
import { authorizeUser } from "@/services/profileService";

interface GetLostItemsOptions {
  organization: boolean;
  profile: boolean;
  take?: number;
}

const prisma = new PrismaClient();

export async function getLostItems({
  organization,
  profile,
  take,
}: GetLostItemsOptions) {
  const userProfile = await authorizeUser("all");

  return await prisma.lostItem.findMany({
    where: {
      organizationId: userProfile?.organizationId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      organization: organization,
      profile: profile,
    },
    take,
  });
}
