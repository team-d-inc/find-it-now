"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type ImageGalleryProps = {
  imageUrls: string[];
  title: string;
};

export function ImageGallery({ imageUrls, title }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden ring-1 ring-black/5 shadow-sm">
        {imageUrls.length > 0 ? (
          <Image
            src={imageUrls[selectedImageIndex]}
            alt={title}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <svg
              className="w-20 h-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {imageUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-2 -mx-2">
          {imageUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={cn(
                "relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 ring-1 ring-black/5",
                selectedImageIndex === index
                  ? "outline-2 outline-blue-500"
                  : "hover:ring-blue-200"
              )}
              aria-label={`Show image ${index + 1}`}
            >
              <Image
                src={url}
                alt={`${title} - Image ${index + 1}`}
                fill
                className="object-contain"
                loading="lazy"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
