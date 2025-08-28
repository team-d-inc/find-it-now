import { UserHeader } from '@/components/layout/user-header';
import { OrganizationForm } from './components/org-form';
import { Role, type Organization } from '@/generated/prisma';
import { ProfileWithOrganization } from '@/types/type';
import { authorizeUser } from '@/services/profileService';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
};

export default async function Organization() {
  // get the organization and profile from the database
  const data: ProfileWithOrganization = await authorizeUser('all');

  if (!data) {
    return <div>No organization found</div>;
  }
  const initialData = data.organization;
  const organizationId = data.organizationId;
  const isEdit = data.role === Role.ADMIN;

  return (
    <>
      <UserHeader heading="Organization Settings" />
      <OrganizationForm initialData={initialData} organizationId={organizationId} isEdit={isEdit} />
    </>
  );
}
