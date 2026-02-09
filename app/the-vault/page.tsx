"use client";

import { useState, useEffect, use } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Search,
  MoreHorizontal,
  Home,
  Mail,
  ShoppingCart,
  ImageIcon,
  VideoIcon,
  MapPinIcon,
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

// Add the import for your API function
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

export default function TwitterPlantFeed({ searchParams }: Props) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [total, setTotal] = useState(0);
  const [activeFilter, setActiveFilter] = useState("For You");
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

  const filters = ["For You", "Reels", "Forum"];

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setShowMarketplaceContent(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto flex">
        {/* Left Sidebar - Navigation (hidden on mobile) */}
        <aside className="hidden lg:block w-64 flex-shrink-0 p-4 border-r border-gray-800 h-screen sticky top-0">
          <div className="space-y-2">
            <nav className="space-y-1">
              <NavItem
                icon={<Home />}
                label="Home"
                active={!showMarketplaceContent && activeFilter === "For You"}
                onClick={() => {
                  setShowMarketplaceContent(false);
                  setActiveFilter("For You");
                }}
              />
              <NavItem icon={<Search />} label="Explore" />
              <NavItem icon={<Mail />} label="Messages" />
              <NavItem
                icon={<ShoppingCart />}
                label="Marketplace"
                href="/marketplace"
              />
            </nav>

            {/* Post Button */}
            <Link
              href="/forum"
              className="w-full bg-[#81a308] text-black font-bold py-3 px-6 rounded-full mt-8 transition-colors block text-center"
            >
              Start now
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 border-r border-gray-800">
          {/* Header */}
          <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 z-10">
            <div className="p-4">
              <h1 className="text-xl font-bold">
                {showMarketplaceContent ? "Marketplace" : "Home"}
              </h1>
            </div>

            {/* Filter Tabs - Only show when not in marketplace */}
            {!showMarketplaceContent && (
              <div className="grid grid-cols-3 gap-4 overflow-x-auto scrollbar-hide">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterClick(filter)}
                    className={`px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                      activeFilter === filter
                        ? "text-white"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    {filter}
                    {activeFilter === filter && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#81a308]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Create Post Box -  */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0"></div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="What's on your mind?"
                  className="w-full bg-gray-800 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex justify-between mt-3 px-2">
              <button className="flex items-center text-gray-400 hover:text-green-400">
                <ImageIcon className="w-5 h-5 mr-1" />
                <span className="text-sm">Photo</span>
              </button>
              <button className="flex items-center text-gray-400 hover:text-green-400">
                <VideoIcon className="w-5 h-5 mr-1" />
                <span className="text-sm">Video</span>
              </button>
              <button className="flex items-center text-gray-400 hover:text-green-400">
                <MapPinIcon className="w-5 h-5 mr-1" />
                <span className="text-sm">Location</span>
              </button>
              <button className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-green-600">
                Post
              </button>
            </div>
          </div>

          {/* Plant Posts Feed */}
          {!showMarketplaceContent ? (
            <div className="divide-y divide-gray-800">
              {loading ? (
                <Loading />
              ) : plants.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-20 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🌱</span>
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

          {/* Pagination */}
          {!loading && totalPages > 1 && !showMarketplaceContent && (
            <div className="p-4 border-t border-gray-800">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                maxVisiblePages={5}
              />
            </div>
          )}
        </main>

        {/* Right Sidebar - Trending & Suggestions (hidden on mobile/tablet) */}
        <aside className="hidden xl:block w-80 p-4 space-y-4">
          {/* Search */}
          <div className="bg-gray-900 rounded-full p-3 flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search plants, people..."
              className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
            />
          </div>

          {/* What's happening */}
          <div className="bg-gray-900 rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-3">What's happening</h2>
            <div className="space-y-3">
              <TrendingItem
                category="Trending in Plants"
                title="#MonsteraMonday"
                posts="12.5K posts"
              />
              <TrendingItem
                category="Plant Care"
                title="Watering schedules"
                posts="8,432 posts"
              />
              <TrendingItem
                category="Trending"
                title="#PlantSwap"
                posts="5,234 posts"
              />
              <TrendingItem
                category="Plant Community"
                title="Rare plants auction"
                posts="3,128 posts"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Navigation Item Component

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
    // Render as Next.js Link
    return (
      <Link
        href={href}
        className={`flex items-center space-x-3 p-3 rounded-full hover:bg-gray-900 transition-colors text-xl w-full text-left ${
          active ? "font-bold" : "font-normal"
        }`}
      >
        <span className="w-6 h-6">{icon}</span>
        <span>{label}</span>
      </Link>
    );
  }

  // Render as button
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 p-3 rounded-full hover:bg-gray-900 transition-colors text-xl w-full text-left ${
        active ? "font-bold" : "font-normal"
      }`}
    >
      <span className="w-6 h-6">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// Plant Post Component
function PlantPost({ plant }: { plant: Plant }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(plant.likes ?? 0);
  const [retweeted, setRetweeted] = useState(false);
  const [retweetCount, setRetweetCount] = useState(
    Math.floor(Math.random() * 50) + 5
  );
  const [commentCount] = useState(Math.floor(Math.random() * 30) + 2);

  // Related plants data (placeholder)
  const relatedPlants = [
    { id: "1", name: "Monstera", image: "/monstera.jpg" },
    { id: "2", name: "Pothos", image: "/pothos.jpg" },
    { id: "3", name: "Philodendron", image: "/philodendron.jpg" },
  ];

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleRetweet = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRetweeted(!retweeted);
    setRetweetCount((prev) => (retweeted ? prev - 1 : prev + 1));
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
    <article className="border-b border-gray-800 p-4 hover:bg-gray-950/30 transition-colors cursor-pointer">
      <div className="flex space-x-3">
        {/* User Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          {plant.user.avatarUrl ? (
            <img
              src={plant.user.avatarUrl}
              alt={plant.user.username}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-[#81a308] flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {plant.user.firstName?.[0] ||
                  plant.user.username[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="flex-1 min-w-0">
          {/* User Info and Time */}
          <div className="flex items-center space-x-1 mb-1">
            <span className="font-bold text-white hover:underline cursor-pointer">
              {plant.user.firstName && plant.user.lastName
                ? `${plant.user.firstName} ${plant.user.lastName}`
                : plant.user.username}
            </span>
            <span className="text-gray-400 text-sm">
              @{plant.user.username}
            </span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-400 text-sm">
              {timeAgo(plant.createdAt)}
            </span>
            <div className="ml-auto">
              <button className="p-1 hover:bg-gray-800 rounded-full">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Post Text */}
          <div className="mb-3">
            <div
              className="text-white leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: `${plant.commonName}!${
                  plant.description
                    ? " " + plant.description.substring(0, 120) + "..."
                    : ""
                }`,
              }}
            />

            {/* Plant Details */}
            {plant.botanicalName && (
              <p className="text-gray-400 text-sm italic mt-2">
                {plant.botanicalName}
              </p>
            )}

            {/* Tags */}
            {plant.tags && plant.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {plant.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/the-vault/results?tag=${tag.name}`}
                    className="text-green-400 hover:text-green-300 hover:underline"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Plant Image */}
          {mainImage && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-gray-700">
              <img
                src={mainImage.url}
                alt={plant.commonName || "Plant image"}
                className="w-full max-h-96 object-cover"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = "/fallback.png"; }}
              />
            </div>
          )}

          {/* Plant Info Card */}
          <div className="bg-gray-900/50 rounded-xl p-3 mb-3 border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-white">{plant.commonName}</h3>
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-400">
                  {plant.type && (
                    <span className="bg-green-900/30 text-green-300 px-2 py-0.5 rounded-full text-xs">
                      {plant.type}
                    </span>
                  )}
                  {plant.origin && <span>📍 {plant.origin}</span>}
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="text-gray-400">
                  {plant.views.toLocaleString()} views
                </div>
              </div>
            </div>
          </div>

          {/* Related Plants Section */}
          <div className="mt-4">
            <h4 className="text-white font-semibold mb-2">Related Plants</h4>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {relatedPlants.map((relatedPlant) => (
                <div
                  key={relatedPlant.id}
                  className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-700"
                >
                  <img
                    src={relatedPlant.image}
                    alt={relatedPlant.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/fallback.png"; }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Interaction Buttons */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-1">
              {/* Like */}
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-red-900/20 transition-colors group"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    liked
                      ? "text-red-500 fill-red-500"
                      : "text-gray-400 group-hover:text-red-400"
                  }`}
                />
                <span
                  className={`text-sm transition-colors ${
                    liked
                      ? "text-red-500"
                      : "text-gray-400 group-hover:text-red-400"
                  }`}
                >
                  {likeCount}
                </span>
              </button>

              {/* Comment */}
              <button
                onClick={(e) => e.stopPropagation()}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-blue-900/20 transition-colors group"
              >
                <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                <span className="text-sm text-gray-400 group-hover:text-blue-400">
                  {commentCount}
                </span>
              </button>

              {/* Repost */}
              <button
                onClick={handleRetweet}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-green-900/20 transition-colors group"
              >
                <Repeat2
                  className={`w-5 h-5 transition-colors ${
                    retweeted
                      ? "text-green-500"
                      : "text-gray-400 group-hover:text-green-400"
                  }`}
                />
                <span
                  className={`text-sm transition-colors ${
                    retweeted
                      ? "text-green-500"
                      : "text-gray-400 group-hover:text-green-400"
                  }`}
                >
                  {retweetCount}
                </span>
              </button>

              {/* Share */}
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
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-900 transition-colors group"
              >
                <Share className="w-5 h-5 text-gray-400 group-hover:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// Trending Item Component
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
    <div className="hover:bg-gray-800/50 p-2 rounded cursor-pointer">
      <p className="text-gray-500 text-sm">{category}</p>
      <p className="font-bold text-white">{title}</p>
      <p className="text-gray-500 text-sm">{posts}</p>
    </div>
  );
}

// Marketplace Content Component
function MarketplaceContent() {
  return (
    <div className="p-6">
      {/* Marketplace Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Plant Marketplace
        </h1>
        <p className="text-white text-lg">
          Discover beautiful plants from trusted sellers
        </p>
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {marketplacePlants.map((plant) => (
          <div
            key={plant.id}
            className="bg-[#1a1a1a] rounded-xl overflow-hidden transition-all duration-200 group hover:shadow-lg hover:shadow-green-500/20"
          >
            {/* Plant Image */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={plant.image || "/fallback.png"}
                alt={plant.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {plant.sale && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                    {plant.sale}
                  </span>
                )}
                {plant.freeShipping && (
                  <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                    Free Ship
                  </span>
                )}
              </div>
            </div>

            {/* Plant Info */}
            <div className="p-4">
              <h3 className="font-semibold text-white mb-2 line-clamp-1 group-hover:text-green-400 transition-colors cursor-pointer">
                {plant.name}
              </h3>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-white">{plant.rating}</span>
                </div>
                <span className="text-xs text-gray-400">
                  ({plant.reviews} reviews)
                </span>
              </div>

              {/* Shop Name */}
              <p className="text-sm text-gray-400 mb-3 hover:text-green-400 cursor-pointer transition-colors">
                by {plant.shop}
              </p>

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">
                  {plant.price}
                </span>
                <button className="px-3 py-1 text-white text-sm rounded-lg bg-[#81a308] hover:bg-green-600 transition-colors border border-green-500">
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
