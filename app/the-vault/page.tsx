"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LeftSidebar from "@/components/vault/LeftSidebar";
import RightSidebar from "@/components/vault/RightSidebar";
import FeedHeader from "@/components/vault/FeedHeader";
import PostFeed from "@/components/vault/PostFeed";
import { DUMMY_POSTS } from "@/mock/posts";
import { PostCardData } from "@/components/posts/PostCard";
import { Home, Search, PlusSquare, Bell, User, Play } from "lucide-react";
import Link from "next/link";

type MobileTab = "home" | "search" | "create" | "notifications" | "profile";

export default function VaultPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"home" | "reels" | "forums" | "marketplace">("home");
  const [mobileTab, setMobileTab] = useState<MobileTab>("home");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate fetching posts
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setPosts(DUMMY_POSTS);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = () => {
    router.push("/forums");
  };

  const handleNavigate = (section: string) => {
    if (section === "reels") {
      // Placeholder for reels functionality
      alert("Reels/Shorts coming soon!");
    } else {
      setActiveSection(section as typeof activeSection);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
    console.log("Searching for:", query);
  };

  const filteredPosts = searchQuery
    ? posts.filter(
        (post) =>
          post.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-zinc-900 dark:text-white">
      {/* Desktop 3-Column Layout */}
      <div className="hidden lg:flex max-w-[1920px] mx-auto">
        {/* Left Sidebar */}
        <LeftSidebar activeSection={activeSection} onNavigate={handleNavigate} />

        {/* Center Feed */}
        <main className="flex-1 min-w-0 max-w-[680px] mx-auto border-x border-gray-200 dark:border-gray-800/50 bg-white dark:bg-black">
          <FeedHeader onCreatePost={handleCreatePost} />
          
          {activeSection === "home" && (
            <PostFeed posts={filteredPosts} loading={loading} error={error} />
          )}

          {activeSection === "reels" && (
            <div className="flex flex-col justify-center items-center py-20 text-center p-4">
              <div className="w-16 h-16 bg-[#81a308]/10 rounded-full flex items-center justify-center mb-4">
                <Play className="w-8 h-8 text-[#81a308]" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-600 dark:text-gray-300 mb-2">
                Reels/Shorts Coming Soon
              </h3>
              <p className="text-gray-500 max-w-md text-sm">
                Short-form video content will be available here soon. Stay tuned!
              </p>
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <RightSidebar onSearch={handleSearch} />
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800/50 z-20 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">The Vault</h1>
            <button
              onClick={() => setMobileTab("notifications")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Mobile Content */}
        <div className="pb-20">
          {mobileTab === "home" && (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-800/50 bg-white dark:bg-black">
                <button
                  onClick={handleCreatePost}
                  className="w-full bg-gray-100 dark:bg-gray-900/60 rounded-xl px-4 py-3 text-left text-gray-500 text-sm border border-gray-200 dark:border-gray-800/50"
                >
                  Share something with the community...
                </button>
              </div>
              <PostFeed posts={filteredPosts} loading={loading} error={error} />
            </>
          )}

          {mobileTab === "search" && (
            <div className="p-4">
              <div className="relative mb-6">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search plants, people..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/50 rounded-xl outline-none text-zinc-900 dark:text-white placeholder-gray-500 focus:border-[#81a308]/40 transition-all"
                  autoFocus
                />
              </div>

              {searchQuery ? (
                <PostFeed posts={filteredPosts} loading={false} error={null} />
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Trending Searches
                    </h3>
                    <div className="space-y-2">
                      {["Monstera", "Succulents", "Rare Plants", "Beginner Friendly"].map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900/60 hover:bg-gray-200 dark:hover:bg-gray-800/60 transition-colors"
                        >
                          <Search className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-zinc-900 dark:text-white">{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {mobileTab === "notifications" && (
            <div className="p-4">
              <h2 className="text-lg font-bold mb-4">Notifications</h2>
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900/50 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No new notifications</p>
              </div>
            </div>
          )}

          {mobileTab === "profile" && (
            <div className="p-4">
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#81a308] to-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Your Profile</h3>
                <Link
                  href="/settings"
                  className="mt-4 text-sm text-[#81a308] hover:underline"
                >
                  Go to Settings
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800/50 z-50">
          <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
            <button
              onClick={() => setMobileTab("home")}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                mobileTab === "home" ? "text-[#81a308]" : "text-gray-500"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-medium">Home</span>
            </button>
            <button
              onClick={() => setMobileTab("search")}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                mobileTab === "search" ? "text-[#81a308]" : "text-gray-500"
              }`}
            >
              <Search className="w-6 h-6" />
              <span className="text-[10px] font-medium">Search</span>
            </button>
            <button
              onClick={handleCreatePost}
              className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg text-gray-500 hover:text-[#81a308] transition-colors"
            >
              <PlusSquare className="w-6 h-6" />
              <span className="text-[10px] font-medium">Create</span>
            </button>
            <button
              onClick={() => setMobileTab("notifications")}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors relative ${
                mobileTab === "notifications" ? "text-[#81a308]" : "text-gray-500"
              }`}
            >
              <Bell className="w-6 h-6" />
              <span className="text-[10px] font-medium">Alerts</span>
              <span className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => setMobileTab("profile")}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                mobileTab === "profile" ? "text-[#81a308]" : "text-gray-500"
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-[10px] font-medium">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
