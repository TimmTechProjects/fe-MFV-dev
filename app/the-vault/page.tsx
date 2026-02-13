"use client";

import { useState, useEffect, useCallback, useRef, use, useMemo } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Search,
  MoreHorizontal,
  Home,
  Compass,
  ShoppingCart,
  Gavel,
  TrendingUp,
  Users,
  Leaf,
  PlusSquare,
  Bell,
  User,
  ArrowUpDown,
  Eye,
  Loader2,
} from "lucide-react";

interface Plant {
  id: string;
  commonName?: string;
  botanicalName: string;
  description: string;
  likes?: number;
  slug: string;
  origin?: string;
  family?: string;
  type?: string;
  views: number;
  isPublic: boolean;
  userId?: string;
  collectionId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  collection?: {
    id: string;
    slug: string;
    name?: string;
  } | null;
  user: {
    username: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
  tags: {
    id: string;
    name: string;
  }[];
  images: {
    id: string;
    url: string;
    isMain: boolean;
  }[];
}

import { getPaginatedPlants } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import Loading from "../loading";
import Link from "next/link";
import { marketplacePlants } from "@/mock/marketplaceData";
import PostsFeed from "@/components/posts/PostsFeed";
import useAuth from "@/redux/hooks/useAuth";

interface Props {
  searchParams?: Promise<{
    page?: string;
    type?: string;
    tag?: string;
  }>;
}

const limit = 10;

export default function PlantVaultFeed({ searchParams }: Props) {
  const { user, isLoggedIn } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [total, setTotal] = useState(0);
  const [activeFilter, setActiveFilter] = useState("For You");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showMarketplaceContent, setShowMarketplaceContent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileTab, setMobileTab] = useState("home");
  const [searchCategory, setSearchCategory] = useState("all");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [gallerySort, setGallerySort] = useState<"newest" | "oldest" | "popular" | "az">("newest");
  const [galleryPlants, setGalleryPlants] = useState<Plant[]>([]);
  const [galleryPage, setGalleryPage] = useState(1);
  const [galleryHasMore, setGalleryHasMore] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const galleryObserver = useRef<IntersectionObserver | null>(null);
  const galleryEndRef = useRef<HTMLDivElement | null>(null);

  const unwrappedSearchParams = searchParams ? use(searchParams) : {};
  const currentPage = Number(unwrappedSearchParams?.page || 1);
  const selectedType = unwrappedSearchParams?.type;
  const selectedTag = unwrappedSearchParams?.tag;

