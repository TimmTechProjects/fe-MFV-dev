"use client";

import React, { useState, useEffect } from "react";
import PostCard, { PostCardData } from "@/components/posts/PostCard";
import { Leaf } from "lucide-react";
import Link from "next/link";

type FilterType = "all" | "following" | "popular";
type SortType = "newest" | "popular" | "trending";

interface PostFeedProps {
  posts?: PostCardData[];
  loading?: boolean;
  error?: string | null;
}

export default function PostFeed({ posts = [], loading = false, error = null }: PostFeedProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeSort, setActiveSort] = useState<SortType>("newest");
  const [filteredPosts, setFilteredPosts] = useState<PostCardData[]>(posts);

  useEffect(() => {
    let result = [...posts];

    // Apply filter
    if (activeFilter === "following") {
      // TODO: Filter by followed users
      result = result.filter(() => Math.random() > 0.5); // Placeholder
    } else if (activeFilter === "popular") {
      result = result.filter((post) => (post.upvotes || 0) >= 2);
    }

    // Apply sort
    if (activeSort === "newest") {
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    } else if (activeSort === "popular") {
      result.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else if (activeSort === "trending") {
      result.sort((a, b) => {
        const scoreA = (a.upvotes || 0) + (a.comments?.length || 0) * 2 + (a.shares || 0) * 3;
        const scoreB = (b.upvotes || 0) + (b.comments?.length || 0) * 2 + (b.shares || 0) * 3;
        return scoreB - scoreA;
      });
    }

    setFilteredPosts(result);
  }, [posts, activeFilter, activeSort]);

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All Posts" },
    { value: "following", label: "Following" },
    { value: "popular", label: "Popular" },
  ];

  const sorts: { value: SortType; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Popular" },
    { value: "trending", label: "Trending" },
  ];

  return (
    <div>
      {/* Filter and Sort Bar */}
      <div className="sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800/50 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Filters */}
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeFilter === filter.value
                    ? "bg-[#81a308] text-white shadow-md shadow-[#81a308]/20"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Sort by:</span>
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as SortType)}
              className="text-sm bg-gray-100 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/50 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#81a308]/30 cursor-pointer"
            >
              {sorts.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts Content */}
      <div className="p-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#81a308]/20 border-t-[#81a308] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Loading posts...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-gray-300 mb-2">
              Could not load posts
            </h3>
            <p className="text-gray-500 max-w-md text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && filteredPosts.length === 0 && (
          <div className="flex flex-col justify-center items-center py-20 text-center">
            <div className="w-16 h-16 bg-[#81a308]/10 rounded-full flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8 text-[#81a308]" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-600 dark:text-gray-300 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 max-w-md text-sm mb-4">
              Posts from the community will appear here. Be the first to share something!
            </p>
            <Link
              href="/forums"
              className="bg-[#81a308] hover:bg-[#6c8a0a] text-white font-medium py-2.5 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-[#81a308]/25 text-sm"
            >
              Create Post
            </Link>
          </div>
        )}

        {!loading && !error && filteredPosts.length > 0 && (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
