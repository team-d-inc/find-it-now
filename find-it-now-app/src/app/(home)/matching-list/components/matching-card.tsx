'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { PATHS } from '@/constants/paths';
import { formatDate } from '@/lib/utils';
import { LabeledValue } from '@/components/ui/labeled-value';
import { ChevronRight, ImageOff } from 'lucide-react';
import { useState } from 'react';
import { MatchingResult } from '@/types/type';
import { CircularProgress } from '@/components/ui/circular-progress';

interface MatchingCardProps {
  item: MatchingResult;
  token: string;
  isSelected?: boolean;
  onSelect?: (isSelected: boolean) => void;
}

export const MatchingCard = ({ item, token, isSelected = false, onSelect }: MatchingCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    onSelect?.(!isSelected);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card
      className={`group cursor-pointer overflow-hidden rounded px-4 transition-all duration-300 hover:shadow-lg sm:px-6 ${
        isSelected ? 'ring-primary border-none shadow-lg ring-2' : 'bg-white hover:bg-gray-50'
      }`}
      onClick={handleClick}
    >
      <div className="flex h-auto flex-col gap-4 sm:h-40 sm:flex-row sm:gap-8">
        <div className="relative mx-auto h-40 w-40 flex-shrink-0 overflow-hidden rounded border border-gray-200 shadow-sm sm:mx-0 sm:h-40 sm:w-40">
          {item.thumbnailUrl && !imageError ? (
            <Image
              src={item.thumbnailUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="160px"
              onError={handleImageError}
            />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded bg-gray-100 sm:h-40 sm:w-40">
              <ImageOff className="h-8 w-8 text-gray-400 sm:h-8 sm:w-8" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col py-2 sm:py-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
            <LabeledValue label="Title" value={item.title} valueClassName="whitespace-nowrap overflow-hidden text-ellipsis" />
            <LabeledValue label="Found Date" value={formatDate(item.dateFound?.toString() ?? '')} />
            <LabeledValue label="Found Location" value={item.specificLocation} valueClassName="whitespace-nowrap overflow-hidden text-ellipsis" />
            <LabeledValue label="Category" value={item.categoryName ?? '-'} />
            <LabeledValue label="Brand" value={item.brand ?? '-'} valueClassName="whitespace-nowrap overflow-hidden text-ellipsis" />
            <div>
              <p className="text-primary text-xs font-semibold mb-3">SIMILARITY</p>
              <CircularProgress
                value={item.similarityPercentage}
                size={40}
                strokeWidth={4}
                progressClassName="text-primary"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-2 sm:justify-end sm:pt-0">
          <Link
            href={PATHS.matchingItemDetails({ itemId: item.id, token })}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-primary flex cursor-pointer items-center gap-2 text-sm"
          >
            More
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
};
