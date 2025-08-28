import { UserHeader } from '@/components/layout/user-header';
import { getLostItems } from '@/lib/data/getLostItems';
import { getCategories } from '@/lib/data/getCategories';
import { LostItemDataTable } from './components/lost-item-list/lost-item-data-table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lost Items',
};

export default async function LostItemsPage() {
  const data = await getLostItems({
    organization: false,
    profile: false,
    take: 20,
  });

  const categories = await getCategories();

  return (
    <>
      <UserHeader heading="Lost Items" />
      <LostItemDataTable initialData={data} categories={categories} />
    </>
  );
}
