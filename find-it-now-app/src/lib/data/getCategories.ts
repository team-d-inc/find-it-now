"use server";

import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
}
