"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, Leaf, Heart, Eye } from "lucide-react";
import { getPaginatedPlants, fetchAllTraits } from "@/lib/utils";
import { Trait, TraitCategory, PlantPrimaryType } from "@/types/plants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

interface PlantItem {
  id: string;
  commonName?: string;
  botanicalName: string;
  description: string;
  slug: string;
  origin?: string;
  type?: string;
  primaryType?: PlantPrimaryType;
  views: number;
  tags: { id: string; name: string }[];
  plantTraits?: { trait: Trait }[];
  images: { id: string; url: string; isMain: boolean }[];
  user: { username: string; firstName?: string; lastName?: string };
}

const PRIMARY_TYPES: { value: PlantPrimaryType; label: string }[] = [
  { value: "TREE", label: "Tree" },
  { value: "SHRUB", label: "Shrub" },
  { value: "HERBACEOUS", label: "Herbaceous" },
  { value: "VINE_CLIMBER", label: "Vine / Climber" },
  { value: "FERN", label: "Fern" },
  { value: "SUCCULENT", label: "Succulent" },
  { value: "GRASS", label: "Grass" },
  { value: "FUNGUS", label: "Fungus" },
  { value: "AQUATIC", label: "Aquatic" },
];

const CATEGORY_LABELS: Record<TraitCategory, string> = {
  BLOOMING_LIFECYCLE: "Blooming & Lifecycle",
  ENVIRONMENT_GROWTH: "Environment & Growth",
  USE_ORIGIN: "Use & Origin",
};

const CATEGORY_ORDER: TraitCategory[] = [
  "BLOOMING_LIFECYCLE",
  "ENVIRONMENT_GROWTH",
  "USE_ORIGIN",
];

const sortOptions = ["Most Popular", "Newest", "A-Z", "Z-A"];

