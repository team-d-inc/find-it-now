"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Category, ItemStatus, LostItem } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";
import {
  getStatusBadgeStyle,
  lostItemStatuses,
} from "@/constants/lostItemStatus";
import { StatusFilter } from "@/app/user/dashboard/organizations/components/status-filter";
import Image from "next/image";
import { LostItemActions } from "./lost-item-actions";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const createLostItemColumns = (
  categories: Category[]
): ColumnDef<LostItem>[] => [
  {
    accessorKey: "thumbnailUrl",
    header: "",
    size: 70,
    cell: ({ row }) => {
      const thumbnailUrl = row.getValue("thumbnailUrl") as string;
      return (
        <div className="w-[70px] h-[70px] overflow-hidden rounded relative">
          <Image
            src={thumbnailUrl}
            alt="Thumbnail"
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Name",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <span className="font-semibold">{title || "-"}</span>;
    },
  },
  {
    accessorKey: "category",
    header: "",
    cell: ({ row }) => {
      const category = row.getValue("category") as Category;
      return (
        <div className="flex justify-center">
          <Badge variant="system" className="text-xs">{category?.name || "-"}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      const category = row.getValue(id) as Category;
      return value.includes(category?.name);
    },
    enableColumnFilter: true,
    meta: {
      filterComponent: ({ column }) => (
        <StatusFilter
          label="Categories"
          statuses={categories.map((cat) => ({
            value: cat.name,
            label: cat.name,
          }))}
          value={column.getFilterValue() as string}
          onValueChange={(value) => column.setFilterValue(value)}
        />
      ),
    },
  },
  {
    accessorKey: "status",
    header: "",
    cell: ({ row }) => {
      const status = row.getValue("status") as ItemStatus;
      return (
        <div className="flex justify-center">
          <Badge className={`${getStatusBadgeStyle(status)} text-xs`}>{status}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
    enableColumnFilter: true,
    meta: {
      filterComponent: ({ column }) => (
        <StatusFilter
          label="Status"
          statuses={lostItemStatuses}
          value={column.getFilterValue() as string}
          onValueChange={(value) => column.setFilterValue(value)}
        />
      ),
    },
  },
  {
    accessorKey: "specificLocation",
    header: "Found Location",
    cell: ({ row }) => {
      const location = row.getValue("specificLocation") as string;
      return <div className="text-sm">{location || "-"}</div>;
    },
  },
  {
    accessorKey: "dateFound",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold bg-gray-50 hover:bg-gray-200"
        >
          Found
          <ArrowUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateFound = row.getValue("dateFound") as string;
      return <div className="text-sm text-center">{formatDate(dateFound)}</div>;
    },
  },
  {
    accessorKey: "disposalDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold bg-gray-50 hover:bg-gray-200"
        >
          Disposal
          <ArrowUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const disposalDate = row.getValue("disposalDate") as string;
      const isExpired = new Date(disposalDate) < new Date();
      const shortDate = formatDate(disposalDate).split(',')[0];
      return (
        <div className={`text-center ${isExpired ? 'text-red-600 font-semibold' : ''}`}>
          {shortDate}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold bg-gray-50 hover:bg-gray-200"
        >
          Registered
          <ArrowUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return <div className="text-sm text-center">{formatDate(createdAt)}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;
      return <LostItemActions item={item} />;
    },
  },
];
