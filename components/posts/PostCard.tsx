"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface PostCardData {
  id: number | string;
  text?: string;
  image?: string;
  createdAt: string | Date;
  upvotes?: number;
  likes?: number[];
  user: {
    id?: number | string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
  comments?: Array<{
    id: number;
    text: string;
    user: { username: string };
  }>;
  shares?: number;
}

interface PostCardProps {
  post: PostCardData;
  onLike?: (postId: number | string) => void;
  onComment?: (postId: number | string) => void;
  onShare?: (postId: number | string) => void;
}

export default function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.upvotes || post.likes?.length || 0);
  const [saved, setSaved] = useState(false);
  const commentCount = post.comments?.length || 0;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    onLike?.(post.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSaved(!saved);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onComment?.(post.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: post.text || "Check out this post",
        text: post.text?.substring(0, 100),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    onShare?.(post.id);
  };

  const timeAgo = (dateInput: string | Date) => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const displayName =
    post.user.firstName && post.user.lastName
      ? `${post.user.firstName} ${post.user.lastName}`
      : post.user.username;

  return (
    <article className="bg-white dark:bg-gray-900/40 rounded-2xl border border-gray-200 dark:border-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700/50 transition-all mb-4">
      <div className="p-4">
        {/* Header */}
        <div className="flex gap-3 mb-3">
          <Link href={`/profiles/${post.user.username}`} className="flex-shrink-0">
            <Avatar className="w-10 h-10 ring-2 ring-gray-200 dark:ring-gray-800">
              <AvatarImage src={post.user.avatarUrl || "/fallback.png"} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-[#81a308] to-emerald-600 text-white">
                {displayName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/profiles/${post.user.username}`}
                className="font-semibold text-zinc-900 dark:text-white text-sm hover:underline"
              >
                {displayName}
              </Link>
              <span className="text-gray-500 text-xs">@{post.user.username}</span>
              <span className="text-gray-600 text-xs">&middot;</span>
              <span className="text-gray-500 text-xs">{timeAgo(post.createdAt)}</span>
            </div>
          </div>

          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded-lg transition-colors h-fit">
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        {post.text && (
          <div className="mb-3">
            <p className="text-zinc-900 dark:text-white text-sm leading-relaxed">{post.text}</p>
          </div>
        )}

        {/* Image */}
        {post.image && (
          <Link
            href={`/profiles/${post.user.username}/status/${post.id}`}
            className="block mb-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800/50 hover:opacity-95 transition-opacity"
          >
            <div className="relative w-full aspect-video max-h-[28rem]">
              <Image
                src={post.image}
                alt={post.text || "Post image"}
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fallback.png";
                }}
              />
            </div>
          </Link>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800/50">
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
                  liked ? "text-red-500" : "text-gray-500 group-hover:text-red-400"
                }`}
              >
                {likeCount}
              </span>
            </button>

            <button
              onClick={handleComment}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#81a308]/5 transition-all group"
            >
              <MessageCircle className="w-[18px] h-[18px] text-gray-500 group-hover:text-[#81a308]" />
              <span className="text-xs text-gray-500 group-hover:text-[#81a308]">
                {commentCount}
              </span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-500/5 transition-all group"
            >
              <Share2 className="w-[18px] h-[18px] text-gray-500 group-hover:text-blue-400" />
              <span className="text-xs text-gray-500 group-hover:text-blue-400">
                {post.shares || 0}
              </span>
            </button>
          </div>

          <button
            onClick={handleSave}
            className="p-1.5 rounded-lg hover:bg-[#81a308]/5 transition-all group"
          >
            <Bookmark
              className={`w-[18px] h-[18px] transition-all ${
                saved
                  ? "text-[#81a308] fill-[#81a308]"
                  : "text-gray-500 group-hover:text-[#81a308]"
              }`}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