const PlantsDiscoveryPage = () => {
  const searchParams = useSearchParams();
  const [plants, setPlants] = useState<PlantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPrimaryType, setSelectedPrimaryType] = useState<string | null>(null);
  const [selectedTraitSlugs, setSelectedTraitSlugs] = useState<string[]>([]);
  const [allTraits, setAllTraits] = useState<Trait[]>([]);
  const [sortBy, setSortBy] = useState("Most Popular");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchAllTraits().then(setAllTraits);
  }, []);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    const traitParams = searchParams.getAll("trait");
    if (typeParam) {
      setSelectedPrimaryType(typeParam);
      setShowFilters(true);
    }
    if (traitParams.length > 0) {
      setSelectedTraitSlugs(traitParams);
      setShowFilters(true);
    }
  }, [searchParams]);

  const fetchPlants = useCallback(async () => {
    setLoading(true);
    const { plants: fetched, total: t } = await getPaginatedPlants(page, 20);
    setPlants(fetched as unknown as PlantItem[]);
    setTotal(t);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  const traitsByCategory = CATEGORY_ORDER.reduce<Record<string, Trait[]>>((acc, cat) => {
    acc[cat] = allTraits.filter((t) => t.category === cat);
    return acc;
  }, {});

  const toggleTraitSlug = (slug: string) => {
    setSelectedTraitSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const filtered = plants
    .filter((p) => {
      const matchesSearch =
        !search ||
        (p.commonName || "").toLowerCase().includes(search.toLowerCase()) ||
        p.botanicalName.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.name.toLowerCase().includes(search.toLowerCase()));
      const matchesPrimaryType =
        !selectedPrimaryType || p.primaryType === selectedPrimaryType;
      const matchesTraits =
        selectedTraitSlugs.length === 0 ||
        selectedTraitSlugs.every((slug) =>
          p.plantTraits?.some((pt) => pt.trait.slug === slug)
        );
      return matchesSearch && matchesPrimaryType && matchesTraits;
    })
    .sort((a, b) => {
      if (sortBy === "Most Popular") return b.views - a.views;
      if (sortBy === "Newest") return 0;
      if (sortBy === "A-Z") return (a.commonName || a.botanicalName).localeCompare(b.commonName || b.botanicalName);
      if (sortBy === "Z-A") return (b.commonName || b.botanicalName).localeCompare(a.commonName || a.botanicalName);
      return 0;
    });

  const hasActiveFilters = !!selectedPrimaryType || selectedTraitSlugs.length > 0;

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white">
      <div className="relative overflow-hidden pb-6 pt-10 md:pt-14">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/60 via-white to-[#81a308]/5 dark:from-emerald-900/20 dark:via-black dark:to-[#81a308]/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-1">
            Discover <span className="text-[#81a308]">Plants</span>
          </h1>
          <p className="text-zinc-500 dark:text-gray-400 text-sm md:text-base mb-6">
            Browse and search our growing catalog
          </p>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search plants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900/80 backdrop-blur border border-gray-300 dark:border-gray-700/50 rounded-xl text-sm text-zinc-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-[#81a308]/50 focus:ring-1 focus:ring-[#81a308]/25 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm transition-all border ${
                showFilters || hasActiveFilters
                  ? "bg-[#81a308]/20 border-[#81a308]/40 text-[#81a308]"
                  : "bg-white dark:bg-gray-900/80 border-gray-300 dark:border-gray-700/50 text-gray-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#81a308]" />
              )}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 bg-white dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700/50 rounded-xl text-sm text-zinc-700 dark:text-gray-300 focus:outline-none focus:border-[#81a308]/50 cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        {showFilters && (
          <div className="mb-5 p-4 bg-gray-100 dark:bg-gray-900/60 backdrop-blur border border-gray-200 dark:border-gray-800/50 rounded-2xl space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-zinc-500 dark:text-gray-400 uppercase tracking-wide">Primary Type</h3>
                {selectedPrimaryType && (
                  <button
                    onClick={() => setSelectedPrimaryType(null)}
                    className="text-xs text-[#81a308] hover:text-[#9ec20a] transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {PRIMARY_TYPES.map((pt) => (
                  <button
                    key={pt.value}
                    onClick={() => setSelectedPrimaryType(selectedPrimaryType === pt.value ? null : pt.value)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selectedPrimaryType === pt.value
                        ? "bg-[#81a308] text-white shadow-lg shadow-[#81a308]/25"
                        : "bg-gray-200 dark:bg-gray-800/80 text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700/80"
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>

            {allTraits.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-medium text-zinc-500 dark:text-gray-400 uppercase tracking-wide">
                    Traits {selectedTraitSlugs.length > 0 && `(${selectedTraitSlugs.length} selected)`}
                  </h3>
                  {selectedTraitSlugs.length > 0 && (
                    <button
                      onClick={() => setSelectedTraitSlugs([])}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {CATEGORY_ORDER.map((category) => (
                    <div key={category}>
                      <p className="text-[10px] font-semibold text-[#81a308] uppercase tracking-wider mb-2">
                        {CATEGORY_LABELS[category]}
                      </p>
                      <div className="space-y-1">
                        {(traitsByCategory[category] || []).map((trait) => (
                          <label
                            key={trait.id}
                            className="flex items-center gap-2 cursor-pointer text-xs text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white transition-colors py-0.5"
                          >
                            <Checkbox
                              checked={selectedTraitSlugs.includes(trait.slug)}
                              onCheckedChange={() => toggleTraitSlug(trait.slug)}
                              className="h-3.5 w-3.5 border-zinc-400 dark:border-zinc-600 data-[state=checked]:bg-[#81a308] data-[state=checked]:border-[#81a308]"
                            />
                            <span>{trait.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500 mb-4">
          {filtered.length} plant{filtered.length !== 1 ? "s" : ""} found
        </p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden animate-pulse bg-gray-100 dark:bg-gray-900">
                              <div className="aspect-square bg-gray-200 dark:bg-gray-800" />
                              <div className="p-3 space-y-2">
                                <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#81a308]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-[#81a308]" />
            </div>
            <h3 className="text-lg font-medium text-zinc-600 dark:text-gray-300 mb-2">No plants found</h3>
            <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(""); setSelectedType(null); }}
              className="px-5 py-2 bg-[#81a308]/15 border border-[#81a308]/30 rounded-xl text-sm text-[#81a308] hover:bg-[#81a308]/25 transition-all"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((plant) => {
              const mainImg = plant.images?.find((img) => img.isMain) || plant.images?.[0];
              return (
                <Link
                  key={plant.id}
                  href={`/the-vault/results?tag=${plant.tags?.[0]?.name || plant.slug}`}
                  className="group rounded-2xl overflow-hidden bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/50 hover:border-[#81a308]/30 transition-all hover:shadow-lg hover:shadow-[#81a308]/5"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                    {mainImg ? (
                      <img
                        src={mainImg.url}
                        alt={plant.commonName || plant.botanicalName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/fallback.png"; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-900/20 to-[#81a308]/10">
                        <Leaf className="w-10 h-10 text-gray-400 dark:text-gray-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1.5 text-white/80 text-xs">
                        <Eye className="w-3.5 h-3.5" />
                        {plant.views}
                      </div>
                      <Heart className="w-4 h-4 text-white/80" />
                    </div>
                  </div>
                  <div className="p-3">
                                        <h3 className="font-medium text-zinc-900 dark:text-white text-sm truncate group-hover:text-[#81a308] transition-colors">
                                          {plant.commonName || plant.botanicalName}
                    </h3>
                    {plant.commonName && (
                      <p className="text-xs text-gray-500 italic truncate mt-0.5">{plant.botanicalName}</p>
                    )}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {plant.type && (
                        <span className="text-[10px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800/30">
                          {plant.type}
                        </span>
                      )}
                      {plant.tags && plant.tags.slice(0, 1).map((tag) => (
                        <span key={tag.id} className="text-[10px] text-[#81a308]">
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-5 py-2 bg-gray-900/80 border border-gray-800/50 rounded-xl text-sm disabled:opacity-30 hover:border-[#81a308]/30 transition-all"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500 px-3">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-5 py-2 bg-gray-900/80 border border-gray-800/50 rounded-xl text-sm disabled:opacity-30 hover:border-[#81a308]/30 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantsDiscoveryPage;
