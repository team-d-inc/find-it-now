"use server";

import { createClient } from "@/utils/supabase/server";

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string
) {
  const supabase = await createClient();

  // Get current logged-in user
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError || !user?.email) {
    return { success: false, message: "Unable to verify login status." };
  }

  // Check if new password is the same as current
  if (currentPassword === newPassword) {
    return {
      success: false,
      message: "New password cannot be the same as the current password.",
    };
  }

  const email = user.email;

  // Verify current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (signInError) {
    return { success: false, message: "Current password is incorrect." };
  }

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { success: false, message: updateError.message };
  }

  return { success: true, message: "Password updated successfully." };
}
