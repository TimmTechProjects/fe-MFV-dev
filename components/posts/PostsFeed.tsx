"use client";

import { useState, useEffect, useCallback } from "react";
import { getPosts, getUserPosts } from "@/lib/utils";
import useAuth from "@/redux/hooks/useAuth";
import PostCard from "./PostCard";
import CreatePostModal from "./CreatePostModal";
import type { Post } from "@/types/posts";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2, PenSquare, Leaf, ImageIcon, Video } from "lucide-react";

interface PostsFeedProps {
  username?: string;
  showCreateButton?: boolean;
  hideCreatePost?: boolean;
}

export default function PostsFeed({
  username,
  showCreateButton = true,
  hideCreatePost = false,
}: PostsFeedProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sort, setSort] = useState<"recent" | "popular">("recent");

  const loadPosts = useCallback(
    async (pageNum: number, reset = false) => {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const data = username
        ? await getUserPosts(username, pageNum)
        : await getPosts(pageNum, 20, sort);

      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
      setLoading(false);
      setLoadingMore(false);
    },
    [username, sort]
  );

  useEffect(() => {
    loadPosts(1, true);
  }, [loadPosts]);

  const handlePostCreated = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  return (
    <div className="space-y-4">
      {showCreateButton && user && (
        <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hidden lg:block transition-all duration-300 overflow-hidden ${hideCreatePost ? "lg:max-h-0 lg:p-0 lg:border-0 lg:opacity-0" : "lg:max-h-60 lg:opacity-100"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.username || ""}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  {user.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex-1 text-left px-4 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
            >
              What&apos;s growing in your garden?
            </button>
            <Button
              onClick={() => setShowCreateModal(true)}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            >
              <PenSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Post</span>
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              Photo
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <Video className="w-4 h-4 text-blue-500" />
              Video
            </button>
          </div>
        </div>
      )}


      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <Leaf className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            No posts yet
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            {username
              ? "This user hasn't shared any posts yet."
              : "Be the first to share something with the community!"}
          </p>
          {showCreateButton && user && !username && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <PenSquare className="w-4 h-4 mr-2" />
              Create your first post
            </Button>
          )}
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostDeleted={handlePostDeleted}
              onPostUpdated={handlePostUpdated}
            />
          ))}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                onClick={() => loadPosts(page + 1)}
                disabled={loadingMore}
                className="text-zinc-600 dark:text-zinc-400"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load more"
                )}
              </Button>
            </div>
          )}
        </>
      )}

      <CreatePostModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
