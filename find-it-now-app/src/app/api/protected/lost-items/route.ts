import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeUser } from "@/services/profileService";

export async function GET() {
  try {
    const userProfile = await authorizeUser("all");

    const lostItems = await prisma.lostItem.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        organizationId: userProfile?.organizationId,
      },
      include: {
        category: true,
        profile: true,
      },
    });
    return NextResponse.json(lostItems);
  } catch (error) {
    console.error("Error fetching lost items:", error);
    return NextResponse.json(
      { error: "Failed to get lost items", details: error },
      { status: 500 }
    );
  }
}
