import { Skeleton } from "@/components/ui/skeleton";

export function LostItemDetailSkeleton () {

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 align-top">
        <div className="w-full">
          <Skeleton className="w-full aspect-square" />
        </div>

        <div className="bg-gray-50 rounded p-8 space-y-8 lg:col-span-2">
          <div className="flex items-start justify-between">
            <Skeleton className="w-50 h-10"/>
            <Skeleton className="w-20 h-8" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="w-50 h-8"/>
              <Skeleton className="w-full h-6"/>
            </div>

            <div className="space-y-2">
              <Skeleton className="w-50 h-8"/>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-white p-4 rounded border">
                {Array.from({length: 8}).map((_, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Skeleton className="w-20 h-6"/>
                    <Skeleton className="w-25 h-5"/>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({length: 5}).map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Skeleton className="w-20 h-6"/>
                <Skeleton className="w-25 h-5"/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
