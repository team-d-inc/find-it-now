// app/api/organizations/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/services/profileService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const user = await getCurrentUser();

    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const lostItem = await prisma.lostItem.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        organization: true,
        profile: true,
      },
    });

    if (!lostItem) {
      return NextResponse.json(
        { error: "Lost item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...lostItem,
      user: user,
    });
  } catch (error) {
    console.error("Error fetching lost item:", error);
    return NextResponse.json(
      { error: "Failed to get lost item" },
      { status: 500 }
    );
  }
}
