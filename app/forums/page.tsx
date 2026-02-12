"use client";

import React, { useState } from "react";
import {
  ForumCategoryList,
  ForumSearchBar,
  RecentActivityFeed,
  PopularThreadsSidebar,
  CreateThreadModal,
} from "@/components/forums";
import {
  mockForumCategories,
  mockForumActivities,
  mockPopularThreads,
} from "@/mock/forums";
import { Plus } from "lucide-react";

export default function ForumsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
    // TODO: Implement search functionality when backend is ready
  };

  const handleCreateThread = (data: any) => {
    console.log("Creating thread:", data);
    // TODO: Implement thread creation when backend is ready
  };

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      {/* Header */}
      <div className="bg-[#1a1d2d] border-b border-[#2c2f38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Community Forums
              </h1>
              <p className="text-gray-400">
                Connect with fellow plant enthusiasts, share knowledge, and grow
                together
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              New Thread
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <ForumSearchBar
              onSearch={handleSearch}
              placeholder="Search threads, posts, and users..."
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column - Categories & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Forum Categories */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Categories</h2>
              <ForumCategoryList categories={mockForumCategories} />
            </section>

            {/* Recent Activity (Mobile) */}
            <section className="lg:hidden">
              <RecentActivityFeed activities={mockForumActivities} limit={5} />
            </section>
          </div>

          {/* Sidebar - Popular & Activity */}
          <div className="space-y-6">
            {/* Popular Threads */}
            <PopularThreadsSidebar threads={mockPopularThreads} limit={5} />

            {/* Recent Activity (Desktop) */}
            <div className="hidden lg:block">
              <RecentActivityFeed activities={mockForumActivities} limit={10} />
            </div>
          </div>
        </div>
      </div>

      {/* Forum Stats */}
      <div className="bg-[#1a1d2d] border-t border-[#2c2f38] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {mockForumCategories.reduce(
                  (sum, cat) => sum + cat.threadCount,
                  0
                )}
              </div>
              <div className="text-sm text-gray-400">Total Threads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {mockForumCategories.reduce(
                  (sum, cat) => sum + cat.postCount,
                  0
                )}
              </div>
              <div className="text-sm text-gray-400">Total Posts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {mockForumCategories.length}
              </div>
              <div className="text-sm text-gray-400">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                1.2k
              </div>
              <div className="text-sm text-gray-400">Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Thread Modal */}
      <CreateThreadModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateThread}
        categories={mockForumCategories}
      />
    </div>
  );
}
