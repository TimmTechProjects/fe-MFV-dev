"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronUp, ChevronDown, MessageSquare, Eye, Pin, Lock, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, voteOnThread } from "@/lib/utils";
import type { ForumThread } from "@/types/forums";

interface ThreadCardProps {
  thread: ForumThread;
  onVoteChange?: (threadId: string, upvotes: number, downvotes: number, userVote: "up" | "down" | null) => void;
}

export default function ThreadCard({ thread, onVoteChange }: ThreadCardProps) {
  const [upvotes, setUpvotes] = useState(thread.upvotes);
  const [downvotes, setDownvotes] = useState(thread.downvotes);
  const [userVote, setUserVote] = useState(thread.userVote || null);
  const [voting, setVoting] = useState(false);

  const handleVote = async (vote: "up" | "down") => {
    if (voting) return;
    setVoting(true);
    const result = await voteOnThread(thread.id, vote);
    if (result) {
      setUpvotes(result.upvotes);
      setDownvotes(result.downvotes);
      setUserVote(result.userVote);
      onVoteChange?.(thread.id, result.upvotes, result.downvotes, result.userVote);
    } else {
      if (userVote === vote) {
        setUserVote(null);
        if (vote === "up") setUpvotes((v) => v - 1);
        else setDownvotes((v) => v - 1);
      } else {
        if (userVote) {
          if (userVote === "up") setUpvotes((v) => v - 1);
          else setDownvotes((v) => v - 1);
        }
        setUserVote(vote);
        if (vote === "up") setUpvotes((v) => v + 1);
        else setDownvotes((v) => v + 1);
      }
    }
    setVoting(false);
  };

  const score = upvotes - downvotes;

  return (
    <div className="flex gap-3 p-4 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${userVote === "up" ? "text-[#81a308]" : "text-zinc-400 dark:text-zinc-500"}`}
          onClick={() => handleVote("up")}
          disabled={voting}
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
        <span className={`text-sm font-semibold tabular-nums ${score > 0 ? "text-[#81a308]" : score < 0 ? "text-red-500" : "text-zinc-500 dark:text-zinc-400"}`}>
          {score}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${userVote === "down" ? "text-red-500" : "text-zinc-400 dark:text-zinc-500"}`}
          onClick={() => handleVote("down")}
          disabled={voting}
        >
          <ChevronDown className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {thread.isPinned && (
            <span className="inline-flex items-center gap-1 text-xs text-[#81a308] font-medium">
              <Pin className="w-3 h-3" /> Pinned
            </span>
          )}
          {thread.isLocked && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-medium">
              <Lock className="w-3 h-3" /> Locked
            </span>
          )}
          <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
            {thread.category}
          </span>
        </div>

        <Link
          href={`/forum/thread/${thread.id}`}
          className="text-base font-semibold text-zinc-900 dark:text-white hover:text-[#81a308] dark:hover:text-[#81a308] transition-colors line-clamp-2"
        >
          {thread.title}
        </Link>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
          {thread.content.replace(/<[^>]+>/g, "").substring(0, 200)}
        </p>

        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {thread.tags.map((tag) => (
              <span key={tag} className="text-xs bg-[#81a308]/10 text-[#81a308] px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mt-2.5 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden shrink-0">
              {thread.author.avatarUrl ? (
                <Image src={thread.author.avatarUrl} alt="" width={20} height={20} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                  {(thread.author.firstName?.[0] || thread.author.username[0]).toUpperCase()}
                </div>
              )}
            </div>
            <Link href={`/profiles/${thread.author.username}`} className="hover:text-[#81a308] transition-colors font-medium">
              {thread.author.username}
            </Link>
          </div>
          <span>{formatRelativeTime(thread.createdAt)}</span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            {thread.replyCount}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {thread.viewCount}
          </span>
        </div>
      </div>
    </div>
  );
}
