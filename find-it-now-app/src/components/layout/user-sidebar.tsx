"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Package,
  Handshake,
  Users,
  Building2,
  EllipsisVertical,
  KeyRound,
} from "lucide-react";
import { ProfileWithOrganization } from "@/types/type";
import { logout } from "@/app/login/actions";
import { PATHS } from "@/constants/paths";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useChangePasswordStore } from "@/stores/changePasswordStore";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type MatchMode = "exact" | "startsWith"

export const UserSidebar = ({
  profile,
}: {
  profile: ProfileWithOrganization;
}) => {
  const pathname = usePathname();
  const { openDialog } = useChangePasswordStore();
  const [clickedPath, setClickedPath] = useState<string | null>(null);
  const orgLogoUrl = profile.organization?.logoUrl ?  profile.organization?.logoUrl : undefined;
  const handleLogout = async () => {
    await logout();
  };

  const isActiveForRole = (path: string, mode: MatchMode = "exact") => {
    if(clickedPath) {
      if(clickedPath === path) return true;
    } else {
      if (mode === "startsWith") {
        return pathname.startsWith(path);
      }
      return pathname === path;
    }
  };

  const handleMenuClick = (path: string) => {
    setClickedPath(path);
  }

  useEffect(() => {
      setClickedPath(null);
  }, [pathname]);

  return (
    <Sidebar className="border-none">
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar>
            <AvatarImage src={orgLogoUrl} alt={`${profile.organization?.name} logo`} />
            <AvatarFallback className="bg-primary">
              <Building2 className="h-4 w-4 text-white" />
            </AvatarFallback>
          </Avatar>
          <h1
            className="font-bold leading-tight truncate min-w-0"
            title={profile?.organization?.name || ""}
          >
            {profile?.organization?.name}
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(profile?.role === "ADMIN" || profile?.role === "STAFF") && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActiveForRole(PATHS.lostItems(), "startsWith")}
                    >
                      <Link href={PATHS.lostItems()} onClick={() => handleMenuClick(PATHS.lostItems())}>
                        <Package className="w-4 h-4" />
                        <span>Lost Items</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActiveForRole(PATHS.pickUpRequests())}
                    >
                      <Link href={PATHS.pickUpRequests()} onClick={() => handleMenuClick(PATHS.pickUpRequests())}>
                        <Handshake className="w-4 h-4" />
                        <span>Pickup Requests</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              {profile?.role === "ADMIN" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActiveForRole(PATHS.staffDashboard())}
                  >
                    <Link href={PATHS.staffDashboard()} onClick={() => handleMenuClick(PATHS.staffDashboard())}>
                      <Users className="w-4 h-4" />
                      <span>Staff Management</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {profile?.role === "SERVICE_ADMIN" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActiveForRole(PATHS.orgDashboard(), "startsWith")}
                  >
                    <Link href={PATHS.orgDashboard()} onClick={() => handleMenuClick(PATHS.orgDashboard())}>
                      <Building2 className="w-4 h-4" />
                      <span>Organizations</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {(profile?.role === "ADMIN" || profile?.role === "STAFF") && (
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActiveForRole(PATHS.organizationSettings())}
                    >
                      <Link href={PATHS.organizationSettings()} onClick={() => handleMenuClick(PATHS.organizationSettings())}>
                        <Building2 className="w-4 h-4" />
                        <span>Organization</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="pb-6 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full hover:bg-gray-100 rounded-lg">
                <div className="w-full flex justify-between items-center gap-3 p-2">
                  <div className="grow flex justify-start items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white text-sm font-semibold">
                      {profile?.firstName?.charAt(0)}
                      {profile?.lastName?.charAt(0)}
                    </div>
                    <div className="flex flex-1 flex-col min-w-0 text-left">
                      <p className="text-sm font-semibold truncate">
                        {profile?.firstName} {profile?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {profile?.role?.toLowerCase().replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <EllipsisVertical className="w-4 h-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" side="right">
                <DropdownMenuLabel>
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white text-sm font-semibold">
                      {profile?.firstName?.charAt(0)}
                      {profile?.lastName?.charAt(0)}
                    </div>
                    <div className="flex flex-1 flex-col min-w-0 text-left">
                      <p className="text-sm font-semibold truncate">
                        {profile?.firstName} {profile?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {profile?.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={openDialog}>
                  <KeyRound className="w-4 h-4" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
