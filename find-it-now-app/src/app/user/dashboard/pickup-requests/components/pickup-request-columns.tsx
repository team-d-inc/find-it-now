"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PickupRequestWithRelations } from "@/types/pickupRequest";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PickupRequestActions } from "./pickup-request-actions";
import { getPickupRequestStatusBadgeStyle, getPickupRequestStatusLabel } from "@/constants/pickupRequestStatus";
import { PickupRequestStatus } from "@/generated/prisma";
import { StatusFilter } from "../../organizations/components/status-filter";

const pickupRequestStatuses = [
  { value: PickupRequestStatus.PENDING, label: "Pending" },
  { value: PickupRequestStatus.APPROVED, label: "Approved" },
  { value: PickupRequestStatus.REJECTED, label: "Rejected" },
];

export const pickupRequestColumns: ColumnDef<PickupRequestWithRelations>[] = [
  {
    accessorKey: "lostItemReport.title",
    header: "Item Name",
    cell: ({ row }) => {
      const title = row.original.lostItemReport.title;
      return (
        <span className="font-semibold">
          {title || <span className="text-muted">No title provided</span>}
        </span>
      );
    },
  },
  {
    id: "claimant",
    header: "Claimant",
    cell: ({ row }) => {
      const { firstName, lastName } = row.original.lostItemReport;
      return <span className="text-sm">{`${firstName} ${lastName}`}</span>;
    },
  },
  {
    id: "email",
    header: "Email",
    cell: ({ row }) => {
      const { email } = row.original.lostItemReport;
      return <span className="text-sm">{email}</span>;
    },
  },
  {
    id: "number",
    header: "Number",
    cell: ({ row }) => {
      const { phone } = row.original.lostItemReport;
      return <span className="text-sm">{phone}</span>;
    },
  },
  {
    accessorKey: "requestDate",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              role="combobox"
              className="justify-between font-semibold text-slate-800 bg-gray-50 hover:bg-gray-200"
            >
              <span>Request Date</span>
              {column.getIsSorted() === "desc" ? (
                <ArrowDown className="opacity-50" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUp className="opacity-50" />
              ) : (
                <ChevronsUpDown className="opacity-50" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown />
              Desc
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("requestDate"));
      return <span className="text-sm">{date.toLocaleDateString()}</span>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "",
    cell: ({ row }) => {
      const status = row.getValue("status") as PickupRequestStatus;
      return (
        <Badge className={`${getPickupRequestStatusBadgeStyle(status)}`}>
          {getPickupRequestStatusLabel(status)}
        </Badge>
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
          statuses={pickupRequestStatuses}
          label="Statuses"
          value={column.getFilterValue() as PickupRequestStatus}
          onValueChange={(value) => column.setFilterValue(value)}
        />
      ),
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      return (
        <PickupRequestActions
          pickupRequest={row.original}
          onSuccess={() => {
            table.options.meta?.onRefresh?.()
          }}
        />
      );
    },
  },
];