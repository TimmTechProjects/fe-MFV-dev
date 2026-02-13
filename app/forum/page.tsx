"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Flame, Clock, TrendingUp, MessageSquare, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThreadCard from "@/components/forums/ThreadCard";
import CreateThreadModal from "@/components/forums/CreateThreadModal";
import { getForumThreads, searchForumThreads } from "@/lib/utils";
import type { ForumThread, ThreadSortOption } from "@/types/forums";

const CATEGORIES = [
  { slug: "all", name: "All Topics", icon: MessageSquare },
  { slug: "general", name: "General", icon: MessageSquare },
  { slug: "plant-care", name: "Plant Care", icon: Leaf },
  { slug: "identification", name: "Identification", icon: Search },
  { slug: "pests-diseases", name: "Pests & Diseases", icon: MessageSquare },
  { slug: "propagation", name: "Propagation", icon: Leaf },
  { slug: "show-tell", name: "Show & Tell", icon: MessageSquare },
  { slug: "marketplace-talk", name: "Marketplace", icon: MessageSquare },
  { slug: "tips-tricks", name: "Tips & Tricks", icon: Leaf },
];

const SORT_OPTIONS: { value: ThreadSortOption; label: string; icon: typeof Flame }[] = [
  { value: "hot", label: "Hot", icon: Flame },
  { value: "new", label: "New", icon: Clock },
  { value: "top", label: "Top", icon: TrendingUp },
];

export default function ForumPage() {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<ThreadSortOption>("hot");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const loadThreads = useCallback(async (p = 1, reset = true) => {
    setLoading(true);
    const cat = category === "all" ? undefined : category;
    const data = await getForumThreads(cat, p, 20, sort);
    if (reset) {
      setThreads(data.threads);
    } else {
      setThreads((prev) => [...prev, ...data.threads]);
    }
    setTotalPages(data.totalPages);
    setPage(p);
    setLoading(false);
  }, [category, sort]);

  useEffect(() => {
    if (!searchQuery) {
      loadThreads(1, true);
    }
  }, [loadThreads, searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadThreads(1, true);
      return;
    }
    setSearching(true);
    setLoading(true);
    const data = await searchForumThreads(searchQuery.trim());
    setThreads(data.threads);
    setTotalPages(data.totalPages);
    setPage(1);
    setLoading(false);
    setSearching(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Community Forums</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Discuss plants, share tips, and connect with the community</p>
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-[#81a308] hover:bg-[#6c8a0a] text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            New Thread
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleSearch}
            disabled={searching}
            className="border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            Search
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 space-y-0.5 lg:sticky lg:top-20">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide px-3 py-2">Categories</h3>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => { setCategory(cat.slug); setSearchQuery(""); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    category === cat.slug
                      ? "bg-[#81a308]/10 text-[#81a308] font-medium"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <cat.icon className="w-4 h-4 shrink-0" />
                  {cat.name}
                </button>
              ))}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-4 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSort(opt.value); setSearchQuery(""); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                    sort === opt.value
                      ? "bg-[#81a308]/10 text-[#81a308]"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  <opt.icon className="w-4 h-4" />
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {threads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </div>

            {loading && (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-2 border-[#81a308] border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && threads.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <MessageSquare className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-3" />
                <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400 mb-1">No threads yet</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-500 max-w-xs">
                  {searchQuery ? "No results found. Try a different search." : "Be the first to start a discussion!"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setShowCreate(true)}
                    className="mt-4 bg-[#81a308] hover:bg-[#6c8a0a] text-white"
                  >
                    Start a Thread
                  </Button>
                )}
              </div>
            )}

            {!loading && page < totalPages && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => loadThreads(page + 1, false)}
                  className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                >
                  Load More
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <CreateThreadModal
        open={showCreate}
        onOpenChange={setShowCreate}
        onThreadCreated={() => loadThreads(1, true)}
        defaultCategory={category !== "all" ? category : undefined}
      />
    </div>
  );
}
