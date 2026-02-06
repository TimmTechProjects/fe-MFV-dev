import {
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
} from "@/components/ui/skeleton";

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto flex">
        <aside className="w-64 flex-shrink-0 p-4 border-r border-gray-800 h-screen sticky top-0">
          <div className="space-y-2">
            <nav className="space-y-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </nav>
            <Skeleton className="h-12 w-full rounded-full mt-8" />
          </div>
        </aside>

        <main className="flex-1 border-r border-gray-800">
          <div className="relative">
            <Skeleton className="h-48 w-full rounded-none" />

            <div className="px-4 pb-4">
              <div className="flex justify-between items-start -mt-16 mb-4">
                <SkeletonAvatar className="w-32 h-32 border-4 border-black" />
                <Skeleton className="mt-16 h-10 w-28 rounded-full" />
              </div>

              <div className="mb-3 space-y-2">
                <SkeletonText className="h-7 w-48" />
                <SkeletonText className="h-4 w-32" />
              </div>

              <SkeletonText className="h-4 w-64 mb-3" />

              <div className="flex items-center gap-4 mb-3">
                <SkeletonText className="h-4 w-36" />
              </div>

              <div className="flex gap-4">
                <SkeletonText className="h-4 w-24" />
                <SkeletonText className="h-4 w-24" />
              </div>
            </div>

            <div className="border-b border-gray-800">
              <div className="flex gap-2 px-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-28 rounded-none" />
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-800">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 flex gap-3">
                <SkeletonAvatar className="w-12 h-12" />
                <div className="flex-1 space-y-3">
                  <div className="flex gap-2">
                    <SkeletonText className="h-4 w-24" />
                    <SkeletonText className="h-4 w-16" />
                  </div>
                  <SkeletonText className="h-4 w-full" />
                  <SkeletonText className="h-4 w-3/4" />
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <div className="flex gap-8">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="h-4 w-8" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className="w-80 p-4 space-y-4">
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </aside>
      </div>
    </div>
  );
}

export default ProfileSkeleton;
