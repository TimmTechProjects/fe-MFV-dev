import {
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
} from "@/components/ui/skeleton";

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-36 sm:h-48 md:h-80 w-full rounded-none" />

        <div className="px-4 pb-4 sm:px-6 sm:pb-6 -mt-10 sm:-mt-16">
          <div className="flex items-end gap-3 sm:gap-6 mb-4">
            <SkeletonAvatar className="w-20 h-20 sm:w-32 sm:h-32 border-2 sm:border-4 border-black" />
            <div className="flex-1 space-y-2">
              <SkeletonText className="h-5 sm:h-7 w-32 sm:w-48" />
              <SkeletonText className="h-3 sm:h-4 w-24 sm:w-32" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 sm:h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 px-4 sm:px-6">
          <div className="lg:w-64 flex-shrink-0">
            <div className="grid grid-cols-2 gap-1 lg:flex lg:flex-col lg:space-y-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-3 sm:space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 sm:p-4 flex gap-2.5 sm:gap-4 rounded-xl bg-zinc-900/50">
                <Skeleton className="w-16 h-16 sm:w-32 sm:h-32 rounded-lg sm:rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2 sm:space-y-3">
                  <SkeletonText className="h-3 sm:h-4 w-24 sm:w-32" />
                  <SkeletonText className="h-3 sm:h-4 w-full" />
                  <SkeletonText className="h-3 sm:h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;
