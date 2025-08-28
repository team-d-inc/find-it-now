import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeUser } from "@/services/profileService";

export async function GET() {
  try {
    await authorizeUser("SERVICE_ADMIN");

    const organizations = await prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        profiles: {
          where: {
            role: "ADMIN",
          },
        },
      },
    });

    return NextResponse.json(organizations);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json(
        { error: "Access denied. SERVICE_ADMIN role required." },
        { status: 403 }
      );
    }
    return NextResponse.json(
      {
        error: "Server error occurred",
        details: (error instanceof Error && error.message) || "Unknown error",
      },
      { status: 500 }
    );
  }
}
