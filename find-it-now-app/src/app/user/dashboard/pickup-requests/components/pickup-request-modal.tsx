"use client";

import { LabeledValue } from "@/components/ui/labeled-value";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { PickupRequestWithRelations } from "@/types/pickupRequest";
import { Badge } from "@/components/ui/badge";
import { getPickupRequestStatusBadgeStyle, getPickupRequestStatusLabel } from "@/constants/pickupRequestStatus";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface PickupRequestModalProps {
  pickupRequest: PickupRequestWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PickupRequestModal({
  pickupRequest,
  open,
  onOpenChange,
}: PickupRequestModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  if (!pickupRequest) return null;

  const { lostItemReport, lostItem } = pickupRequest;
  const { category } = lostItemReport;

  const formatArray = (arr: string[]) => {
    if (!arr || arr.length === 0) return "-";
    return arr.join(", ");
  };

  // Get lost item images directly from the associated lost item
  const images: string[] = lostItem?.imageUrls || [];

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

  const handleLostItemClick = () => {
    if (lostItem) {
      router.push(`/user/dashboard/items/${lostItem.id}/edit`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Pickup Request Details
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Left Column - Images */}
            <div className="space-y-4">
              {lostItem ? (
                <>
                  {images.length > 0 ? (
                    <div className="space-y-4">
                      {/* Main Image */}
                      <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
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
                      )}
                      <p className="text-sm text-gray-500 text-center">
                        Image {currentImageIndex + 1} of {images.length}
                      </p>
                    </div>
                  ) : (
                    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">No images available</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No matched item for this request</p>
                </div>
              )}
            </div>

            {/* Right Column - Request & Claimant Information */}
            <div className="space-y-8">
              {/* Request Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Request Information
                </h3>
                <div className="space-y-3">
                  <LabeledValue
                    label="REQUEST DATE"
                    value={formatDate(pickupRequest.requestDate.toString())}
                  />
                  {pickupRequest.rejectionReason && (
                    <LabeledValue
                      label="REJECTION REASON"
                      value={pickupRequest.rejectionReason}
                    />
                  )}
                </div>
              </div>

              {/* Claimant Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Claimant Information
                </h3>
                <div className="space-y-3">
                  <LabeledValue
                    label="NAME"
                    value={`${lostItemReport.firstName} ${lostItemReport.lastName}`}
                  />
                  <LabeledValue
                    label="EMAIL"
                    value={lostItemReport.email}
                  />
                  <LabeledValue
                    label="NUMBER"
                    value={lostItemReport.phone}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <div className="flex justify-start">
                  <Badge className={`${getPickupRequestStatusBadgeStyle(pickupRequest.status)} text-sm px-4 py-2`}>
                    {getPickupRequestStatusLabel(pickupRequest.status)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Item Comparison Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-8">
              {/* User's Report */}
              <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900">
                  Lost Item Report (User&apos;s Description)
                </h4>
                <div className="space-y-3">
                  <LabeledValue label="Item Name" value={lostItemReport.title} />
                  <LabeledValue label="Category" value={category.name} />
                  <LabeledValue label="Date Lost" value={formatDate(lostItemReport.dateLost.toString())} />
                  <LabeledValue label="Location Lost" value={lostItemReport.specificLocation} />
                  <LabeledValue label="Brand" value={lostItemReport.brand || "-"} />
                  <LabeledValue label="Size" value={lostItemReport.size} />
                  <LabeledValue label="Material" value={lostItemReport.material} />
                  <LabeledValue label="Condition" value={lostItemReport.condition} />
                  <LabeledValue label="Colors" value={formatArray(lostItemReport.colors)} />
                  <LabeledValue label="Identifiable Features" value={formatArray(lostItemReport.identifiableFeatures)} />
                  <LabeledValue label="Contents" value={formatArray(lostItemReport.contents)} />
                  <LabeledValue label="Description" value={lostItemReport.description || "-"} />
                </div>
              </div>

              {/* Found Item */}
              <div className="space-y-4 bg-green-50 p-4 rounded-lg cursor-pointer transition-all hover:bg-green-100" onClick={handleLostItemClick}>
                {lostItem ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="text-lg font-semibold text-green-900">
                        Found Item (In Organization&apos;s Possession)
                      </h4>
                      <ExternalLink className="h-4 w-4 text-green-700" />
                    </div>
                    <div className="space-y-3">
                      <LabeledValue label="Item Name" value={lostItem.title} />
                      <LabeledValue label="Category" value={category.name} />
                      <LabeledValue label="Date Found" value={formatDate(lostItem.dateFound.toString())} />
                      <LabeledValue label="Location Found" value={lostItem.specificLocation} />
                      <LabeledValue label="Brand" value={lostItem.brand || "-"} />
                      <LabeledValue label="Size" value={lostItem.size} />
                      <LabeledValue label="Material" value={lostItem.material} />
                      <LabeledValue label="Condition" value={lostItem.condition} />
                      <LabeledValue label="Colors" value={formatArray(lostItem.colors)} />
                      <LabeledValue label="Identifiable Features" value={formatArray(lostItem.identifiableFeatures)} />
                      <LabeledValue label="Contents" value={formatArray(lostItem.contents)} />
                      <LabeledValue label="Description" value={lostItem.description || "-"} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-lg font-semibold text-green-900 mb-3">
                      Found Item (In Organization&apos;s Possession)
                    </h4>
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No matched item for this request</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}