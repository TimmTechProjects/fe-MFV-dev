"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, User, Clock, ArrowRight } from "lucide-react";
import { getForumPosts, formatRelativeTime } from "@/lib/utils";

interface ForumPost {
  id: string;
  title: string;
  author: { username: string; avatarUrl?: string };
  createdAt: string;
  replyCount: number;
  category?: string;
}

const MOCK_POSTS: ForumPost[] = [
  {
    id: "mock-1",
    title: "Best indoor plants for low light apartments?",
    author: { username: "plantlover92" },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    replyCount: 12,
    category: "Care Tips",
  },
  {
    id: "mock-2",
    title: "My Monstera is turning yellow - help!",
    author: { username: "greenthumb" },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    replyCount: 8,
    category: "Plant Health",
  },
  {
    id: "mock-3",
    title: "Just got a rare Variegated String of Hearts!",
    author: { username: "rarecollector" },
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    replyCount: 24,
    category: "Show & Tell",
  },
  {
    id: "mock-4",
    title: "What soil mix do you use for succulents?",
    author: { username: "succulent_queen" },
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    replyCount: 15,
    category: "Care Tips",
  },
  {
    id: "mock-5",
    title: "Spring propagation thread - share your cuttings!",
    author: { username: "propagation_pro" },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    replyCount: 31,
    category: "Propagation",
  },
];

export default function CommunityHighlights() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getForumPosts(7)
      .then((data) => {
        setPosts(data.length > 0 ? data : MOCK_POSTS);
      })
      .catch(() => setPosts(MOCK_POSTS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-gray-50 dark:bg-[#121212] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <MessageCircle className="w-6 h-6 text-[#81a308]" />
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Community Discussions
            </h2>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-gray-200 dark:bg-zinc-900 animate-pulse h-[72px]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-50 dark:bg-[#121212] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[#81a308]" />
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Community Discussions
            </h2>
          </div>
          <Link
            href="/the-vault"
            className="bg-[#81a308] hover:bg-[#6c8a0a] text-white font-medium py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full text-[10px] sm:text-xs uppercase tracking-wide transition-all hover:shadow-lg hover:shadow-[#81a308]/25 inline-flex items-center gap-1 sm:gap-1.5"
          >
            Join the Conversation
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href="/the-vault"
              className="block group"
            >
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 hover:border-[#81a308]/30 transition-all duration-200 hover:shadow-md">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#81a308]/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#81a308]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-zinc-900 dark:text-white text-sm sm:text-base truncate group-hover:text-[#81a308] transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>@{post.author.username}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(post.createdAt)}
                    </span>
                    {post.category && (
                      <span className="hidden sm:inline-block bg-[#81a308]/10 text-[#81a308] px-2 py-0.5 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{post.replyCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
