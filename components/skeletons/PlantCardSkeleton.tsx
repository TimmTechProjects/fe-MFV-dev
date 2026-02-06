import { Skeleton, SkeletonText, SkeletonImage } from "@/components/ui/skeleton";

function PlantCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 border-b border-dashed border-[#dab9df] pb-6">
      <SkeletonImage className="w-full sm:w-48 h-48 flex-shrink-0 rounded-lg" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <SkeletonText className="h-6 w-48" />
          <SkeletonText className="h-4 w-32" />
        </div>
        <SkeletonText className="h-4 w-full" />
        <SkeletonText className="h-4 w-full" />
        <SkeletonText className="h-4 w-3/4" />
        <div className="flex gap-2 mt-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-16 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function CollectionDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8 border-b border-[#dab9df] pb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-48 rounded" />
            <Skeleton className="h-5 w-24 rounded" />
          </div>
          <SkeletonText className="h-4 w-72" />
        </div>
      </div>

      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <PlantCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export { PlantCardSkeleton, CollectionDetailSkeleton };
