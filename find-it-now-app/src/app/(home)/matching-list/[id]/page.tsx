import { BackButton } from '@/app/user/dashboard/items/components/lost-item-form/back-button';
import { LostItemDetail } from '@/components/common/lost-item-detail/lost-item-detail';
import { LogoHeader } from '@/components/layout/logo-header';

export default async function MatchingItemDetailsPage() {
  return (
    <div className="container mx-auto px-4 pt-20 pb-10">
      <LogoHeader />
      <div className="px-6">
        <BackButton />
      </div>
      <LostItemDetail />
    </div>
  );
}
