import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const TitleFormFillSkeleton = () => {
  return (
    <div className="">
      <div>
        <Skeleton className="bg-primary/20 mb-2 h-4 w-16" />
        <Skeleton className="bg-primary/20 h-9 w-full" />
      </div>
    </div>
  );
};
