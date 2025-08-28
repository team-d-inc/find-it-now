"use client";

import { LabeledValue } from "@/components/ui/labeled-value";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDate } from "@/lib/utils";
import { OrganizationWithProfiles } from "@/types/type";

interface OrganizationSheetProps {
  organization: OrganizationWithProfiles | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrganizationSheet({
  organization,
  open,
  onOpenChange,
}: OrganizationSheetProps) {
  if (!organization) return null;

  const address = `${organization.address}, ${organization.city}, ${organization.state} ${organization.zipCode}, ${organization.country}`;
  const adminName = organization.profiles?.[0] 
    ? `${organization.profiles[0].firstName} ${organization.profiles[0].lastName}`
    : "N/A";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-white z-[60]">
        <SheetHeader>
          <SheetTitle>Organization details</SheetTitle>
        </SheetHeader>
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {organization.name}
            </h2>
          </div>

          {/* Content */}
          <div className="flex-1 px-8 py-6">
            <div className="space-y-8">
              <div className="space-y-5">
                <LabeledValue label="EMAIL" value={organization.email} />
                <LabeledValue label="PHONE" value={organization.phone} />
                <LabeledValue label="ADDRESS" value={address} />
                <LabeledValue
                  label="SUBMISSION DATE"
                  value={formatDate(organization.createdAt.toString())}
                />
              </div>

              {/* Administrator Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Administrator Information
                </h3>
                <div className="space-y-5">
                  <LabeledValue label="ADMIN NAME" value={adminName} />
                  <LabeledValue
                    label="ADMIN EMAIL"
                    value={organization.profiles?.[0]?.email || "N/A"}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Status</h3>
                <div className="space-y-5">
                  <LabeledValue
                    label="STATUS"
                    value={organization.approvalStatus}
                  />
                  <LabeledValue
                    label="APPROVED BY"
                    value={organization.approvedBy || "-"}
                  />
                  <LabeledValue
                    label="APPROVED AT"
                    value={formatDate(
                      organization.approvedAt?.toString() || "-"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
