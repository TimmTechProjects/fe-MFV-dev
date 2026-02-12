"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ForumThread } from "@/types/forums";
import {
  MessageSquare,
  Eye,
  Pin,
  Lock,
  Clock,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ForumThreadListProps {
  threads: ForumThread[];
  categorySlug: string;
  showCategory?: boolean;
}

export const ForumThreadList: React.FC<ForumThreadListProps> = ({
  threads,
  categorySlug,
  showCategory = false,
}) => {
  // Separate sticky and regular threads
  const stickyThreads = threads.filter((t) => t.isSticky);
  const regularThreads = threads.filter((t) => !t.isSticky);

  const ThreadRow = ({ thread }: { thread: ForumThread }) => {
    const href = `/forums/${categorySlug}/${thread.slug}`;

    return (
      <Link
        href={href}
        className={cn(
          "block bg-[#1a1d2d] hover:bg-[#22254a] transition-colors border border-[#2c2f38]",
          thread.isSticky && "bg-[#1f2437] border-blue-900/30"
        )}
      >
        <div className="p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            {/* Author Avatar */}
            <Avatar className="w-10 h-10 flex-shrink-0 hidden md:block">
              <AvatarImage
                src={thread.author.avatarUrl}
                alt={thread.author.username}
              />
              <AvatarFallback>
                {thread.author.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Thread Info */}
            <div className="flex-1 min-w-0">
              {/* Title and Badges */}
              <div className="flex items-start gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {thread.isSticky && (
                      <Pin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    )}
                    {thread.isPinned && (
                      <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />
                    )}
                    <h3 className="text-base md:text-lg font-semibold text-white hover:text-green-400 transition-colors">
                      {thread.title}
                    </h3>
                    {thread.isLocked && (
                      <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Avatar className="w-4 h-4 md:hidden">
                        <AvatarImage
                          src={thread.author.avatarUrl}
                          alt={thread.author.username}
                        />
                        <AvatarFallback className="text-[8px]">
                          {thread.author.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-300">
                        {thread.author.username}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(thread.createdAt).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year:
                            new Date().getFullYear() !==
                            new Date(thread.createdAt).getFullYear()
                              ? "numeric"
                              : undefined,
                        }
                      )}
                    </div>
                    {showCategory && (
                      <>
                        <span>•</span>
                        <span className="text-green-400">
                          {thread.categoryName}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Tags */}
                  {thread.tags && thread.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {thread.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-[#2c2f38] text-gray-400 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex md:flex-col gap-4 md:gap-2 items-center md:items-end text-sm">
              <div className="flex items-center gap-1.5 text-gray-400">
                <MessageSquare className="w-4 h-4" />
                <span className="font-medium">{thread.replyCount}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <Eye className="w-4 h-4" />
                <span className="font-medium">{thread.views}</span>
              </div>
            </div>

            {/* Last Reply */}
            {thread.lastReply && (
              <div className="md:w-32 flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-[#2c2f38] md:pl-4">
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarImage
                    src={thread.lastReply.author.avatarUrl}
                    alt={thread.lastReply.author.username}
                  />
                  <AvatarFallback className="text-[8px]">
                    {thread.lastReply.author.username
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 truncate">
                    {thread.lastReply.author.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(thread.lastReply.createdAt).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-2">
      {/* Sticky Threads */}
      {stickyThreads.length > 0 && (
        <div className="space-y-2">
          {stickyThreads.map((thread) => (
            <ThreadRow key={thread.id} thread={thread} />
          ))}
        </div>
      )}

      {/* Regular Threads */}
      {regularThreads.length > 0 && (
        <div className="space-y-2">
          {regularThreads.map((thread) => (
            <ThreadRow key={thread.id} thread={thread} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {threads.length === 0 && (
        <div className="bg-[#1a1d2d] border border-[#2c2f38] rounded-lg p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">
            No threads yet
          </h3>
          <p className="text-sm text-gray-500">
            Be the first to start a conversation!
          </p>
        </div>
      )}
    </div>
  );
};
