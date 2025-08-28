import { UserHeader } from '@/components/layout/user-header';
import { getPickupRequests } from '@/lib/data/getPickupRequests';
import { PickupRequestDataTable } from './components/pickup-request-data-table';
import { authorizeUser } from '@/services/profileService';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic'; // disables static pre-render
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Pickup Request',
};

export default async function PickupRequestsPage() {
  try {
    // Get user profile and authorize
    const profile = await authorizeUser('all');

    // Fetch initial data
    const data = await getPickupRequests({
      page: 1,
      limit: 10,
      sort: { column: 'requestDate', order: 'desc' },
      role: profile.role,
      organizationId: profile.organizationId,
    });

    return (
      <>
        <UserHeader heading="Pickup Requests" />
        <PickupRequestDataTable initialData={data} />
      </>
    );
  } catch (error) {
    console.error('Error loading pickup requests:', error);
    return (
      <>
        <UserHeader heading="Pickup Requests" />
        <div className="p-5">
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-red-800">
              Failed to load pickup requests. Please try refreshing the page.
            </p>
          </div>
        </div>
      </>
    );
  }
}
