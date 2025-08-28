import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  showRefreshButton?: boolean;
  showPagination?: boolean;
  columnWidths?: string[];
}

export function TableSkeleton({
  columns = 6,
  rows = 5,
  showRefreshButton = true,
  showPagination = true,
  columnWidths = []
}: TableSkeletonProps) {
  return (
    <div className="p-5 pt-0 space-y-4">
      {/* Refresh button skeleton */}
      {showRefreshButton && (
        <div className="flex justify-end">
          <Skeleton className="h-10 w-24" />
        </div>
      )}

      {/* Table skeleton */}
      <div className="rounded-md border">
        {/* Table header */}
        <div className="border-b bg-gray-50/50">
          <div className="flex items-center h-12 px-4 space-x-4">
            {Array.from({ length: columns }).map((_, index) => (
              <Skeleton 
                key={`header-${index}`} 
                className={`h-4 ${columnWidths[index] || 'w-24'}`} 
              />
            ))}
          </div>
        </div>

        {/* Table rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="border-b last:border-0">
            <div className="flex items-center h-16 px-4 space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={`cell-${rowIndex}-${colIndex}`} className={columnWidths[colIndex] || 'w-24'}>
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Pagination skeleton */}
        {showPagination && (
          <div className="flex items-center justify-between px-4 py-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 6, columnWidths = [] }: { columns?: number; columnWidths?: string[] }) {
  return (
    <div className="flex items-center h-16 px-4 space-x-4 border-b">
      {Array.from({ length: columns }).map((_, index) => (
        <div key={`cell-${index}`} className={columnWidths[index] || 'w-24'}>
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}