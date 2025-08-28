"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LostItem } from "@/generated/prisma";
import { deleteLostItem } from "@/app/user/dashboard/items/[id]/edit/action";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { mutate } from "swr";

interface DeleteDialogProps {
  item: LostItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteDialog = ({
  item,
  open,
  onOpenChange,
}: DeleteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteLostItem(item.id);

      if (result.success) {
        toast.success("Item deleted successfully");
        onOpenChange(false);
        // Refresh the lost items data using SWR mutate
        await mutate('/api/protected/lost-items');
        // Also refresh the page to ensure consistency
        router.refresh();
      } else {
        toast.error("Failed to delete item");
        console.error("Delete error:", result.error);
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the lost
            item &quot;{item.title || "Untitled"}&quot; and remove it from our
            servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
