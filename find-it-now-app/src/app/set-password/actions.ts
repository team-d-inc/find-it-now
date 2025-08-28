'use server';

import { setPasswordSchema } from '@/schemas/authSchemas';
import { ProfileStatus } from '@/generated/prisma';
import { createAdminClient } from '@/utils/supabase/admin';
import { prisma } from '@/lib/prisma';

type Result = {
  success: boolean;
  message?: string;
};

type ValidationResult = {
  isValid: boolean;
  message?: string;
  email?: string;
};

export async function validateSetPasswordAccess(
  email: string,
  token: string,
): Promise<ValidationResult> {
  try {
    // Verify JWT token
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key') as {
      email: string;
      iat: number;
      exp: number;
    };

    if (decoded.email !== email) {
      return { isValid: false, message: 'Invalid token for the provided email.' };
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return { isValid: false, message: 'Token has expired. Please request a new invitation.' };
    }

    // Check if user already has a password set (both in Prisma and Supabase)
    const existingProfile = await prisma.profile.findFirst({
      where: {
        email: email,
        status: ProfileStatus.ACTIVE,
      },
    });

    // Also check if user exists in Supabase auth
    const adminClient = createAdminClient();
    const { data: users } = await adminClient.auth.admin.listUsers();
    const existingUser = users.users.find((u) => u.email === email);

    if (existingProfile || (existingUser && existingUser.confirmed_at)) {
      return { isValid: false, message: 'Account already set up. Please login instead.' };
    }

    return { isValid: true, email };
  } catch (error) {
    console.error('Error validating set password access:', error);
    return { isValid: false, message: 'Invalid token.' };
  }
}

export async function setPassword(formData: FormData): Promise<Result> {
  const obj = Object.fromEntries(formData) as Record<string, string>;
  const parse = setPasswordSchema.safeParse(obj);

  if (!parse.success) {
    return { success: false, message: 'Invalid password. Please try again.' };
  }

  // Get email from token
  const url = new URL((formData.get('_url') as string) || window.location.href);
  const email = url.searchParams.get('email');
  const token = url.searchParams.get('token');

  if (!email || !token) {
    console.error('No email or token found in URL params');
    return { success: false, message: 'Invalid URL. Please try again.' };
  }

  const adminClient = createAdminClient();

  // Get all users to find the one with matching email
  const { data: users, error: listError } = await adminClient.auth.admin.listUsers();

  if (listError) {
    console.error('Error listing users:', listError);
    return { success: false, message: 'Authentication required. Please try again.' };
  }

  let targetUser = users.users.find((u) => u.email === email);

  if (!targetUser) {
    console.error('User not found for email:', email);
    // check if user exists in prisma
    const profileUser = await prisma.profile.findFirst({
      where: { email: email },
    });

    if (!profileUser) {
      console.error('Profile user not found for email:', email);
      return { success: false, message: 'Profile user not found. Please try again.' };
    }

    // create auth user
    const { error: createError, data: newAuthUser } = await adminClient.auth.admin.createUser({
      email: profileUser.email,
      password: parse.data.password,
      email_confirm: true,
    });

    if (createError) {
      console.error('Error creating user:', createError);
      return { success: false, message: 'Error creating user. Please try again.' };
    }

    targetUser = newAuthUser.user;
  }

  // Update password for the target user
  const { error: createError, data: newUser } = await adminClient.auth.admin.updateUserById(
    targetUser.id,
    {
      password: parse.data.password,
      email_confirm: true, // User is setting password, so confirm email
    },
  );

  if (createError || !newUser.user) {
    console.error('Error creating user:', createError);
    return { success: false, message: 'Failed to create user account. Please try again.' };
  }

  targetUser = newUser.user;

  if (targetUser) {
    try {
      // Update profile status and link to Supabase user ID
      const updateResult = await prisma.profile.updateMany({
        where: { email: targetUser.email },
        data: { status: ProfileStatus.ACTIVE, supaUserId: targetUser.id },
      });

      if (updateResult.count === 0) {
        console.error('No profile found for email:', email);
        return { success: false, message: 'Profile not found.' };
      }
    } catch (profileError) {
      console.error('Error updating profile:', profileError);
      return { success: false };
    }
  }

  return { success: true };
}
