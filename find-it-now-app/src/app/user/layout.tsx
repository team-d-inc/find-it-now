import { SidebarWrapper } from '@/components/layout/sidebar-wrapper';
import { getUserProfile } from '@/services/profileService';
import { ProfileWithOrganization } from '@/types/type';
import { ChangePasswordDialog } from '../../components/ui/change-password/change-password-dialog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | FindItNow Dashboard',
    default: 'FindItNow Dashboard',
  },
};

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const profile = await getUserProfile();
  return (
    <div className="overflow-hidden">
      <SidebarWrapper profile={profile as ProfileWithOrganization | null}>
        {children}
        <ChangePasswordDialog />
      </SidebarWrapper>
    </div>
  );
}
