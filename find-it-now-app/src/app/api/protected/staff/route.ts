import { NextApiRequest } from 'next';
import { PrismaClient, ProfileStatus, Role } from '@/generated/prisma/client';
import { NextResponse } from 'next/server';
import { authorizeUser } from '@/services/profileService';

const prismaClient = new PrismaClient();

export async function GET(req: NextApiRequest) {
  if (req.method === 'GET') {
    try {
      const currentProfile = await authorizeUser(Role.ADMIN);
      const data = await prismaClient.profile.findMany({
        where: {
          role: {
            in: [Role.STAFF, Role.ADMIN],
          },
          status: {
            in: [ProfileStatus.ACTIVE, ProfileStatus.INACTIVE],
          },
          organizationId: currentProfile?.organizationId,
        },
        orderBy: {
          firstName: 'asc',
        },
        include: {
          organization: true,
        },
      });
      return new NextResponse(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error fetching users:', error);

      return new NextResponse('Internal Server Error', {
        status: 500,
      });
    }
  } else {
    return new NextResponse('Method Not Allowed', {
      status: 405,
    });
  }
}
