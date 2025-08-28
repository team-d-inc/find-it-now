import { SidebarProvider } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/layout/user-sidebar";
import { ProfileWithOrganization } from "@/types/type";

export const SidebarWrapper = ({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: ProfileWithOrganization | null;
}) => {
  return (
    <SidebarProvider>
      {profile && <UserSidebar profile={profile} />}
      <main className="flex-1 min-w-0 p-2">
        <div className="w-full h-full overflow-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};
