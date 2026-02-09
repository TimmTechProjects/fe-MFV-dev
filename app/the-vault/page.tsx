"use client";

import { useState, useEffect, use } from "react";
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
  ImageIcon,
  VideoIcon,
  Smile,
  TrendingUp,
  Users,
  Leaf,
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

interface Props {
  searchParams?: Promise<{
    page?: string;
    type?: string;
    tag?: string;
  }>;
}

const limit = 10;

export default function PlantVaultFeed({ searchParams }: Props) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [total, setTotal] = useState(0);
  const [activeFilter, setActiveFilter] = useState("Feed");
  const [loading, setLoading] = useState(true);
  const [showMarketplaceContent, setShowMarketplaceContent] = useState(false);

  const unwrappedSearchParams = searchParams ? use(searchParams) : {};
  const currentPage = Number(unwrappedSearchParams?.page || 1);
  const selectedType = unwrappedSearchParams?.type;
  const selectedTag = unwrappedSearchParams?.tag;

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getPaginatedPlants(currentPage, limit).then(
      ({ plants: fetchedPlants, total }) => {
        if (!ignore) {
          setPlants(fetchedPlants);
          setTotal(total);
          setLoading(false);
        }
      }
    );
    return () => {
      ignore = true;
    };
  }, [currentPage]);

  const totalPages = Math.ceil(total / limit);

  const filters = ["Feed", "Gallery", "Forum"];

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setShowMarketplaceContent(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto flex">
        <aside className="hidden lg:block w-64 flex-shrink-0 p-5 border-r border-gray-800/50 h-screen sticky top-0">
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">The Vault</span>
            </div>
            <nav className="space-y-1">
              <NavItem
                icon={<Home />}
                label="Home"
                active={!showMarketplaceContent && activeFilter === "Feed"}
                onClick={() => {
                  setShowMarketplaceContent(false);
                  setActiveFilter("Feed");
                }}
              />
              <NavItem icon={<Compass />} label="Explore" />
              <NavItem icon={<Bookmark />} label="Saved" />
              <NavItem
                icon={<ShoppingCart />}
                label="Marketplace"
                href="/marketplace"
              />
            </nav>

            <Link
              href="/forum"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl mt-4 transition-all hover:shadow-lg hover:shadow-purple-500/25 block text-center"
            >
              Create Post
            </Link>

            <div className="mt-8 p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Quick Stats</h4>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Your Plants</span>
                  <span className="text-white font-medium">12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Collections</span>
                  <span className="text-white font-medium">3</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Following</span>
                  <span className="text-white font-medium">24</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 border-r border-gray-800/50">
          <div className="sticky top-0 bg-black/90 backdrop-blur-xl border-b border-gray-800/50 z-10">
            <div className="p-4">
              <h1 className="text-xl font-bold">
                {showMarketplaceContent ? "Marketplace" : "Home"}
              </h1>
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
                      <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-b border-gray-800/50">
            <div className="flex gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex-shrink-0 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Share something with the community..."
                  className="w-full bg-gray-900/60 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/30 border border-gray-800/50 transition-all"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pl-14">
              <div className="flex gap-1">
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-purple-400 px-3 py-1.5 rounded-lg hover:bg-purple-500/5 transition-all text-sm">
                  <ImageIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Photo</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-pink-400 px-3 py-1.5 rounded-lg hover:bg-pink-500/5 transition-all text-sm">
                  <VideoIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Video</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-500/5 transition-all text-sm">
                  <Smile className="w-4 h-4" />
                  <span className="hidden sm:inline">Feeling</span>
                </button>
              </div>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-1.5 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                Post
              </button>
            </div>
          </div>

          {!showMarketplaceContent ? (
            <div className="divide-y divide-gray-800/50">
              {loading ? (
                <Loading />
              ) : plants.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center mb-4">
                    <Leaf className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No plants in your feed
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Follow some plant enthusiasts or share your first plant to
                    get started!
                  </p>
                </div>
              ) : (
                plants.map((plant) => (
                  <PlantPost key={plant.id} plant={plant} />
                ))
              )}
            </div>
          ) : (
            <MarketplaceContent />
          )}

          {!loading && totalPages > 1 && !showMarketplaceContent && (
            <div className="p-4 border-t border-gray-800/50">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                maxVisiblePages={5}
              />
            </div>
          )}
        </main>

        <aside className="hidden xl:block w-80 p-5 space-y-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search plants, people..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900/60 border border-gray-800/50 rounded-xl outline-none text-white placeholder-gray-500 focus:border-purple-500/30 transition-all text-sm"
            />
          </div>

          <div className="bg-gray-900/40 rounded-2xl p-4 border border-gray-800/30">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <h2 className="font-bold text-base">Trending</h2>
            </div>
            <div className="space-y-1">
              <TrendingItem
                category="Popular"
                title="#MonsteraMonday"
                posts="12.5K posts"
              />
              <TrendingItem
                category="Plant Care"
                title="Watering schedules"
                posts="8,432 posts"
              />
              <TrendingItem
                category="Community"
                title="#PlantSwap"
                posts="5,234 posts"
              />
              <TrendingItem
                category="Events"
                title="Rare plants auction"
                posts="3,128 posts"
              />
            </div>
          </div>

          <div className="bg-gray-900/40 rounded-2xl p-4 border border-gray-800/30">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-pink-400" />
              <h2 className="font-bold text-base">Suggested Growers</h2>
            </div>
            <div className="space-y-3">
              {["PlantMom", "GreenThumb", "UrbanJungle"].map((name) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xs font-bold text-purple-400">
                      {name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{name}</p>
                      <p className="text-xs text-gray-500">@{name.toLowerCase()}</p>
                    </div>
                  </div>
                  <button className="text-xs px-3 py-1 rounded-full border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-all">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
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
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-900/60 transition-all text-sm ${
          active ? "font-semibold bg-gray-900/40" : "font-normal text-gray-300"
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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-900/60 transition-all text-sm w-full text-left ${
        active ? "font-semibold bg-gray-900/40" : "font-normal text-gray-300"
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
    <article className="p-4 hover:bg-gray-950/30 transition-colors">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-800">
          {plant.user.avatarUrl ? (
            <img
              src={plant.user.avatarUrl}
              alt={plant.user.username}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {plant.user.firstName?.[0] ||
                  plant.user.username[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-semibold text-white text-sm hover:underline cursor-pointer">
              {plant.user.firstName && plant.user.lastName
                ? `${plant.user.firstName} ${plant.user.lastName}`
                : plant.user.username}
            </span>
            <span className="text-gray-500 text-xs">
              @{plant.user.username}
            </span>
            <span className="text-gray-600 text-xs">·</span>
            <span className="text-gray-500 text-xs">
              {timeAgo(plant.createdAt)}
            </span>
            <div className="ml-auto">
              <button className="p-1.5 hover:bg-gray-800/60 rounded-lg transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-white text-sm leading-relaxed">
              <span className="font-medium">{plant.commonName}</span>
              {plant.description && (
                <span className="text-gray-300"> — {plant.description.substring(0, 120)}...</span>
              )}
            </p>

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
                    href={`/the-vault/results?tag=${tag.name}`}
                    className="text-purple-400 hover:text-purple-300 text-xs"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {mainImage && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-gray-800/50">
              <img
                src={mainImage.url}
                alt={plant.commonName || "Plant image"}
                className="w-full max-h-[28rem] object-cover"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = "/fallback.png"; }}
              />
            </div>
          )}

          <div className="bg-gray-900/30 rounded-xl p-3 mb-3 border border-gray-800/30">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white text-sm">{plant.commonName}</h3>
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-purple-500/5 transition-all group"
              >
                <MessageCircle className="w-[18px] h-[18px] text-gray-500 group-hover:text-purple-400" />
                <span className="text-xs text-gray-500 group-hover:text-purple-400">
                  {commentCount}
                </span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const url = `${window.location.origin}/the-vault/results?tag=${plant.tags?.[0]?.name || plant.slug}`;
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
              className="p-1.5 rounded-lg hover:bg-purple-500/5 transition-all group"
            >
              <Bookmark
                className={`w-[18px] h-[18px] transition-all ${
                  saved
                    ? "text-purple-400 fill-purple-400"
                    : "text-gray-500 group-hover:text-purple-400"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function TrendingItem({
  category,
  title,
  posts,
}: {
  category: string;
  title: string;
  posts: string;
}) {
  return (
    <div className="hover:bg-gray-800/30 p-2.5 rounded-xl cursor-pointer transition-colors">
      <p className="text-gray-500 text-[10px] uppercase tracking-wide">{category}</p>
      <p className="font-semibold text-white text-sm mt-0.5">{title}</p>
      <p className="text-gray-500 text-xs mt-0.5">{posts}</p>
    </div>
  );
}

function MarketplaceContent() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Plant Marketplace
        </h1>
        <p className="text-gray-400">
          Discover beautiful plants from trusted sellers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {marketplacePlants.map((plant) => (
          <div
            key={plant.id}
            className="bg-gray-900/40 rounded-2xl overflow-hidden transition-all duration-200 group hover:shadow-lg hover:shadow-purple-500/10 border border-gray-800/30 hover:border-purple-500/20"
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
              <h3 className="font-medium text-white mb-1.5 line-clamp-1 group-hover:text-purple-300 transition-colors cursor-pointer text-sm">
                {plant.name}
              </h3>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-xs">&#9733;</span>
                  <span className="text-xs text-white">{plant.rating}</span>
                </div>
                <span className="text-[10px] text-gray-500">
                  ({plant.reviews})
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3 hover:text-purple-400 cursor-pointer transition-colors">
                by {plant.shop}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">
                  {plant.price}
                </span>
                <button className="px-3.5 py-1.5 text-white text-xs rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all font-medium">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
