import React from 'react';
import { Skeleton } from '@/components/ui/loader-skeletons/skeleton';

type Props = {
  rows?: number;
};

const TablePageSkeleton: React.FC<Props> = ({ rows = 5 }) => {
  return (
    <div className="p-6">
      {/* Page header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Skeleton width={28} height={28} rounded="lg" /> {/* icon */}
          <Skeleton width="220px" height="1.75rem" /> {/* title */}
        </div>

        {/* Actions (Add / Refresh) */}
        {/* <div className="flex items-center gap-3">
          <Skeleton width="130px" height="2.25rem" rounded="lg" />
          <Skeleton width="92px" height="2.25rem" rounded="lg" />
          </div> */}
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="mb-2 flex justify-end">
          <Skeleton width="130px" height="2.5rem" rounded="lg" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton width={18} height={18} rounded="full" />
          <Skeleton width="200px" height="1rem" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="mt-2" height="2.5rem" rounded="lg" />
          <Skeleton className="mt-2" width="130px" height="2.5rem" rounded="lg" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border">
        {/* table header */}
        <div className="grid grid-cols-6 items-center bg-gray-50 px-4 py-3 dark:bg-gray-800/40">
          <Skeleton width="70%" height="1rem" />
          <Skeleton width="60%" height="1rem" />
          <Skeleton width="40%" height="1rem" />
          <Skeleton width="35%" height="1rem" />
          <Skeleton width="30%" height="1rem" />
          <Skeleton width="24%" height="1rem" />
        </div>

        {/* table rows */}
        <ul className="divide-y">
          {Array.from({ length: rows }).map((_, i) => (
            <li key={i} className="grid grid-cols-6 items-center px-4 py-4">
              {/* Staff Member */}
              <div className="flex flex-col gap-2">
                <Skeleton width="60%" height="1rem" />
                <Skeleton width="35%" height="0.875rem" />
              </div>

              {/* Email */}
              <Skeleton width="80%" height="1rem" />

              {/* Role badge */}
              <Skeleton width="64px" height="1.75rem" rounded="full" />

              {/* Status badge */}
              <Skeleton width="72px" height="1.75rem" rounded="full" />

              {/* Date */}
              <Skeleton width="90px" height="1rem" />

              {/* Actions */}
              <div className="flex justify-end">
                <Skeleton width="28px" height="28px" rounded="full" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { Skeleton, TablePageSkeleton };
