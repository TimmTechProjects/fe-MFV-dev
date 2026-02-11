"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllPlants, decodeHtmlEntities } from "@/lib/utils";
import { Plant } from "@/types/plants";

const CARE_TIPS: Record<string, string> = {
  herb: "Herbs thrive in bright light and well-drained soil. Harvest regularly to encourage growth.",
  tree: "Trees need deep watering and plenty of space for root development.",
  shrub: "Prune shrubs after flowering to maintain shape and promote new growth.",
  flower: "Deadhead spent blooms regularly to encourage continuous flowering.",
  succulent: "Allow soil to dry completely between waterings. Bright, indirect light is ideal.",
  cactus: "Water sparingly and provide full sun. These desert natives are drought champions.",
  fern: "Keep soil consistently moist and provide high humidity for lush fronds.",
  bamboo: "Bamboo loves moisture and indirect light. Refresh water weekly for lucky bamboo.",
  grass: "Ornamental grasses are low-maintenance and add movement to any garden.",
  vine: "Provide sturdy support structures and prune to control growth direction.",
  bulb: "Plant bulbs at the correct depth and they will reward you year after year.",
  aquatic: "Aquatic plants need still or slow-moving water and plenty of light.",
  mushroom: "Mushrooms prefer cool, dark, humid environments with rich organic matter.",
};

export default function FeaturedPlantsOfTheWeek() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllPlants()
      .then((data) => {
        const publicPlants = data.plants.filter(
          (p) => p.isPublic !== false && p.images?.length > 0
        );
        const shuffled = publicPlants.sort(() => 0.5 - Math.random());
        setPlants(shuffled.slice(0, 5));
      })
      .catch(() => setPlants([]))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="w-full bg-gray-50 dark:bg-[#121212] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-6 h-6 text-[#81a308]" />
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Featured Plants of the Week
            </h2>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[280px] rounded-2xl bg-gray-200 dark:bg-zinc-900 animate-pulse h-[360px]"
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#81a308]" />
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Featured Plants of the Week
            </h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-[#81a308]/50 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-[#81a308]/50 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {plants.map((plant) => {
            const mainImage = plant.images?.[0]?.url || "/fallback.png";
            const careTip =
              CARE_TIPS[plant.type] ||
              "Every plant has unique needs. Research your specific species for the best care routine.";
            const plantUrl = plant.user?.username
              ? `/profiles/${plant.user.username}/collections/${plant.collection?.slug || plant.collectionId}/${plant.slug}`
              : "#";

            return (
              <div
                key={plant.id}
                className="min-w-[280px] max-w-[300px] flex-shrink-0 snap-start group"
              >
                <div className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#81a308]/30 h-full flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={mainImage}
                      alt={plant.commonName || plant.botanicalName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#81a308] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Featured
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-zinc-900 dark:text-white text-lg leading-tight line-clamp-1">
                      {plant.commonName || plant.botanicalName}
                    </h3>
                    {plant.commonName && plant.botanicalName && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 italic mt-0.5">
                        {plant.botanicalName}
                      </p>
                    )}
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2 flex-1">
                      {plant.description
                        ? decodeHtmlEntities(plant.description)
                            .replace(/<[^>]*>/g, "")
                            .slice(0, 100)
                        : careTip.slice(0, 100)}
                    </p>
                    <Link
                      href={plantUrl}
                      className="mt-3 inline-flex items-center justify-center bg-[#81a308]/10 hover:bg-[#81a308] text-[#81a308] hover:text-white font-medium py-2 px-4 rounded-xl text-sm transition-all duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
