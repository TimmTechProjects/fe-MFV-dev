"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  ForumThreadList,
  ForumSearchBar,
  CreateThreadModal,
} from "@/components/forums";
import {
  mockForumCategories,
  mockForumThreads,
} from "@/mock/forums";
import { ChevronLeft, Plus, Filter } from "lucide-react";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = use(params);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "replies">(
    "recent"
  );

  // Find the category
  const category = mockForumCategories.find(
    (cat) => cat.slug === resolvedParams.category
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-[#0f1419] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
          <p className="text-gray-400 mb-6">
            The category you're looking for doesn't exist.
          </p>
          <Link
            href="/forums"
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            ← Back to Forums
          </Link>
        </div>
      </div>
    );
  }

  // Filter threads by category
  const categoryThreads = mockForumThreads.filter(
    (thread) => thread.categoryId === category.id
  );

  // Sort threads
  const sortedThreads = [...categoryThreads].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.views - a.views;
      case "replies":
        return b.replyCount - a.replyCount;
      case "recent":
      default:
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching category:", query);
    // TODO: Implement search functionality when backend is ready
  };

  const handleCreateThread = (data: any) => {
    console.log("Creating thread in category:", data);
    // TODO: Implement thread creation when backend is ready
  };

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      {/* Header */}
      <div className="bg-[#1a1d2d] border-b border-[#2c2f38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <Link
            href="/forums"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Forums
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Category Info */}
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: category.color }}
              >
                <span className="text-3xl">{category.icon}</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {category.name}
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                  {category.description}
                </p>
              </div>
            </div>

            {/* New Thread Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              New Thread
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6 text-sm text-gray-400">
            <div>
              <span className="font-semibold text-white">
                {category.threadCount}
              </span>{" "}
              threads
            </div>
            <div>
              <span className="font-semibold text-white">
                {category.postCount}
              </span>{" "}
              posts
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#1a1d2d] border-b border-[#2c2f38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <ForumSearchBar
                onSearch={handleSearch}
                placeholder={`Search in ${category.name}...`}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "recent" | "popular" | "replies")
                }
                className="px-4 py-2 bg-[#0f1419] border border-[#2c2f38] rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
              >
                <option value="recent">Recent Activity</option>
                <option value="popular">Most Popular</option>
                <option value="replies">Most Replies</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Thread List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ForumThreadList
          threads={sortedThreads}
          categorySlug={category.slug}
          showCategory={false}
        />
      </div>

      {/* Create Thread Modal */}
      <CreateThreadModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateThread}
        categories={mockForumCategories}
        defaultCategoryId={category.id}
      />
    </div>
  );
}
