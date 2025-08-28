import { NextRequest, NextResponse } from "next/server";
import { getPickupRequests } from "@/lib/data/getPickupRequests";
import { authorizeUser } from "@/services/profileService";
import { PickupRequestFilters, UserRole } from "@/types/pickupRequest";

export async function GET(request: NextRequest) {
  try {
    // Authorize user
    const profile = await authorizeUser("all");

    const allowedRoles: UserRole[] = ["SERVICE_ADMIN", "ADMIN", "STAFF"];
    if (!allowedRoles.includes(profile.role as UserRole)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || undefined;
    const organizationId = searchParams.get("organizationId") || undefined;

    // Prepare filters
    const filters: PickupRequestFilters = {
      status,
      organizationId,
    };

    // Get pickup requests
    const result = await getPickupRequests({
      filters,
      sort: { column: "requestDate", order: "desc" },
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching pickup requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch pickup requests" },
      { status: 500 }
    );
  }
}