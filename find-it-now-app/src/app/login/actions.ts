'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { syncUserRoleToMetadata } from '@/lib/roleSync';
import { PATHS } from '@/constants/paths';
import { prisma } from '@/lib/prisma';

export async function login(formData: FormData) {
  try {
    const supabase = await createClient();

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      console.error('Authentication error:', error);
      return { success: false, error: error.message };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('No user found after authentication');
      return { success: false, error: 'No user found after authentication' };
    }

    await syncUserRoleToMetadata(user.id);

    const profile = await prisma.profile.findFirst({
      where: { supaUserId: user.id },
    });

    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    return { success: true, profile };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(PATHS.login());
}
