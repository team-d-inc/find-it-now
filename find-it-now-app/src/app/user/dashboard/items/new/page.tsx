import { getCategories } from '@/lib/data/getCategories';
import { UserHeader } from '@/components/layout/user-header';
import { LostItemForm } from '../components/lost-item-form/lost-item-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Lost Item',
};

export default async function LostItemRegisterPage() {
  const categories = await getCategories();

  if (!categories) {
    throw new Error('Categories not found');
  }

  return (
    <>
      <UserHeader heading="Create New Item" navigateBackButton />
      <LostItemForm categories={categories} />
    </>
  );
}
