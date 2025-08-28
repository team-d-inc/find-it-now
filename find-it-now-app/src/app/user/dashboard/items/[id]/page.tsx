import { LostItemDetail } from '@/components/common/lost-item-detail/lost-item-detail';
import { UserHeader } from '@/components/layout/user-header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detail',
};

export default async function LostItemDetailPage() {
  return (
    <>
      <UserHeader heading="Lost Item Details" navigateBackButton />
      <LostItemDetail />
    </>
  );
}
