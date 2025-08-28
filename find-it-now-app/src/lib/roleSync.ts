import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/utils/supabase/admin";

export async function syncUserRoleToMetadata(userId: string) {
  const supabase = createAdminClient();

  const profile = await prisma.profile.findUnique({
    where: { supaUserId: userId },
    select: { role: true },
  });

  if (!profile?.role) {
    throw new Error("Role not found for user.");
  }

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role: profile.role },
  });

  if (error) {
    throw new Error("Failed to update user_metadata: " + error.message);
  }
}
