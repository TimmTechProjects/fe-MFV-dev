"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, TrendingUp, Users, MessageCircle, ShoppingBag, Leaf } from "lucide-react";

interface TrendingItemProps {
  category: string;
  title: string;
  posts: string;
  icon?: React.ReactNode;
}

function TrendingItem({ category, title, posts, icon }: TrendingItemProps) {
  return (
    <button className="w-full hover:bg-gray-100 dark:hover:bg-gray-800/30 p-3 rounded-xl cursor-pointer transition-colors text-left">
      <div className="flex items-start gap-2">
        {icon && <span className="flex-shrink-0 mt-0.5">{icon}</span>}
        <div className="flex-1 min-w-0">
          <p className="text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wide font-medium">
            {category}
          </p>
          <p className="font-semibold text-zinc-900 dark:text-white text-sm mt-0.5 truncate">
            {title}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">{posts}</p>
        </div>
      </div>
    </button>
  );
}

interface SuggestedUserProps {
  name: string;
  username: string;
  avatarUrl?: string;
}

function SuggestedUser({ name, username, avatarUrl }: SuggestedUserProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#81a308]/20 to-emerald-500/10 flex items-center justify-center text-sm font-bold text-[#81a308] border border-[#81a308]/20">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            name[0].toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{name}</p>
          <p className="text-xs text-gray-500 truncate">@{username}</p>
        </div>
      </div>
      <button className="text-xs px-4 py-1.5 rounded-full border border-[#81a308]/30 text-[#81a308] hover:bg-[#81a308]/10 transition-all font-medium flex-shrink-0">
        Follow
      </button>
    </div>
  );
}

interface RightSidebarProps {
  onSearch?: (query: string) => void;
}

export default function RightSidebar({ onSearch }: RightSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <aside className="hidden xl:block w-80 flex-shrink-0 h-screen sticky top-0 bg-white dark:bg-black overflow-y-auto">
      <div className="p-5 space-y-5">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search plants, people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/50 rounded-lg outline-none text-zinc-900 dark:text-white placeholder-gray-500 focus:border-[#81a308]/40 transition-all text-sm"
          />
        </form>

        {/* Trending Plants */}
        <div className="bg-gray-100 dark:bg-gray-900/40 rounded-2xl p-4 border border-gray-200 dark:border-gray-800/30">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#81a308]" />
            <h2 className="font-bold text-base text-zinc-900 dark:text-white">Trending Plants</h2>
          </div>
          <div className="space-y-1">
            <TrendingItem
              category="Popular"
              title="Monstera Deliciosa"
              posts="12.5K posts"
              icon={<Leaf className="w-4 h-4 text-emerald-500" />}
            />
            <TrendingItem
              category="Plant Care"
              title="Fiddle Leaf Fig Tips"
              posts="8.4K posts"
              icon={<Leaf className="w-4 h-4 text-green-500" />}
            />
            <TrendingItem
              category="Community"
              title="#PropagationStation"
              posts="5.2K posts"
              icon={<Leaf className="w-4 h-4 text-[#81a308]" />}
            />
            <TrendingItem
              category="Rare"
              title="Variegated Beauties"
              posts="3.1K posts"
              icon={<Leaf className="w-4 h-4 text-purple-500" />}
            />
          </div>
        </div>

        {/* Suggested Forum Threads */}
        <div className="bg-gray-100 dark:bg-gray-900/40 rounded-2xl p-4 border border-gray-200 dark:border-gray-800/30">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-4 h-4 text-blue-500" />
            <h2 className="font-bold text-base text-zinc-900 dark:text-white">Popular Threads</h2>
          </div>
          <div className="space-y-3">
            <Link
              href="/forums"
              className="block p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/30 transition-colors"
            >
              <p className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-2">
                Help! My snake plant is turning yellow
              </p>
              <p className="text-xs text-gray-500 mt-1">34 replies &middot; Plant Care</p>
            </Link>
            <Link
              href="/forums"
              className="block p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/30 transition-colors"
            >
              <p className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-2">
                Best grow lights for indoor plants?
              </p>
              <p className="text-xs text-gray-500 mt-1">28 replies &middot; Equipment</p>
            </Link>
            <Link
              href="/forums"
              className="block p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/30 transition-colors"
            >
              <p className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-2">
                Show off your rare plant collection!
              </p>
              <p className="text-xs text-gray-500 mt-1">156 replies &middot; Community</p>
            </Link>
          </div>
        </div>

        {/* Suggested Sellers */}
        <div className="bg-gray-100 dark:bg-gray-900/40 rounded-2xl p-4 border border-gray-200 dark:border-gray-800/30">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-base text-zinc-900 dark:text-white">Top Sellers</h2>
          </div>
          <div className="space-y-3">
            <Link
              href="/marketplace"
              className="block p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">GN</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">Green Nursery</p>
                  <p className="text-xs text-gray-500">4.9★ · 2.3K sales</p>
                </div>
              </div>
            </Link>
            <Link
              href="/marketplace"
              className="block p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">PP</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">Plant Paradise</p>
                  <p className="text-xs text-gray-500">4.8★ · 1.8K sales</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Suggested Growers */}
        <div className="bg-gray-100 dark:bg-gray-900/40 rounded-2xl p-4 border border-gray-200 dark:border-gray-800/30">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-emerald-400" />
            <h2 className="font-bold text-base text-zinc-900 dark:text-white">Suggested Growers</h2>
          </div>
          <div className="space-y-2">
            <SuggestedUser name="PlantMom" username="plantmom" />
            <SuggestedUser name="GreenThumb" username="greenthumb" />
            <SuggestedUser name="UrbanJungle" username="urbanjungle" />
          </div>
        </div>
      </div>
    </aside>
  );
}
