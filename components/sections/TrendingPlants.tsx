"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Eye } from "lucide-react";
import { getTrendingPlants, getAllPlants } from "@/lib/utils";
import { Plant } from "@/types/plants";

export default function TrendingPlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingPlants(8)
      .then((data) => {
        if (data.length > 0) {
          setPlants(data);
        } else {
          return getAllPlants().then((allData) => {
            const publicPlants = allData.plants
              .filter((p) => p.isPublic !== false && p.images?.length > 0)
              .sort((a, b) => (b.views || 0) - (a.views || 0));
            setPlants(publicPlants.slice(0, 8));
          });
        }
      })
      .catch(() => setPlants([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-gray-50 dark:bg-[#121212] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-6 h-6 text-[#81a308]" />
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Trending Plants This Week
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-gray-200 dark:bg-zinc-900 animate-pulse aspect-square"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (plants.length === 0) return null;

  return (
    <section className="w-full bg-gray-50 dark:bg-[#121212] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="w-6 h-6 text-[#81a308]" />
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            Trending Plants This Week
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {plants.slice(0, 8).map((plant, index) => {
            const mainImage = plant.images?.[0]?.url || "/fallback.png";
            const plantUrl = plant.user?.username
              ? `/profiles/${plant.user.username}/collections/${plant.collection?.slug || plant.collectionId}/${plant.slug}`
              : "#";

            const viewCount = plant.views || 0;
            const formattedViews =
              viewCount >= 1000
                ? `${(viewCount / 1000).toFixed(1)}k`
                : String(viewCount);

            return (
              <Link key={plant.id} href={plantUrl} className="group">
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#81a308]/30">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={mainImage}
                      alt={plant.commonName || plant.botanicalName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#81a308] text-white text-xs font-bold px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      #{index + 1}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      <Eye className="w-3 h-3" />
                      {formattedViews}
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                      {plant.commonName || plant.botanicalName}
                    </h3>
                    {plant.commonName && plant.botanicalName && (
                      <p className="text-xs text-gray-300 italic truncate mt-0.5">
                        {plant.botanicalName}
                      </p>
                    )}
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
