"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Filter, X, SlidersHorizontal, Leaf } from "lucide-react";
import { getPaginatedPlants } from "@/lib/utils";
import Link from "next/link";

interface PlantItem {
  id: string;
  commonName?: string;
  botanicalName: string;
  description: string;
  slug: string;
  origin?: string;
  type?: string;
  views: number;
  tags: { id: string; name: string }[];
  images: { id: string; url: string; isMain: boolean }[];
  user: { username: string; firstName?: string; lastName?: string };
}

const plantTypes = ["Succulent", "Tropical", "Herb", "Flowering", "Fern", "Cactus", "Tree", "Vine"];
const sortOptions = ["Most Popular", "Newest", "A-Z", "Z-A"];

const PlantsDiscoveryPage = () => {
  const [plants, setPlants] = useState<PlantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("Most Popular");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

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

  const filtered = plants
    .filter((p) => {
      const matchesSearch =
        !search ||
        (p.commonName || "").toLowerCase().includes(search.toLowerCase()) ||
        p.botanicalName.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.name.toLowerCase().includes(search.toLowerCase()));
      const matchesType = !selectedType || p.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "Most Popular") return b.views - a.views;
      if (sortBy === "Newest") return 0;
      if (sortBy === "A-Z") return (a.commonName || a.botanicalName).localeCompare(b.commonName || b.botanicalName);
      if (sortBy === "Z-A") return (b.commonName || b.botanicalName).localeCompare(a.commonName || a.botanicalName);
      return 0;
    });

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Discover Plants
          </h1>
          <p className="text-gray-400 text-lg">
            Browse and search our growing catalog of plants
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, botanical name, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#81a308]"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors sm:w-auto"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {selectedType && (
              <span className="bg-[#81a308] text-black text-xs px-2 py-0.5 rounded-full">1</span>
            )}
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#81a308]"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-gray-900 border border-gray-800 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-300">Plant Type</h3>
              {selectedType && (
                <button
                  onClick={() => setSelectedType(null)}
                  className="text-xs text-[#81a308] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {plantTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedType === type
                      ? "bg-[#81a308] text-black font-medium"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-4">
          {filtered.length} plant{filtered.length !== 1 ? "s" : ""} found
        </p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-800" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No plants found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(""); setSelectedType(null); }}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm hover:border-gray-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((plant) => {
              const mainImg = plant.images?.find((img) => img.isMain) || plant.images?.[0];
              return (
                <Link
                  key={plant.id}
                  href={`/the-vault/results?tag=${plant.tags?.[0]?.name || plant.slug}`}
                  className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all group"
                >
                  <div className="aspect-square overflow-hidden bg-gray-800">
                    {mainImg ? (
                      <img
                        src={mainImg.url}
                        alt={plant.commonName || plant.botanicalName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/fallback.png"; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="w-10 h-10 text-gray-700" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-white text-sm truncate group-hover:text-[#81a308] transition-colors">
                      {plant.commonName || plant.botanicalName}
                    </h3>
                    {plant.commonName && (
                      <p className="text-xs text-gray-500 italic truncate">{plant.botanicalName}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {plant.type && (
                        <span className="text-[10px] bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded-full">
                          {plant.type}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-500">{plant.views} views</span>
                    </div>
                    {plant.tags && plant.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {plant.tags.slice(0, 2).map((tag) => (
                          <span key={tag.id} className="text-[10px] text-[#81a308]">
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
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
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm disabled:opacity-50 hover:border-gray-700"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm disabled:opacity-50 hover:border-gray-700"
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
