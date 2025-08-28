import { notFound, redirect } from "next/navigation";
import { LostItemDetail } from "@/components/lost-item/lost-item-detail";
import { getLostItemWithToken } from "./actions";

type SeekerItemPageProps = {
  params: Promise<{ token: string; itemId: string }>;
};

export const revalidate = 60;

export default async function SeekerItemDetailPage({ params }: SeekerItemPageProps) {
  const { token, itemId } = await params;

  // Get lost item with token validation
  const { lostItem, hasAccess } = await getLostItemWithToken(itemId, token);

  if (!hasAccess) {
    redirect("/error");
  }

  if (!lostItem) {
    notFound();
  }

  // For seeker view, pass null as userProfile to hide action buttons
  return <LostItemDetail lostItem={lostItem} userProfile={null} />;
}