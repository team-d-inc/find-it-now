import { PickupRequest, LostItemReport, Organization, PickupRequestStatus } from "@/generated/prisma";

export interface PickupRequestWithRelations extends PickupRequest {
  lostItemReport: LostItemReport & {
    organization: Organization;
    category: {
      id: string;
      name: string;
    };
  };
  lostItem?: {
    id: string;
    title: string;
    description: string | null;
    imageUrls: string[];
    thumbnailUrl: string;
    dateFound: Date;
    specificLocation: string;
    colors: string[];
    brand: string | null;
    contents: string[];
    size: string;
    material: string;
    condition: string;
    identifiableFeatures: string[];
  } | null;
}

export interface PickupRequestFilters {
  status?: PickupRequestStatus | string;
  organizationId?: string;
}

export interface PickupRequestSortOptions {
  column: "requestDate" | "status" | "updatedAt";
  order: "asc" | "desc";
}

export type UserRole = "SERVICE_ADMIN" | "ADMIN" | "STAFF";

export interface GetPickupRequestsParams {
  filters?: PickupRequestFilters;
  sort?: PickupRequestSortOptions;
  page?: number;
  limit?: number;
}