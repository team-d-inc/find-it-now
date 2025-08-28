import { UserHeader } from '@/components/layout/user-header';
import { StaffClientPage } from '@/app/user/dashboard/staff-members/components/staff-page-client';
import { getStaffMembers } from '@/lib/data/getStaffMembers';
import { PAGINATION_LIMIT } from '@/constants/system';
import { getUserProfile } from '@/services/profileService';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Staff Management',
};

export default async function StaffMembers() {
  const data = await getStaffMembers({ take: PAGINATION_LIMIT });
  const currentProfile = await getUserProfile();

  return (
    <>
      <UserHeader heading="Staff Management" />
      <StaffClientPage initialData={data} currentProfile={currentProfile} />
    </>
  );
}
