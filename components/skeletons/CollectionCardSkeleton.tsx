import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

function CollectionCardSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden w-56 h-72 sm:w-60 sm:h-80">
      <Skeleton className="w-full h-full rounded-2xl" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 z-10">
        <SkeletonText className="h-5 w-3/4 bg-gray-700" />
      </div>
    </div>
  );
}

function CollectionsPageSkeleton() {
  return (
    <div className="text-white px-10 py-10">
      <div className="mb-10 ml-4 flex gap-2">
        <Skeleton className="h-8 w-48 rounded" />
      </div>
      <div className="flex flex-wrap gap-16">
        {Array.from({ length: 4 }).map((_, i) => (
          <CollectionCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export { CollectionCardSkeleton, CollectionsPageSkeleton };
