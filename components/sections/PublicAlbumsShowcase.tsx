"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Leaf } from "lucide-react";
import { getPublicCollections, getAllPlants } from "@/lib/utils";
import { Collection } from "@/types/collections";

export default function PublicAlbumsShowcase() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicCollections(8)
      .then(async (data) => {
        if (data.length > 0) {
          setCollections(data);
          return;
        }
        const plants = await getAllPlants();
        const seen = new Map<string, Collection>();
        for (const plant of plants) {
          const col = plant.collection;
          if (!col || seen.has(col.id)) continue;
          seen.set(col.id, {
            id: col.id,
            name: col.name,
            slug: col.slug,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            coverImageUrl: plant.images?.[0]?.url || null,
            user: plant.user || { username: "unknown" },
            _count: { plants: 0 },
          });
        }
        setCollections(Array.from(seen.values()).slice(0, 8));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white dark:bg-[#0a0a0a] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="w-6 h-6 text-[#81a308]" />
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Explore Public Albums
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-gray-100 dark:bg-zinc-900 animate-pulse aspect-[4/3]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (collections.length === 0) {
    return (
      <section className="w-full bg-white dark:bg-[#0a0a0a] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#81a308]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                Explore Public Albums
              </h2>
            </div>
            <Link
              href="/plants?tab=albums"
              className="self-end sm:self-auto bg-[#81a308] hover:bg-[#6c8a0a] text-white font-medium py-1.5 px-3 sm:py-2.5 sm:px-6 rounded-full text-xs sm:text-sm uppercase tracking-wide transition-all hover:shadow-lg hover:shadow-[#81a308]/25"
            >
              Browse All Albums
            </Link>
          </div>
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
            <BookOpen className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Discover Plant Albums
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              Browse curated plant collections from fellow enthusiasts. Create and share your own albums!
            </p>
            <Link
              href="/plants?tab=albums"
              className="inline-block mt-6 bg-[#81a308] hover:bg-[#6c8a0a] text-white font-medium py-2 px-4 sm:py-2.5 sm:px-6 rounded-full text-xs sm:text-sm transition-all hover:shadow-lg hover:shadow-[#81a308]/25"
            >
              Explore Albums
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white dark:bg-[#0a0a0a] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#81a308]" />
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Explore Public Albums
            </h2>
          </div>
          <Link
            href="/plants?tab=albums"
            className="self-end sm:self-auto bg-[#81a308] hover:bg-[#6c8a0a] text-white font-medium py-1.5 px-3 sm:py-2.5 sm:px-6 rounded-full text-xs sm:text-sm uppercase tracking-wide transition-all hover:shadow-lg hover:shadow-[#81a308]/25"
          >
            Browse All Albums
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {collections.slice(0, 8).map((collection) => {
            const coverImage =
              collection.coverImageUrl ||
              collection.thumbnailImage?.url ||
              collection.plants?.[0]?.images?.[0]?.url ||
              null;

            return (
              <Link
                key={collection.id}
                href={`/profiles/${collection.user.username}/collections/${collection.slug}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#81a308]/30">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={collection.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#81a308]/10 to-emerald-500/10">
                        <Leaf className="w-12 h-12 text-[#81a308]/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                      {collection.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs sm:text-sm text-gray-300 truncate">
                        @{collection.user.username}
                      </span>
                      {collection._count?.plants !== undefined && (
                        <span className="text-xs text-[#81a308] font-medium whitespace-nowrap ml-2">
                          {collection._count.plants} plant
                          {collection._count.plants !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
