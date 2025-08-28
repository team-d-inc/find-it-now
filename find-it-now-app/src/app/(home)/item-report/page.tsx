import { LostItemReportForm } from '@/app/(home)/item-report/components/lost-item-report-form';
import { getCategories } from '@/lib/data/getCategories';
import { getOrganizations } from '@/lib/data/getOrganizations';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Report Item',
};

export default async function ItemReportPage() {
  const categories = await getCategories();
  const organizations = await getOrganizations({
    select: {
      id: true,
      name: true,
    },
  });
  return (
    <div className="min-h-screen p-0 md:p-10">
      <LostItemReportForm categories={categories} organizations={organizations} />
    </div>
  );
}
