import { PickupRequestStatus } from "@/generated/prisma";

const PickupRequestStatusMap: Record<
  PickupRequestStatus,
  { label: string; color: string }
> = {
  [PickupRequestStatus.PENDING]: {
    label: "Pending",
    color: "bg-amber-100 text-amber-900",
  },
  [PickupRequestStatus.APPROVED]: {
    label: "Approved",
    color: "bg-emerald-100 text-emerald-900",
  },
  [PickupRequestStatus.REJECTED]: {
    label: "Rejected",
    color: "bg-rose-100 text-rose-900",
  },
};

export const getPickupRequestStatusBadgeStyle = (status: PickupRequestStatus) => {
  const statusConfig = {
    PENDING: PickupRequestStatusMap[PickupRequestStatus.PENDING].color,
    APPROVED: PickupRequestStatusMap[PickupRequestStatus.APPROVED].color,
    REJECTED: PickupRequestStatusMap[PickupRequestStatus.REJECTED].color,
  };

  return statusConfig[status as keyof typeof statusConfig];
};

export const getPickupRequestStatusLabel = (status: PickupRequestStatus) => {
  return PickupRequestStatusMap[status].label;
};

export const pickupRequestStatusFilter = [
  {
    key: "status",
    title: "STATUS",
    list: [
      ...Object.entries(PickupRequestStatusMap).map(([key, value]) => ({
        id: key,
        name: value.label,
      })),
    ],
  },
];