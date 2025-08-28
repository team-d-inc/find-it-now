import { LostItem, Category, Organization, Profile, LostItemReport } from "@/generated/prisma";

// Organization
export type OrganizationWithProfiles = Organization & {
  profiles: Profile[];
};

// Profile
export type ProfileWithOrganization = Profile & {
  organization: Organization;
};

// LostItem
export type LostItemWithCategory = LostItem & {
  category: Category;
};

// LostItemReport
export type LostItemReportWithEmbedding = LostItemReport & {
  embedding: number[];
};

// MatchingResult
export type MatchingResult = {
  id: string;
  title: string;
  brand: string;
  categoryName: string;
  thumbnailUrl: string;
  specificLocation: string;
  dateFound: Date;
  distance: number;
  similarityPercentage: number;
};