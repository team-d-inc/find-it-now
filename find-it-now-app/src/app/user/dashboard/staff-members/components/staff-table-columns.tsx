'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Profile, ProfileStatus, Role } from '@/generated/prisma';
import { formatDate } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

export const columns: ColumnDef<Profile>[] = [
  {
    accessorKey: 'name',
    accessorFn: (row) => row.firstName + ' ' + row.lastName || '',
    header: 'Staff Member',
    cell: ({ row }) => {
      const fullName = row.getValue('name') as string;
      return (
        <span className="font-bold">
          {fullName ? fullName : <span className="text-muted">No name provided</span>}
        </span>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      if (!role) return null;
      return (
        <Badge
          variant={role === Role.ADMIN ? 'secondary' : role === Role.STAFF ? 'outline' : 'outline'}
        >
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as ProfileStatus;
      return (
        <Badge
          className={
            status === ProfileStatus.ACTIVE
              ? 'bg-green-100 text-green-900'
              : 'bg-slate-500 text-slate-200'
          }
        >
          {status === ProfileStatus.ACTIVE ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string;
      return <div>{formatDate(createdAt)}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ table, row }) => {
      return (
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => table.options.meta?.onRowEdit?.(row.original)}>
                <Pencil />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.options.meta?.onRowDelete?.(row.original)}>
                <Trash2 className="text-destructive" />
                <span className="text-destructive">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
