'use client';

import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Frown, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Input } from './input';
import { Skeleton } from './skeleton';
import { RefreshButton } from '../common/refresh-button';
import { Separator } from './separator';

declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    onRowEdit?: (row: TData) => void;
    onRowDelete?: (row: TData) => void;
    onRefresh?: () => void;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    filterComponent?: (props: {
      column: {
        getFilterValue: () => unknown;
        setFilterValue: (value: unknown) => void;
      };
      table: {
        getState: () => { columnFilters: unknown[] };
      };
    }) => React.ReactNode;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowEdit?: (row: TData) => void;
  onRowDelete?: (row: TData) => void;
  onRowClick?: (row: TData) => void;
  onRefresh?: () => void;
  enablePagination?: boolean;
  enableSorting?: boolean;
  pageSize?: number;
  className?: string;
  label?: string;
  loading: boolean;
  noResultComponent?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowEdit,
  onRowDelete,
  onRowClick,
  onRefresh,
  enablePagination = true,
  enableSorting = true,
  pageSize = 10,
  className,
  label,
  loading,
  noResultComponent,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const tableData = React.useMemo(() => (loading ? Array(8).fill({}) : data), [loading, data]);
  const tableColumns = React.useMemo(
    () =>
      loading
        ? columns.map((col) => ({
            ...col,
            cell: () => <Skeleton className="h-4" />,
          }))
        : columns,
    [loading, columns],
  );

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting: enableSorting ? sorting : [],
      columnFilters,
      globalFilter,
    },
    meta: {
      onRowEdit,
      onRowDelete,
      onRefresh,
    },
    initialState: {
      pagination: {
        pageSize: enablePagination ? pageSize : -1,
      },
    },
  });

  return (
    <div className={cn('relative', className)}>
      {/* Modern table container */}
      <div className="flex w-full items-end gap-4 pb-6">
        <div className="grow">
          <label className="text-primary mb-2 flex items-center gap-2 text-sm font-semibold">
            <Search size={16} />
            Search {label}
          </label>
          <Input
            placeholder={`Search ${label}`}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="rounded border-none bg-gray-100 px-5 py-5 text-lg leading-5 placeholder-gray-500 shadow-none focus:placeholder-gray-400 focus:outline-none"
          />
        </div>
        <Separator orientation="vertical" className="!h-[40px]" />
        <RefreshButton onClick={() => onRefresh?.()} isLoading={loading} />
      </div>

      <div className="relative overflow-hidden rounded border border-gray-100 bg-white shadow">
        <Table className="relative">
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="px-6 py-2 text-sm font-semibold text-slate-800 first:rounded-tl-xl"
                    >
                      <div className="flex flex-col gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanFilter() &&
                          header.column.columnDef.meta?.filterComponent && (
                            <div className="flex items-center">
                              {header.column.columnDef.meta.filterComponent({
                                column: header.column,
                                table,
                              })}
                            </div>
                          )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => {
                // Check if disposal date is expired for the entire row
                const disposalDateCell = row
                  .getVisibleCells()
                  .find((cell) => cell.column.id === 'disposalDate');
                const isExpired =
                  disposalDateCell && new Date(disposalDateCell.getValue() as string) < new Date();

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      'group hover:bg-primary/10 fade-in-up cursor-pointer border-b border-gray-100 transition-all duration-300 ease-out last:border-b-0 hover:scale-[1.02]',
                      isExpired ? 'bg-red-50 hover:bg-red-50' : 'bg-white',
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                    onClick={(e) => {
                      // Check if the click is on an action cell or its children
                      const target = e.target as HTMLElement;
                      const actionCell = target.closest('[data-cell-id="actions"]');
                      const dropdownContent = target.closest('[role="menu"]');
                      const button = target.closest('button');

                      // Don't trigger row click if clicking on action cell or dropdown
                      if (!actionCell && !dropdownContent && (!button || !target.closest('td:last-child'))) {
                        onRowClick?.(row.original);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        data-cell-id={cell.column.id}
                        className="px-6 py-4 text-sm text-slate-700 transition-colors duration-200 group-hover:text-slate-900"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-4 p-10">
                    {noResultComponent ? (
                      noResultComponent
                    ) : (
                      <>
                        <Frown className="h-14 w-14 text-slate-400" />
                        <p className="text-lg font-semibold text-slate-700">No results found</p>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
