"use client";

import { DataTable } from "@/components/ui/data-table";
import { Organization } from "@/generated/prisma";
import { organizationColumns } from "./org-columns";
import { useState } from "react";
import { OrganizationSheet } from "./org-sheet";
import { OrganizationWithProfiles } from "@/types/type";
import useSWR from "swr";

async function fetchOrganizations() {
  const res = await fetch("/api/protected/organizations");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

interface OrganizationDataTableProps {
  initialData: Organization[];
}

export function OrganizationDataTable({
  initialData,
}: OrganizationDataTableProps) {
  const { data, mutate, isLoading } = useSWR(
    "/api/protected/organizations",
    fetchOrganizations,
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0
    }
  );
  const [selectedOrg, setSelectedOrg] = useState<OrganizationWithProfiles | null>(null);

  return (
    <div className="p-5 pt-0 space-y-4">
      <DataTable
        columns={organizationColumns}
        data={data}
        enablePagination={true}
        enableSorting={true}
        pageSize={10}
        label="organizations"
        onRefresh={() => mutate()}
        onRowClick={(row) => setSelectedOrg(row as OrganizationWithProfiles)}
        loading={isLoading}
      />
      <OrganizationSheet
        organization={selectedOrg}
        open={!!selectedOrg}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrg(null);
          }
        }}
      />
    </div>
  );
}
