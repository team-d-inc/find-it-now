"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LabeledValue } from "@/components/ui/labeled-value";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LostItem, Category, Profile } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";
import { getStatusBadgeStyle } from "@/constants/lostItemStatus";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LostItemWithRelations extends LostItem {
  category: Category;
  profile: Profile;
}

interface LostItemModalProps {
  lostItem: LostItemWithRelations | LostItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LostItemModal({
  lostItem,
  open,
  onOpenChange,
}: LostItemModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  if (!lostItem && !open) return null;

  const images = lostItem?.imageUrls || [];

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const formatArray = (arr: string[]) => {
    if (!arr || arr.length === 0) return "-";
    return arr.join(", ");
  };

  const handleModalClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking on interactive elements
    if ((e.target as HTMLElement).closest('button')) return;

    if (lostItem) {
      router.push(`/user/dashboard/items/${lostItem.id}`);
      onOpenChange(false);
    }
  };

  // Loading state
  if (!lostItem) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <div className="p-6 flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="bg-white max-w-5xl max-h-[90vh] overflow-y-auto cursor-pointer"
        onClick={handleModalClick}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Lost Item Details</DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="space-y-4">
              {images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={images[currentImageIndex]}
                      alt={`${lostItem.title} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-contain"
                    />
                    {images.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                    <>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={cn(
                              "relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all",
                              index === currentImageIndex
                                ? "border-blue-500 border-4"
                                : "border-gray-200 hover:border-gray-400"
                            )}
                          >
                            <Image
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 text-center">
                        Image {currentImageIndex + 1} of {images.length}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No images available</p>
                </div>
              )}
            </div>

            {/* Right Column - Item Information */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {lostItem.title}
                  </h3>
                  <Badge className={`${getStatusBadgeStyle(lostItem.status)}`}>
                    {lostItem.status}
                  </Badge>
                </div>

                {/* Description */}
              {lostItem.description && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Description</h4>
                  <p className="text-gray-700">{lostItem.description}</p>
                </div>
              )}

              {/* Basic Details */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <LabeledValue
                    label="CATEGORY"
                    value={(lostItem as LostItemWithRelations).category?.name || "-"}
                  />
                  <LabeledValue
                    label="BRAND"
                    value={lostItem.brand || "-"}
                  />
                  <LabeledValue
                    label="COLORS"
                    value={formatArray(lostItem.colors) || "-"}
                  />
                  <LabeledValue
                    label="SIZE"
                    value={lostItem.size || "-"}
                  />
                  <LabeledValue
                    label="MATERIAL"
                    value={lostItem.material || "-"}
                  />
                  <LabeledValue
                    label="CONDITION"
                    value={lostItem.condition || "-"}
                  />
                  <LabeledValue
                    label="CONTENTS"
                    value={formatArray(lostItem.contents) || "-"}
                  />
                  <LabeledValue
                    label="IDENTIFIABLE FEATURES"
                    value={formatArray(lostItem.identifiableFeatures) || "-"}
                  />
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <LabeledValue
                      label="FOUND DATE"
                      value={formatDate(lostItem.dateFound.toString()) || "-"}
                    />
                    <LabeledValue
                      label="DISPOSAL DATE"
                      value={formatDate(lostItem.disposalDate.toString()) || "-"}
                    />
                    <LabeledValue
                      label="FOUND LOCATION"
                      value={lostItem.specificLocation || "-"}
                    />
                    <LabeledValue
                      label="REGISTERED BY"
                      value={
                        (lostItem as LostItemWithRelations).profile
                          ? `${(lostItem as LostItemWithRelations).profile.firstName} ${(lostItem as LostItemWithRelations).profile.lastName}`
                          : "-"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}