  const loadGalleryPlants = useCallback(async (page: number, reset = false) => {
    setGalleryLoading(true);
    setFetchError(null);
    try {
      const { plants: fetched, total: t } = await getPaginatedPlants(page, 20);
      if (reset) {
        setGalleryPlants(fetched);
      } else {
        setGalleryPlants((prev) => [...prev, ...fetched]);
      }
      setTotal(t);
      setGalleryHasMore(page * 20 < t);
      setGalleryPage(page);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load plants");
    }
    setGalleryLoading(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeFilter !== "Gallery") {
      setPlants([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    setGalleryPlants([]);
    setGalleryPage(1);
    setGalleryHasMore(true);
    loadGalleryPlants(1, true);
  }, [activeFilter, gallerySort, loadGalleryPlants]);

  useEffect(() => {
    if (activeFilter !== "Gallery" || !galleryHasMore || galleryLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && galleryHasMore && !galleryLoading) {
          loadGalleryPlants(galleryPage + 1);
        }
      },
      { threshold: 0.1 }
    );
    galleryObserver.current = observer;
    if (galleryEndRef.current) observer.observe(galleryEndRef.current);
    return () => observer.disconnect();
  }, [activeFilter, galleryHasMore, galleryLoading, galleryPage, loadGalleryPlants]);

  const totalPages = Math.ceil(total / limit);

  const sortedGalleryPlants = [...galleryPlants].sort((a, b) => {
    switch (gallerySort) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "popular":
        return (b.likes ?? 0) - (a.likes ?? 0);
      case "az":
        return (a.commonName || a.botanicalName).localeCompare(b.commonName || b.botanicalName);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const filters = ["For You", "Following"];

  const [showStickyHeader, setShowStickyHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        setShowStickyHeader(false);
      } else {
        setShowStickyHeader(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setShowMarketplaceContent(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredPlants = plants.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.commonName || "").toLowerCase().includes(q) ||
      p.botanicalName.toLowerCase().includes(q) ||
      p.user.username.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.name.toLowerCase().includes(q)) ||
      (p.collection?.name || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white">
      <div className="max-w-[2400px] mx-auto flex gap-4 lg:gap-6 xl:gap-10 2xl:gap-20 min-[2560px]:gap-32 justify-between px-4 lg:px-6 xl:px-10 2xl:px-16 min-[2560px]:px-24">
        <aside className="hidden lg:block w-48 xl:w-56 2xl:w-72 min-[2560px]:w-80 flex-shrink-0 pt-5 sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#81a308] to-emerald-600 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">The Vault</span>
            </div>
            <nav className="space-y-1">
              <NavItem
                icon={<Home />}
                label="Home"
                active={!showMarketplaceContent && activeFilter === "For You"}
                onClick={() => {
                  setShowMarketplaceContent(false);
                  setActiveFilter("For You");
                  scrollToTop();
                }}
              />
              <NavItem
                icon={<Eye />}
                label="Reels"
              />
              <NavItem
                icon={<MessageCircle />}
                label="Forum"
                href="/forum"
              />
              <NavItem
                icon={<ShoppingCart />}
                label="Marketplace"
                href="/marketplace"
              />
              <NavItem
                icon={<Bookmark />}
                label="Saved"
                href="/saved"
              />
            </nav>

            <button
              onClick={() => {
                setActiveFilter("For You");
                scrollToTop();
              }}
              className="w-full bg-gray-100 dark:bg-gray-900/60 hover:bg-gray-200 dark:hover:bg-gray-800/60 text-gray-500 hover:text-[#81a308] font-medium py-2.5 px-4 rounded-lg mt-4 transition-all text-sm border border-gray-200 dark:border-gray-800/50"
            >
              + Create Post
            </button>

            {isLoggedIn && user ? (
              <div className="mt-8 p-4 rounded-xl bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800/50">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Quick Stats</h4>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Your Plants</span>
                    <span className="text-zinc-900 dark:text-white font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Collections</span>
                    <span className="text-zinc-900 dark:text-white font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Following</span>
                    <span className="text-zinc-900 dark:text-white font-medium">24</span>
                  </div>
                </div>
              </div>
            ) : !isLoggedIn ? (
              <div className="mt-8 p-4 rounded-xl bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800/50 text-center">
                <div className="w-10 h-10 rounded-full bg-[#81a308]/10 flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-5 h-5 text-[#81a308]" />
                </div>
                <p className="text-sm text-zinc-600 dark:text-gray-400 mb-3">Sign up to track your plants</p>
                <Link href="/signup" className="block w-full bg-[#81a308] hover:bg-[#6c8a0a] text-white font-medium py-2 px-4 rounded-lg transition-all text-sm">
                  Sign Up
                </Link>
              </div>
            ) : null}
          </div>
        </aside>

        <main className="flex-1 w-full max-w-2xl pb-20 lg:pb-0 mx-auto">
          <div className={`sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800/50 z-10 transition-transform duration-300 ${showStickyHeader ? "translate-y-0" : "-translate-y-full"}`}>
            <div className="p-4">
              {showMarketplaceContent && (
                <h1 className="text-xl font-bold">Marketplace</h1>
              )}
              {!showMarketplaceContent && mobileTab === "search" && (
                <h1 className="text-xl font-bold lg:hidden">Search</h1>
              )}
            </div>

            {!showMarketplaceContent && (
              <div className="flex">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterClick(filter)}
                    className={`flex-1 px-6 py-3.5 text-sm font-medium transition-colors relative ${
                      activeFilter === filter
                        ? "text-white"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {filter}
                    {activeFilter === filter && (
                      <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-[#81a308]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>


          {mobileTab === "search" && (
            <div className="lg:hidden">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search plants, people, tags..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setSearchSubmitted(false); }}
                    onKeyDown={(e) => { if (e.key === "Enter" && searchQuery.trim()) setSearchSubmitted(true); }}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/60 border border-gray-800/50 rounded-full outline-none text-white placeholder-gray-500 focus:border-[#81a308]/40 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              {!searchSubmitted && !searchQuery.trim() && (
                <div className="px-4 pb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Suggestions</p>
                  <div className="space-y-1">
                    {["Monstera", "Succulents", "Rare Plants", "Beginner Friendly", "Indoor Plants"].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSearchQuery(s); setSearchSubmitted(true); }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-900/60 transition-colors text-left"
                      >
                        <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(searchSubmitted || searchQuery.trim()) && (
                <>
                  <div className="flex border-b border-gray-800/50 px-2">
                    {["all", "plants", "people"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSearchCategory(cat)}
                        className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors relative ${
                          searchCategory === cat ? "text-white" : "text-gray-500"
                        }`}
                      >
                        {cat === "all" ? "All" : cat === "plants" ? "Plants" : "People"}
                        {searchCategory === cat && (
                          <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-[#81a308]" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="divide-y divide-gray-800/50">
                    {filteredPlants.length === 0 ? (
                      <div className="flex flex-col items-center py-16 text-center">
                        <Search className="w-10 h-10 text-gray-600 mb-3" />
                        <p className="text-gray-400 text-sm">No results for &ldquo;{searchQuery}&rdquo;</p>
                        <p className="text-gray-600 text-xs mt-1">Try a different search term</p>
                      </div>
                    ) : (
                      (searchCategory === "all" || searchCategory === "plants"
                        ? filteredPlants
                        : []
                      ).map((plant) => <PlantPost key={plant.id} plant={plant} />)
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {mobileTab !== "search" && !showMarketplaceContent ? (
            <div>
              {activeFilter === "For You" ? (
                <div className="p-4">
                  <PostsFeed hideCreatePost={!showStickyHeader} />
                </div>
              ) : activeFilter === "Following" ? (
                <div className="p-4">
                  <PostsFeed hideCreatePost={!showStickyHeader} />
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {total > 0 ? `${total} plants` : ""}
                    </p>
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                      <select
                        value={gallerySort}
                        onChange={(e) => setGallerySort(e.target.value as typeof gallerySort)}
                        className="text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-zinc-700 dark:text-zinc-300 outline-none focus:border-[#81a308]/50"
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="popular">Most Liked</option>
                        <option value="az">A → Z</option>
                      </select>
                    </div>
                  </div>

                  {loading && galleryPlants.length === 0 ? (
                    <div className="columns-2 sm:columns-3 gap-3 space-y-3">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="break-inside-avoid rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 animate-pulse" style={{ height: `${180 + (i % 3) * 60}px` }} />
                      ))}
                    </div>
                  ) : fetchError ? (
                    <div className="flex flex-col justify-center items-center py-20 text-center">
                      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <Leaf className="w-8 h-8 text-red-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">Could not load plants</h3>
                      <p className="text-gray-500 max-w-md text-sm">{fetchError}</p>
                    </div>
                  ) : sortedGalleryPlants.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-20 text-center">
                      <div className="w-16 h-16 bg-[#81a308]/10 rounded-full flex items-center justify-center mb-4">
                        <Leaf className="w-8 h-8 text-[#81a308]" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">No plants to show</h3>
                      <p className="text-gray-500 max-w-md text-sm">Browse the Gallery to discover plants from the community!</p>
                    </div>
                  ) : (
                    <>
                      <div className="columns-2 sm:columns-3 gap-3 space-y-3">
                        {sortedGalleryPlants.map((plant) => (
                          <GalleryCard key={plant.id} plant={plant} />
                        ))}
                      </div>
                      <div ref={galleryEndRef} className="h-10" />
                      {galleryLoading && (
                        <div className="flex justify-center py-6">
                          <Loader2 className="w-6 h-6 animate-spin text-[#81a308]" />
                        </div>
                      )}
                      {!galleryHasMore && galleryPlants.length > 0 && (
                        <p className="text-center text-xs text-zinc-500 py-4">You&apos;ve seen all plants</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ) : mobileTab !== "search" ? (
            <MarketplaceContent />
          ) : null}
        </main>

        <aside className="hidden lg:block w-56 xl:w-80 2xl:w-96 min-[2560px]:w-[26rem] pt-5 space-y-5 sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search plants, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/50 rounded-lg outline-none text-zinc-900 dark:text-white placeholder-gray-500 focus:border-[#81a308]/40 transition-all text-sm"
            />
          </div>

          <div className="bg-gray-100 dark:bg-gray-900/40 rounded-2xl p-4 border border-gray-200 dark:border-gray-800/30">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#81a308]" />
              <h2 className="font-bold text-base text-zinc-900 dark:text-white">Trending</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <TrendingUp className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No trending content yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">🌱 Plants • 💬 Forums • 📅 Events</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-gray-800/50 z-50 lg:hidden">
        <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
          <button
            onClick={() => { setMobileTab("home"); setShowMarketplaceContent(false); setActiveFilter("For You"); scrollToTop(); }}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${mobileTab === "home" ? "text-[#81a308]" : "text-gray-500"}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>
          <button
            onClick={() => { setMobileTab("search"); setSearchSubmitted(false); window.scrollTo(0, 0); }}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${mobileTab === "search" ? "text-[#81a308]" : "text-gray-500"}`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px]">Search</span>
          </button>
          <button
            onClick={() => { setMobileTab("home"); setActiveFilter("For You"); scrollToTop(); }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#81a308] text-white shadow-lg -mt-4"
          >
            <PlusSquare className="w-5 h-5" />
          </button>
          <Link
            href="/forum"
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-gray-500 hover:text-[#81a308] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px]">Forum</span>
          </Link>
          <button
            onClick={() => setMobileTab("notifications")}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${mobileTab === "notifications" ? "text-[#81a308]" : "text-gray-500"}`}
          >
            <Bell className="w-5 h-5" />
            <span className="text-[10px]">Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
}) {
  if (href) {
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-900/60 transition-all text-sm ${
          active ? "font-semibold bg-gray-200 dark:bg-gray-900/40 text-zinc-900 dark:text-white" : "font-normal text-zinc-600 dark:text-gray-300"
        }`}
      >
        <span className="w-5 h-5">{icon}</span>
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-900/60 transition-all text-sm w-full text-left ${
        active ? "font-semibold bg-gray-200 dark:bg-gray-900/40 text-zinc-900 dark:text-white" : "font-normal text-zinc-600 dark:text-gray-300"
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function PlantPost({ plant }: { plant: Plant }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(plant.likes ?? 0);
  const [saved, setSaved] = useState(false);
  const [commentCount] = useState(Math.floor(Math.random() * 30) + 2);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
  };

  const timeAgo = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const mainImage =
    plant.images?.find((img) => img.isMain) || plant.images?.[0];

  return (
    <article className="p-4 hover:bg-gray-100 dark:hover:bg-gray-950/30 transition-colors">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-800">
          {plant.user.avatarUrl ? (
            <img
              src={plant.user.avatarUrl}
              alt={plant.user.username}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#81a308] to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {plant.user.firstName?.[0] ||
                  plant.user.username[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-semibold text-zinc-900 dark:text-white text-sm hover:underline cursor-pointer">
              {plant.user.firstName && plant.user.lastName
                ? `${plant.user.firstName} ${plant.user.lastName}`
                : plant.user.username}
            </span>
            <span className="text-gray-500 text-xs">
              @{plant.user.username}
            </span>
            <span className="text-gray-600 text-xs">&middot;</span>
            <span className="text-gray-500 text-xs">
              {timeAgo(plant.createdAt)}
            </span>
            <div className="ml-auto">
              <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800/60 rounded-lg transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-zinc-900 dark:text-white text-sm leading-relaxed line-clamp-3">
              <span className="font-medium">{plant.commonName}</span>
              {plant.description && (
                <span className="text-zinc-600 dark:text-gray-300"> — {plant.description}</span>
              )}
            </p>
            {plant.description && plant.description.length > 80 && (
              <button className="text-xs text-gray-500/70 hover:text-gray-400 mt-1 transition-colors">view all</button>
            )}

            {plant.botanicalName && (
              <p className="text-gray-500 text-xs italic mt-1.5">
                {plant.botanicalName}
              </p>
            )}

            {plant.tags && plant.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {plant.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/plants?search=${tag.name}`}
                    className="text-[#81a308] hover:text-[#9ec20a] text-xs"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {mainImage && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800/50">
              <img
                src={mainImage.url}
                alt={plant.commonName || "Plant image"}
                className="w-full max-h-[28rem] object-cover"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = "/fallback.png"; }}
              />
            </div>
          )}

          <div className="bg-gray-100 dark:bg-gray-900/30 rounded-xl p-3 mb-3 border border-gray-200 dark:border-gray-800/30">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-zinc-900 dark:text-white text-sm">{plant.commonName}</h3>
                {plant.type && (
                  <span className="bg-green-900/20 text-green-400 px-2 py-0.5 rounded-full text-[10px] border border-green-800/20">
                    {plant.type}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {plant.origin && <span>{plant.origin}</span>}
                <span>{plant.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <button
                onClick={handleLike}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-500/5 transition-all group"
              >
                <Heart
                  className={`w-[18px] h-[18px] transition-all ${
                    liked
                      ? "text-red-500 fill-red-500 scale-110"
                      : "text-gray-500 group-hover:text-red-400"
                  }`}
                />
                <span
                  className={`text-xs transition-colors ${
                    liked
                      ? "text-red-500"
                      : "text-gray-500 group-hover:text-red-400"
                  }`}
                >
                  {likeCount}
                </span>
              </button>

              <button
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#81a308]/5 transition-all group"
              >
                <MessageCircle className="w-[18px] h-[18px] text-gray-500 group-hover:text-[#81a308]" />
                <span className="text-xs text-gray-500 group-hover:text-[#81a308]">
                  {commentCount}
                </span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const url = `${window.location.origin}/plants?search=${plant.tags?.[0]?.name || plant.slug}`;
                  if (navigator.share) {
                    navigator.share({ title: plant.commonName || plant.botanicalName, text: plant.description?.substring(0, 100), url });
                  } else {
                    navigator.clipboard.writeText(url);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-500/5 transition-all group"
              >
                <Share2 className="w-[18px] h-[18px] text-gray-500 group-hover:text-blue-400" />
              </button>
            </div>

            <button
              onClick={handleSave}
              className="p-1.5 rounded-lg hover:bg-[#81a308]/5 transition-all group"
            >
              <Bookmark
                className={`w-[18px] h-[18px] transition-all ${
                  saved
                    ? "text-[#81a308] fill-[#81a308]"
                    : "text-gray-500 group-hover:text-[#81a308]"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function GalleryCard({ plant }: { plant: Plant }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(plant.likes ?? 0);
  const [saved, setSaved] = useState(false);

  const mainImage = plant.images?.find((img) => img.isMain) || plant.images?.[0];

  return (
    <Link
      href={
        plant.collection && plant.user
          ? `/profiles/${plant.user.username}/collections/${plant.collection.slug}/${plant.slug}`
          : `/plants?search=${plant.slug}`
      }
      className="break-inside-avoid block group relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/60 hover:border-[#81a308]/40 transition-all duration-200"
    >
      <div className="relative">
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={plant.commonName || plant.botanicalName}
            className="w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = "/fallback.png"; }}
          />
        ) : (
          <div className="w-full aspect-square bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <Leaf className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); setLikeCount((c) => liked ? c - 1 : c + 1); }}
                className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-red-500/80 transition-colors"
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? "text-red-400 fill-red-400" : "text-white"}`} />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSaved(!saved); }}
                className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-[#81a308]/80 transition-colors"
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? "text-[#81a308] fill-[#81a308]" : "text-white"}`} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigator.clipboard.writeText(`${window.location.origin}/plants?search=${plant.slug}`);
                }}
                className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-blue-500/80 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            {likeCount > 0 && (
              <span className="text-[10px] text-white/80 font-medium">{likeCount} likes</span>
            )}
          </div>
        </div>

        {plant.type && (
          <span className="absolute top-2 left-2 text-[10px] font-medium bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
            {plant.type}
          </span>
        )}
      </div>

      <div className="p-2.5">
        <h3 className="text-xs font-semibold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-[#81a308] transition-colors">
          {plant.commonName || plant.botanicalName}
        </h3>
        {plant.commonName && plant.botanicalName && (
          <p className="text-[10px] text-zinc-500 italic line-clamp-1 mt-0.5">{plant.botanicalName}</p>
        )}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
            {plant.user.avatarUrl ? (
              <img src={plant.user.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#81a308] to-emerald-600 flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">{(plant.user.firstName?.[0] || plant.user.username[0]).toUpperCase()}</span>
              </div>
            )}
          </div>
          <span className="text-[10px] text-zinc-500 truncate">@{plant.user.username}</span>
        </div>
      </div>
    </Link>
  );
}

function MarketplaceContent() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
          Plant Marketplace
        </h1>
        <p className="text-zinc-500 dark:text-gray-400">
          Discover beautiful plants from trusted sellers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {marketplacePlants.map((plant) => (
          <div
            key={plant.id}
            className="bg-white dark:bg-gray-900/40 rounded-2xl overflow-hidden transition-all duration-200 group hover:shadow-lg hover:shadow-[#81a308]/10 border border-gray-200 dark:border-gray-800/30 hover:border-[#81a308]/20"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={plant.image || "/fallback.png"}
                alt={plant.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = "/fallback.png"; }}
              />
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {plant.sale && (
                  <span className="bg-red-500/90 backdrop-blur text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {plant.sale}
                  </span>
                )}
                {plant.freeShipping && (
                  <span className="bg-blue-500/90 backdrop-blur text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    Free Ship
                  </span>
                )}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-medium text-zinc-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-[#81a308] transition-colors cursor-pointer text-sm">
                {plant.name}
              </h3>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-xs">&#9733;</span>
                  <span className="text-xs text-zinc-900 dark:text-white">{plant.rating}</span>
                </div>
                <span className="text-[10px] text-gray-500">
                  ({plant.reviews})
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3 hover:text-[#81a308] cursor-pointer transition-colors">
                by {plant.shop}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-zinc-900 dark:text-white">
                  {plant.price}
                </span>
                <div className="flex items-center gap-1.5">
                  {(plant.listingType === "buy" || plant.listingType === "both") && (
                    <button className="flex items-center gap-1 px-2.5 py-1.5 text-white text-[11px] rounded-full bg-[#81a308] hover:bg-[#6c8a0a] transition-all font-medium">
                      <ShoppingCart className="w-3 h-3" />
                      Cart
                    </button>
                  )}
                  {(plant.listingType === "auction" || plant.listingType === "both") && (
                    <button className="flex items-center gap-1 px-2.5 py-1.5 text-white text-[11px] rounded-full bg-amber-600 hover:bg-amber-700 transition-all font-medium">
                      <Gavel className="w-3 h-3" />
                      Bid
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
