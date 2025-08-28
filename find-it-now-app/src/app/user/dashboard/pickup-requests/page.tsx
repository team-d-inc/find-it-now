import { UserHeader } from '@/components/layout/user-header';
import { getPickupRequests } from '@/lib/data/getPickupRequests';
import { PickupRequestDataTable } from './components/pickup-request-data-table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pickup Request',
};

export default async function PickupRequestsPage() {
  const data = await getPickupRequests({
    page: 1,
    limit: 10,
    sort: { column: 'requestDate', order: 'desc' },
  });

  return (
    <>
      <UserHeader heading="Pickup Requests" />
      <PickupRequestDataTable initialData={data} />
    </>
  );
}
