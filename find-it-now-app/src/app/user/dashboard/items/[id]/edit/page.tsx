import { getCategories } from '@/lib/data/getCategories';
import { UserHeader } from '@/components/layout/user-header';
import { LostItemForm } from '../../components/lost-item-form/lost-item-form';
import { prisma } from '@/lib/prisma';
import { LostItem } from '@/generated/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Lost Item',
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LostItemEditPage({ params }: Props) {
  const categories = await getCategories();

  const { id } = await params;

  const lostItem: LostItem | null = await prisma.lostItem.findUnique({
    where: { id },
  });

  if (!lostItem) {
    return <div>Item not found</div>;
  }

  return (
    <>
      <UserHeader heading="Edit Item Information" navigateBackButton />
      <LostItemForm categories={categories} initialData={lostItem} />
    </>
  );
}
