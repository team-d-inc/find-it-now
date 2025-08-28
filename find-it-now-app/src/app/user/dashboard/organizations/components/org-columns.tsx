"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ApprovalStatus, Organization } from "@/generated/prisma";
import { approvalStatuses, getStatusBadgeStyle } from "@/constants/approvalStatus";
import { OrganizationActions } from "./org-actions";
import { StatusFilter } from "./status-filter";
import { formatDate } from "@/lib/utils";

export const organizationColumns: ColumnDef<Organization>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <span className="font-semibold">
          {name || <span className="text-muted">No name provided</span>}
        </span>
      );
    },
  },
  {
    accessorKey: "city",
    header: "Location",
    cell: ({ row }) => {
      const city = row.getValue("city") as string;
      const state = row.original.state;
      return (
        <span className="text-sm">
          {city}, {state}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <span className="text-sm">{email}</span>;
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      return <span className="text-sm">{phone}</span>;
    },
  },
  {
    accessorKey: "approvalStatus",
    header: "",
    cell: ({ row }) => {
      const status = row.getValue("approvalStatus") as ApprovalStatus;
      return (
          <Badge className={`${getStatusBadgeStyle(status)}`}>{status}</Badge>
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
          statuses={approvalStatuses}
          label="Status"
          value={column.getFilterValue() as ApprovalStatus}
          onValueChange={(value) => column.setFilterValue(value)}
        />
      ),
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return <span className="text-sm">{formatDate(createdAt)}</span>;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const organization = row.original;
      return (
        <OrganizationActions
          organizationId={organization.id}
          currentStatus={organization.approvalStatus}
          disabled={organization.approvalStatus === "APPROVED"}
          onSuccess={() => {
            // Refresh data after action
            if (table.options.meta?.onRefresh) {
              table.options.meta.onRefresh();
            }
          }}
          onOptimisticUpdate={(action) => {
            // Handle optimistic updates if needed
            console.log("Optimistic update:", action);
          }}
        />
      );
    },
  },
];
