'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';

declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    onRowEdit?: (row: TData) => void;
    onRowDelete?: (row: TData) => void;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowEdit?: (row: TData) => void;
  onRowDelete?: (row: TData) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export function StaffDataTable<TData, TValue>({
  columns,
  data,
  loading = true,
  onRowEdit,
  onRowDelete,
  onRefresh,
}: DataTableProps<TData, TValue>) {
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowDelete={onRowDelete}
      onRowEdit={onRowEdit}
      onRefresh={onRefresh}
      label="Staff"
      loading={loading}
    />
  );
}
