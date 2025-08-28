import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const LocationDateFormFillSkeleton = () => {
  return (
    <div className="grid gap-4">
      <div>
        <Skeleton className="bg-primary/20 mb-2 h-4 w-18" />
        <Skeleton className="bg-primary/20 h-9 w-full" />
      </div>
      <div>
        <Skeleton className="bg-primary/20 mb-2 h-4 w-12" />
        <Skeleton className="bg-primary/20 h-9 w-full" />
      </div>
    </div>
  );
};
