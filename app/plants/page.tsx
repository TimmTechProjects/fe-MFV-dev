"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { SlidersHorizontal, Leaf, Heart, Eye, BookOpen, Users } from "lucide-react";
import { getPaginatedPlants, searchEverything } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Collection } from "@/types/collections";
import { UserResult } from "@/types/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  collection?: { id: string; slug: string; name?: string } | null;
}

const plantTypes = ["Succulent", "Tropical", "Herb", "Flowering", "Fern", "Cactus", "Tree", "Vine"];
const sortOptions = ["Most Popular", "Newest", "A-Z", "Z-A"];

function DiscoveryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get("search") || "";
  const initialTab = searchParams.get("tab") || "plants";

  const [plants, setPlants] = useState<PlantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("Most Popular");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [collections, setCollections] = useState<Collection[]>([]);
  const [users, setUsers] = useState<UserResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const pageSize = 20;

  const fetchPlants = useCallback(async () => {
    setLoading(true);
    const { plants: fetched, total: t } = await getPaginatedPlants(page, pageSize);
    setPlants(fetched as unknown as PlantItem[]);
    setTotal(t);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  useEffect(() => {
    if (!initialSearch) return;
    setSearchLoading(true);
    searchEverything(initialSearch).then(({ users: u, collections: c }) => {
      setUsers(u);
      setCollections(c);
    }).finally(() => setSearchLoading(false));
  }, [initialSearch]);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

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

  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = page < totalPages && filtered.length === pageSize;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/plants?${params.toString()}`, { scroll: false });
  };

  const albumsFromPlants = React.useMemo(() => {
    const seen = new Map<string, { id: string; name: string; slug: string; username: string; coverUrl: string | null; count: number }>();
    for (const plant of plants) {
      const col = plant.collection;
      if (!col) continue;
      const key = col.id;
      if (seen.has(key)) {
        const existing = seen.get(key)!;
        existing.count++;
        continue;
      }
      seen.set(key, {
        id: col.id,
        name: col.name || col.slug,
        slug: col.slug,
        username: plant.user?.username || "unknown",
        coverUrl: plant.images?.[0]?.url || null,
        count: 1,
      });
    }
    return Array.from(seen.values());
  }, [plants]);

  const displayAlbums = collections.length > 0
    ? collections
    : albumsFromPlants.map((a) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        createdAt: "",
        updatedAt: "",
        coverImageUrl: a.coverUrl,
        user: { username: a.username },
        _count: { plants: a.count },
      }));

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white">
      <div className="relative overflow-hidden pb-4 pt-8 md:pt-12">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/60 via-white to-[#81a308]/5 dark:from-emerald-900/20 dark:via-black dark:to-[#81a308]/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
            Discover <span className="text-[#81a308]">FloralVault</span>
          </h1>
          <p className="text-zinc-500 dark:text-gray-400 text-xs sm:text-sm md:text-base mb-4">
            {search ? `Results for "${search}"` : "Browse plants, albums, and people"}
          </p>

          <div className="flex border-b border-gray-200 dark:border-gray-800/50">
            {[
              { key: "plants", label: "Plants", icon: <Leaf className="w-3.5 h-3.5" /> },
              { key: "albums", label: "Albums", icon: <BookOpen className="w-3.5 h-3.5" /> },
              { key: "people", label: "People", icon: <Users className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-1.5 px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-medium transition-colors relative ${
                  activeTab === tab.key
                    ? "text-[#81a308]"
                    : "text-gray-500 hover:text-zinc-900 dark:hover:text-gray-300"
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-[#81a308]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        {activeTab === "plants" && (
          <>
            <div className="flex items-center gap-2 md:gap-3 py-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm transition-all border ${
                  showFilters || selectedType
                    ? "bg-[#81a308]/20 border-[#81a308]/40 text-[#81a308]"
                    : "bg-white dark:bg-gray-900/80 border-gray-300 dark:border-gray-700/50 text-gray-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Filters</span>
                {selectedType && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#81a308]" />
                )}
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 sm:px-3 py-2 sm:py-2.5 bg-white dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700/50 rounded-xl text-xs sm:text-sm text-zinc-700 dark:text-gray-300 focus:outline-none focus:border-[#81a308]/50 cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className="text-xs text-gray-500 ml-auto">
                {filtered.length} plant{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            {showFilters && (
              <div className="mb-5 p-3 sm:p-4 bg-gray-100 dark:bg-gray-900/60 backdrop-blur border border-gray-200 dark:border-gray-800/50 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-medium text-zinc-500 dark:text-gray-400 uppercase tracking-wide">Plant Type</h3>
                  {selectedType && (
                    <button
                      onClick={() => setSelectedType(null)}
                      className="text-xs text-[#81a308] hover:text-[#9ec20a] transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {plantTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(selectedType === type ? null : type)}
                      className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-medium transition-all ${
                        selectedType === type
                          ? "bg-[#81a308] text-white shadow-lg shadow-[#81a308]/25"
                          : "bg-gray-200 dark:bg-gray-800/80 text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700/80"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                      <div className="p-2 sm:p-3">
                        <h3 className="font-medium text-zinc-900 dark:text-white text-xs sm:text-sm truncate group-hover:text-[#81a308] transition-colors">
                          {plant.commonName || plant.botanicalName}
                        </h3>
                        {plant.commonName && (
                          <p className="text-[10px] sm:text-xs text-gray-500 italic truncate mt-0.5">{plant.botanicalName}</p>
                        )}
                        <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2 flex-wrap">
                          {plant.type && (
                            <span className="text-[9px] sm:text-[10px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-1.5 sm:px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800/30">
                              {plant.type}
                            </span>
                          )}
                          {plant.tags && plant.tags.slice(0, 1).map((tag) => (
                            <span key={tag.id} className="text-[9px] sm:text-[10px] text-[#81a308]">
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
                  className="px-4 sm:px-5 py-2 bg-white dark:bg-gray-900/80 border border-gray-300 dark:border-gray-800/50 rounded-xl text-xs sm:text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#81a308]/30 transition-all text-zinc-700 dark:text-gray-300"
                >
                  Previous
                </button>
                <span className="text-xs sm:text-sm text-gray-500 px-3">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={!hasNextPage}
                  className="px-4 sm:px-5 py-2 bg-white dark:bg-gray-900/80 border border-gray-300 dark:border-gray-800/50 rounded-xl text-xs sm:text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#81a308]/30 transition-all text-zinc-700 dark:text-gray-300"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "albums" && (
          <>
            {searchLoading || loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pt-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-gray-100 dark:bg-gray-900 animate-pulse aspect-[4/3]" />
                ))}
              </div>
            ) : displayAlbums.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-[#81a308]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-[#81a308]" />
                </div>
                <h3 className="text-lg font-medium text-zinc-600 dark:text-gray-300 mb-2">No albums found</h3>
                <p className="text-gray-500 text-sm">Try a different search or browse all plants</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pt-6">
                {displayAlbums.map((album) => {
                  const coverImage = album.coverImageUrl || null;
                  return (
                    <Link
                      key={album.id}
                      href={`/profiles/${album.user.username}/collections/${album.slug}`}
                      className="group"
                    >
                      <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#81a308]/30">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {coverImage ? (
                            <img
                              src={coverImage}
                              alt={album.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                          <h3 className="font-semibold text-white text-xs sm:text-base truncate">
                            {album.name}
                          </h3>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] sm:text-sm text-gray-300 truncate">
                              @{album.user.username}
                            </span>
                            {album._count?.plants !== undefined && (
                              <span className="text-[10px] sm:text-xs text-[#81a308] font-medium whitespace-nowrap ml-2">
                                {album._count.plants} plant{album._count.plants !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === "people" && (
          <>
            {searchLoading ? (
              <div className="space-y-3 pt-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-gray-100 dark:bg-gray-900 animate-pulse h-16" />
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-[#81a308]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#81a308]" />
                </div>
                <h3 className="text-lg font-medium text-zinc-600 dark:text-gray-300 mb-2">No users found</h3>
                <p className="text-gray-500 text-sm">Search for a username or name to find people</p>
              </div>
            ) : (
              <div className="space-y-2 pt-6">
                {users.map((u) => (
                  <Link
                    key={u.id}
                    href={`/profiles/${u.username}`}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/50 hover:border-[#81a308]/30 transition-all hover:shadow-md"
                  >
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      <AvatarImage src={u.avatarUrl || "/default-avatar.png"} />
                      <AvatarFallback className="bg-[#81a308]/20 text-[#81a308] text-sm">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm sm:text-base text-zinc-900 dark:text-white">
                        {u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.username}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">@{u.username}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const PlantsDiscoveryPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#81a308]" />
      </div>
    }>
      <DiscoveryContent />
    </Suspense>
  );
};

export default PlantsDiscoveryPage;
