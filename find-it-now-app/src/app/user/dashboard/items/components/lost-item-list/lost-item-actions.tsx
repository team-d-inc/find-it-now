"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpRight, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { LostItem } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PATHS } from "@/constants/paths";
import { DeleteDialog } from "./delete-dialog";

interface LostItemActionsProps {
  item: LostItem;
}

export const LostItemActions = ({ item }: LostItemActionsProps) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(PATHS.lostItemDetails({ itemId: item.id }));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(PATHS.lostItemEdit({ itemId: item.id }));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewDetails}>
            <ArrowUpRight />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Wrap dialog in div with stopPropagation to prevent row click */}
      <div onClick={(e) => e.stopPropagation()}>
        <DeleteDialog
          item={item}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
        />
      </div>
    </>
  );
};
