import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@/generated/prisma";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

export const getProfileByUserId = unstable_cache(
  async (userId: string) => {
    const profile = await prisma.profile.findFirst({
      where: { supaUserId: userId },
      include: { organization: true },
    });

    if (!profile) throw new Error("Profile not found");
    return profile;
  },
  ["profile-by-user-id"],
  { revalidate: 60 }
);

export async function getUserProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  return await getProfileByUserId(user.id);
}

export async function authorizeUser(role: string) {
  const profile = await getUserProfile();

  if (!profile) throw new Error("Unauthorized");
  if (role !== "all" && role !== profile.role) throw new Error("Forbidden");

  return profile;
}
