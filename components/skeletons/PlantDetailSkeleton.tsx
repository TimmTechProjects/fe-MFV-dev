import { Skeleton, SkeletonText, SkeletonImage } from "@/components/ui/skeleton";

export default function PlantDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-zinc-950 pointer-events-none" />

      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Skeleton className="h-4 w-20 rounded" />
            <span className="text-zinc-600">/</span>
            <Skeleton className="h-4 w-14 rounded" />
            <span className="text-zinc-600">/</span>
            <Skeleton className="h-4 w-24 rounded" />
            <span className="text-zinc-600">/</span>
            <Skeleton className="h-4 w-28 rounded" />
          </nav>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-4 w-28 rounded" />
            </div>
            <Skeleton className="h-10 md:h-12 w-72 md:w-96 rounded mb-3" />
            <Skeleton className="h-6 md:h-7 w-48 md:w-64 rounded" />
            <div className="mt-6 h-px bg-gradient-to-r from-emerald-500/50 via-emerald-500/20 to-transparent max-w-xl" />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Image Gallery */}
            <div className="xl:col-span-2">
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-4 border border-zinc-800">
                <SkeletonImage className="w-full aspect-[4/3] rounded-lg" />
                <div className="flex gap-2 mt-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="w-16 h-16 rounded-lg flex-shrink-0" />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Plant Info Card */}
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="w-5 h-5 rounded" />
                  <Skeleton className="h-5 w-36 rounded" />
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`flex items-center justify-between py-2 ${i < 4 ? "border-b border-zinc-700/50" : ""}`}>
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4 rounded" />
                        <SkeletonText className="h-4 w-14" />
                      </div>
                      <SkeletonText className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags Card */}
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="w-5 h-5 rounded" />
                  <Skeleton className="h-5 w-12 rounded" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Contributor Card */}
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
                <Skeleton className="h-5 w-24 rounded mb-4" />
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 rounded" />
                    <SkeletonText className="h-3 w-28" />
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
                <div className="flex gap-3 items-center">
                  <Skeleton className="h-8 w-20 rounded" />
                  <Skeleton className="h-8 w-20 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="h-7 w-40 rounded" />
            </div>
            <div className="space-y-3">
              <SkeletonText className="h-4 w-full" />
              <SkeletonText className="h-4 w-full" />
              <SkeletonText className="h-4 w-5/6" />
              <SkeletonText className="h-4 w-full" />
              <SkeletonText className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* Related Plants Section */}
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-8 border border-emerald-500/10">
            <Skeleton className="h-7 w-40 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <Skeleton className="h-48 w-full rounded-lg mb-3" />
                  <SkeletonText className="h-4 w-full mb-2" />
                  <SkeletonText className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
