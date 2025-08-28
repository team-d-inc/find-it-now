'use server';

import { PrismaClient, ProfileStatus, Role } from '@/generated/prisma';
import { Profile } from '@/generated/prisma';
import { getUserProfile } from '@/services/profileService';
import { createAdminClient } from '@/utils/supabase/server';

export async function createStaffUser(profileData: Partial<Profile>) {
  const supabase = await createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userProfile = await getUserProfile();

  if (!user || user.role === Role.STAFF)
    return {
      success: false,
      error: 'Unauthorized',
    };

  const prisma = new PrismaClient();
  if (!profileData.email) {
    return {
      success: false,
      error: 'Email is required to create or update a staff user.',
    };
  }
  if (!profileData.firstName || !profileData.lastName) {
    return {
      success: false,
      error: 'First name and last name are required to create or update a staff user.',
    };
  }
  if (!profileData.organizationId) {
    return {
      success: false,
      error: 'Institution ID is required to create or update a staff user.',
    };
  }
  if (!profileData.role) {
    return {
      success: false,
      error: 'Role is required to create or update a staff user.',
    };
  }

  // if (profileData.id === '0') {
  // check if the email already exists
  const existingProfile = await prisma.profile.findFirst({
    where: { email: profileData.email },
  });
  // if (existingProfile && existingProfile.status !== ProfileStatus.DELETED) {
  //   return {
  //     success: false,
  //     error: `A staff member with the email ${profileData.email} already exists.`,
  //   };
  // }
  // }

  try {
    const newProfile = await prisma.profile.upsert({
      where: { id: existingProfile?.id ?? '0' },
      update: {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        role: profileData.role,
        status:
          existingProfile?.status === ProfileStatus.DELETED
            ? ProfileStatus.INACTIVE
            : (existingProfile?.status ?? ProfileStatus.INACTIVE),
      },
      create: {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        organizationId: userProfile?.organizationId ?? '',
        role: profileData.role,
        status: ProfileStatus.INACTIVE,
      },
    });

    return { success: true, profile: newProfile };
  } catch (error) {
    console.error('Error creating or updating staff user:', error);
    return {
      success: false,
      error: (error as Error).message.includes('email')
        ? 'Email is already in use.'
        : 'An unexpected error occurred.',
    };
  }
}

export async function updateStaffUser(
  id: string,
  profileData: Partial<Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  const prisma = new PrismaClient();
  return await prisma.profile.update({
    where: { id },
    data: profileData,
  });
}

export async function deleteStaffUser(id: string) {
  const prisma = new PrismaClient();
  const profileUser = await getUserProfile();
  const supabase = await createAdminClient();

  console.log('Deleting staff user with ID:', id);
  // create transaction to delete from profile table and from supabase authentication
  return await prisma.$transaction(async (tx) => {
    const profile = await tx.profile.update({
      where: { id, organizationId: profileUser?.organizationId },
      data: { status: ProfileStatus.DELETED },
    });

    console.log('Deleted staff user profile:', profile);
    // delete from supabase authentication
    if (profile.supaUserId) {
      console.log('Deleting Supabase user with ID:', profile.supaUserId, 'for profile:', profile);
      const { data, error } = await supabase.auth.admin.deleteUser(profile.supaUserId);
      if (error) {
        console.log('Error updating user in Supabase:', error);
        throw new Error('Supabase user ID not found for this profile.');
      }
      return data;
    }
    return profile;
  });
}

export async function getStaffUserById(id: string) {
  const prisma = new PrismaClient();
  return await prisma.profile.findUnique({
    where: { id },
  });
}

export async function getStaffUserByEmail(email: string) {
  const prisma = new PrismaClient();
  return await prisma.profile.findFirst({
    where: { email },
  });
}
