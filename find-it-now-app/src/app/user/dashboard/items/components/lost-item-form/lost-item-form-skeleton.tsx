import { Skeleton } from "@/components/ui/skeleton";

export const LostItemFormSkeleton = () => {
  return (
    <div className="p-7 pt-0">
      <div className="pb-12">
        <div className="w-full">
          <div className="space-y-4 lg: space-y-0 lg:grid lg:grid-cols-4 lg:align-top lg:gap-5">
            <Skeleton className="w-30 h-8 lg:w-full" />
            <div className="grid grid-cols-1 gap-4 lg:col-span-3">
              <div>
                <Skeleton className="w-20 h-6 mb-2" />
                <Skeleton className="w-30 h-30 mb-2" />
                <Skeleton className="w-full h-30" />
              </div>
              <div>
                <Skeleton className="w-20 h-6 mb-2" />
                <Skeleton className="w-full h-8" />
              </div>
            </div>
          </div>
          <div className="pt-12 lg:grid lg:grid-cols-4 lg:align-top lg:gap-5">
            <Skeleton className="w-full h-8" />
            <div className="grid grid-cols-1 gap-4 lg:col-span-3">
              <div>
                <Skeleton className="w-20 h-6 mb-2" />
                <Skeleton className="w-full h-8" />
              </div>
              <div>
                <Skeleton className="w-20 h-6 mb-2" />
                <Skeleton className="w-full h-8" />
              </div>
            </div>
          </div>
          <div className="pt-12 lg:grid lg:grid-cols-4 lg:align-top lg:gap-5">
            <Skeleton className="w-full h-8" />
            <div className="grid grid-cols-1 gap-4 lg:col-span-3">
              <div>
                <Skeleton className="w-20 h-6 mb-2" />
                <Skeleton className="w-full h-8" />
              </div>
              <div>
                <Skeleton className="w-20 h-6 mb-2" />
                <Skeleton className="w-full h-8" />
              </div>
              <div>
                <Skeleton className="w-20 h-6 mb-2" />
                <Skeleton className="w-full h-8" />
              </div>
              <div>
                <Skeleton className="w-20 h-6 mb-2" />
                <Skeleton className="w-full h-8" />
              </div>
              <div>
                <Skeleton className="w-20 h-6 mb-2" />
                <Skeleton className="w-full h-8" />
              </div>
              <div>
                <Skeleton className="w-20 h-6 mb-2" />
                <Skeleton className="w-full h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center md:justify-end mt-10">
        <Skeleton className="w-40 h-12" />
      </div>
    </div>
  );
}
