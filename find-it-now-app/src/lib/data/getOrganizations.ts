"use server";

import { PrismaClient } from "@/generated/prisma";

type SortOrder = "asc" | "desc";

interface GetOrganizationsOptions {
  select?: object;
  take?: number;
  sort?: { column: string; order: SortOrder };
}

const prisma = new PrismaClient();

export async function getOrganizations({
  select,
  take,
  sort = { column: "name", order: "asc" },
}: GetOrganizationsOptions) {
  return prisma.organization.findMany({
    orderBy: sort
      ? {
          [sort.column]: sort.order,
        }
      : undefined,
    take,
    select,
  });
}
