import { ApprovalStatus } from "@/generated/prisma";

export const approvalStatuses = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "REVERTED", label: "Reverted" },
];

export const ApprovalStatusMap: Record<
  ApprovalStatus,
  { label: string; color: string }
> = {
  [ApprovalStatus.PENDING]: {
    label: "Pending",
    color: "bg-amber-100 text-amber-900",
  },
  [ApprovalStatus.APPROVED]: {
    label: "Approved",
    color: "bg-emerald-100 text-emerald-900",
  },
  [ApprovalStatus.REJECTED]: {
    label: "Rejected",
    color: "bg-rose-100 text-rose-900",
  },
  [ApprovalStatus.REVERTED]: {
    label: "Reverted",
    color: "bg-slate-100 text-slate-900",
  },
};

export const getStatusBadgeStyle = (status: ApprovalStatus) => {
  const statusConfig = {
    PENDING: ApprovalStatusMap[ApprovalStatus.PENDING].color,
    APPROVED: ApprovalStatusMap[ApprovalStatus.APPROVED].color,
    REJECTED: ApprovalStatusMap[ApprovalStatus.REJECTED].color,
    REVERTED: ApprovalStatusMap[ApprovalStatus.REVERTED].color,
  };

  return statusConfig[status as keyof typeof statusConfig];
};

export const approvalStatusFilter = [
  {
    key: "status",
    title: "STATUS",
    list: [
      ...Object.entries(ApprovalStatusMap).map(([key, value]) => ({
        id: key,
        name: value.label,
      })),
    ],
  },
];
