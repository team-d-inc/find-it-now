import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const CharacteristicsFormFillSkeleton = () => {
  return (
    <div>
      <div className="grid gap-4">
        <div>
          <Skeleton className="bg-primary/20 mb-2 h-4 w-18" />
          <Skeleton className="bg-primary/20 mb-2 h-9 w-full" />
        </div>
        <div>
          <Skeleton className="bg-primary/20 mb-2 h-4 w-15" />
          <Skeleton className="bg-primary/20 mb-2 h-9 w-full" />
          <Skeleton className="bg-primary/20 mb-2 h-3 max-w-[280px]" />
        </div>
        <div>
          <Skeleton className="bg-primary/20 mb-2 h-4 w-18" />
          <Skeleton className="bg-primary/20 mb-2 h-9 w-full" />
        </div>
        <div>
          <Skeleton className="bg-primary/20 mb-2 h-4 w-20" />
          <Skeleton className="bg-primary/20 mb-2 h-9 w-full" />
        </div>
        <div>
          <Skeleton className="bg-primary/20 mb-2 h-4 w-21" />
          <Skeleton className="bg-primary/20 mb-2 h-9 w-full" />
        </div>
        <div>
          <Skeleton className="bg-primary/20 mb-2 h-4 w-12" />
          <Skeleton className="bg-primary/20 mb-2 h-9 w-full" />
        </div>
        <div>
          <Skeleton className="bg-primary/20 mb-2 h-4 w-20" />
          <Skeleton className="bg-primary/20 mb-2 h-9 min-h-[80px] w-full" />
          <Skeleton className="bg-primary/20 mb-2 h-3 max-w-[280px]" />
        </div>
        <div>
          <div className="flex gap-2">
            <Skeleton className="bg-primary/20 mb-2 h-4 w-28" />
            <Skeleton className="bg-primary/20 mb-2 h-4 w-24" />
          </div>
          <Skeleton className="bg-primary/20 mb-2 h-9 min-h-[80px] w-full" />
          <Skeleton className="bg-primary/20 mb-2 h-3 max-w-[280px]" />
        </div>
        <div>
          <Skeleton className="bg-primary/20 mb-2 h-4 w-26" />
          <Skeleton className="bg-primary/20 mb-2 h-9 min-h-[80px] w-full" />
          <Skeleton className="bg-primary/20 mb-2 h-3 max-w-[280px]" />
        </div>
      </div>
    </div>
  );
};
