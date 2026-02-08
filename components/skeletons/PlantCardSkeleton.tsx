import { Skeleton, SkeletonText, SkeletonImage } from "@/components/ui/skeleton";

function PlantCardSkeleton() {
  return (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900/60">
      <SkeletonImage className="w-full h-full" />
      <div className="absolute inset-x-0 bottom-0 p-4 space-y-2">
        <SkeletonText className="h-5 w-3/4" />
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

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <PlantCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export { PlantCardSkeleton, CollectionDetailSkeleton };
