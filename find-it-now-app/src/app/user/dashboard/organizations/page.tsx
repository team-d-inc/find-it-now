import { getOrganizations } from '@/lib/data/getOrganizations';
import { OrganizationDataTable } from './components/org-data-table';
import { UserHeader } from '@/components/layout/user-header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organization',
};

export default async function OrganizationsPage() {
  const data = await getOrganizations({
    take: 20,
    sort: { column: 'createdAt', order: 'asc' },
  });

  return (
    <>
      <UserHeader heading="Organizations" />
      <OrganizationDataTable initialData={data} />
    </>
  );
}
