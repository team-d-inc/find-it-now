import { ItemStatus } from "@/generated/prisma";

export const lostItemStatuses = [
  { value: "STORED", label: "Stored" },
  { value: "CLAIMED", label: "Claimed" },
  { value: "RETURNED", label: "Returned" },
  { value: "DISPOSED", label: "Disposed" },
];

const LostItemStatusMap: Record<
  ItemStatus,
  { label: string; color: string }
> = {
  [ItemStatus.STORED]: {
    label: "Stored",
    color: "bg-amber-100 text-amber-900",
  },
  [ItemStatus.CLAIMED]: {
    label: "Claimed",
    color: "bg-rose-100 text-rose-900",
  },
  [ItemStatus.RETURNED]: {
    label: "Returned",
    color: "bg-emerald-100 text-emerald-900",
  },
  [ItemStatus.DISPOSED]: {
    label: "Disposed",
    color: "bg-slate-100 text-slate-900",
  },
};

export const getStatusBadgeStyle = (status: string) => {
  const statusConfig = {
    STORED: LostItemStatusMap[ItemStatus.STORED].color,
    CLAIMED: LostItemStatusMap[ItemStatus.CLAIMED].color,
    RETURNED: LostItemStatusMap[ItemStatus.RETURNED].color,
    DISPOSED: LostItemStatusMap[ItemStatus.DISPOSED].color,
  };

  return statusConfig[status as keyof typeof statusConfig] || "bg-gray-500 text-gray-900";
};
