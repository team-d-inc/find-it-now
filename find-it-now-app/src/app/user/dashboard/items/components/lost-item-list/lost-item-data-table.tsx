'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Category, LostItem } from '@/generated/prisma';
import { PackageCheck, PackagePlus } from 'lucide-react';
import { createLostItemColumns } from './lost-items-columns';
import Link from 'next/link';
import useSWR from 'swr';
import { PATHS } from '@/constants/paths';
import { useState } from 'react';
import { LostItemModal } from '../lost-item-modal';

async function fetchLostItems() {
  const res = await fetch('/api/protected/lost-items');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

interface LostItemDataTableProps {
  initialData: LostItem[];
  categories: Category[];
}

export const LostItemDataTable = ({ initialData, categories }: LostItemDataTableProps) => {
  const { data, mutate, isLoading } = useSWR('/api/protected/lost-items', fetchLostItems, {
    fallbackData: initialData,
  });
  const [selectedLostItem, setSelectedLostItem] = useState<LostItem | null>(null);

  const tableColumns = createLostItemColumns(categories);

  const handleRowClick = (row: LostItem) => {
    setSelectedLostItem(row);
  };

  return (
    <div className="space-y-4 p-5 pt-0">
      <div className="mb-0 flex justify-end">
        <Button size={'lg'} asChild className="cursor-pointer">
          <Link href={PATHS.lostItemCreate()}>
            <PackagePlus />
            Add Lost Item
          </Link>
        </Button>
      </div>
      <DataTable
        columns={tableColumns}
        data={data}
        enablePagination={true}
        enableSorting={true}
        label="lost items"
        onRefresh={() => mutate()}
        loading={isLoading}
        onRowClick={handleRowClick}
        noResultComponent={
          <div className="flex flex-col items-center justify-center space-y-4 p-10">
            <PackageCheck strokeWidth={1} className="h-14 w-14 text-slate-400" />
            <p className="text-lg font-semibold text-slate-500">
              No lost items <br /> in inventory
            </p>
          </div>
        }
      />
      <LostItemModal
        lostItem={selectedLostItem}
        open={!!selectedLostItem}
        onOpenChange={(open: boolean) => {
          if (!open) setSelectedLostItem(null);
        }}
      />
    </div>
  );
};
