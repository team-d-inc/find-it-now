import { PrismaClient, Prisma } from "@/generated/prisma";
import { GetPickupRequestsParams, PickupRequestWithRelations } from "@/types/pickupRequest";

const prisma = new PrismaClient();

export async function getPickupRequests({
  filters,
  sort = { column: "requestDate", order: "desc" },
  page = 1,
  limit = 10,
  role,
  organizationId,
}: GetPickupRequestsParams): Promise<{
  data: PickupRequestWithRelations[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const skip = (page - 1) * limit;

  // Build where clause based on role and filters
  const where: Prisma.PickupRequestWhereInput = {};

  // Build lostItemReport filter
  const lostItemReportWhere: Prisma.LostItemReportWhereInput = {};

  // Role-based filtering
  if (role === "ADMIN" || role === "STAFF") {
    if (!organizationId) {
      throw new Error("Organization ID is required for ADMIN and STAFF roles");
    }
    lostItemReportWhere.organizationId = organizationId;
  }

  // Apply organization filter (for SERVICE_ADMIN)
  if (filters?.organizationId && role === "SERVICE_ADMIN") {
    lostItemReportWhere.organizationId = filters.organizationId;
  }

  // Apply lostItemReport filter if any conditions exist
  if (Object.keys(lostItemReportWhere).length > 0) {
    where.lostItemReport = lostItemReportWhere;
  }

  // Apply status filter
  if (filters?.status) {
    where.status = filters.status as Prisma.PickupRequestWhereInput['status'];
  }

  // Build orderBy
  const orderBy = {
    [sort.column]: sort.order,
  };

  // Execute queries
  const [data, total] = await Promise.all([
    prisma.pickupRequest.findMany({
      where,
      include: {
        lostItemReport: {
          include: {
            organization: true,
            category: true,
          },
        },
        lostItem: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrls: true,
            thumbnailUrl: true,
            dateFound: true,
            specificLocation: true,
            colors: true,
            brand: true,
            contents: true,
            size: true,
            material: true,
            condition: true,
            identifiableFeatures: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.pickupRequest.count({ where }),
  ]);

  return {
    data: data as PickupRequestWithRelations[],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}