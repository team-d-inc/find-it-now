'use server';

import { PrismaClient } from '@/generated/prisma';
import { authorizeUser } from '@/services/profileService';

type Props = {
  take?: number;
};

const prisma = new PrismaClient();

export async function getStaffMembers({ take }: Props) {
  const profile = await authorizeUser('ADMIN');

  return prisma.profile.findMany({
    where: {
      role: 'STAFF',
      organizationId: profile.organizationId,
    },
    take,
  });
}
