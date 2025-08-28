"use client";

import { DataTable } from "@/components/ui/data-table";
import { PickupRequestWithRelations } from "@/types/pickupRequest";
import { pickupRequestColumns } from "./pickup-request-columns";
import { PickupRequestModal } from "./pickup-request-modal";
import { useState } from "react";
import useSWR from "swr";
import { Handshake } from "lucide-react";

async function fetchPickupRequests(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

interface PickupRequestDataTableProps {
  initialData: {
    data: PickupRequestWithRelations[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export function PickupRequestDataTable({ initialData }: PickupRequestDataTableProps) {
  const { data, mutate, isLoading } = useSWR(
    "/api/protected/pickup-requests",
    fetchPickupRequests,
    {
      fallbackData: initialData,
      revalidateOnFocus: false
    }
  );
  const [selectedPickupRequest, setSelectedPickupRequest] = useState<PickupRequestWithRelations | null>(null);

  return (
    <div className="p-5 pt-0 space-y-4">
      <DataTable
        columns={pickupRequestColumns}
        data={data?.data || []}
        loading={isLoading}
        enablePagination={true}
        enableSorting={true}
        pageSize={10}
        label="pickup requests"
        onRefresh={() => mutate()}
        onRowClick={(row) => setSelectedPickupRequest(row as PickupRequestWithRelations)}
        noResultComponent={
          <div className="flex flex-col items-center justify-center space-y-4 p-10">
            <Handshake strokeWidth={1} className="h-14 w-14 text-slate-400" />
            <p className="text-lg font-semibold text-slate-500">
              No pickup requests
            </p>
          </div>
        }
      />
      <PickupRequestModal
        pickupRequest={selectedPickupRequest}
        open={!!selectedPickupRequest}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPickupRequest(null);
          }
        }}
      />
    </div>
  );
}