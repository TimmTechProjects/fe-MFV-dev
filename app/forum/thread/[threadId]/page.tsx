"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronUp, ChevronDown, Pin, Lock, Eye, MessageSquare, Flag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReplySection from "@/components/forums/ReplySection";
import { getForumThread, voteOnThread, reportForumContent, formatRelativeTime } from "@/lib/utils";
import { toast } from "sonner";
import type { ForumThread } from "@/types/forums";

export default function ThreadDetailPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = use(params);
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getForumThread(threadId);
      if (data) {
        setThread(data);
        setUpvotes(data.upvotes);
        setDownvotes(data.downvotes);
        setUserVote(data.userVote || null);
      }
      setLoading(false);
    };
    load();
  }, [threadId]);

  const handleVote = async (vote: "up" | "down") => {
    const result = await voteOnThread(threadId, vote);
    if (result) {
      setUpvotes(result.upvotes);
      setDownvotes(result.downvotes);
      setUserVote(result.userVote);
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
  };

  const handleReport = async () => {
    const reason = prompt("Please describe why you are reporting this thread:");
    if (!reason) return;
    const result = await reportForumContent("thread", threadId, reason);
    if (result.success) {
      toast.success("Report submitted. Thank you.");
    } else {
      toast.error(result.message || "Failed to submit report");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#81a308] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center">
        <MessageSquare className="w-12 h-12 text-zinc-400 mb-3" />
        <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">Thread not found</h2>
        <Link href="/forum" className="mt-4 text-[#81a308] hover:underline text-sm">
          Back to Forums
        </Link>
      </div>
    );
  }

  const score = upvotes - downvotes;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link href="/forum" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-[#81a308] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Forums
        </Link>

        <article className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {thread.isPinned && (
              <span className="inline-flex items-center gap-1 text-xs text-[#81a308] font-medium bg-[#81a308]/10 px-2 py-0.5 rounded-full">
                <Pin className="w-3 h-3" /> Pinned
              </span>
            )}
            {thread.isLocked && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
            <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
              {thread.category}
            </span>
          </div>

          <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{thread.title}</h1>

          <div className="flex items-center gap-3 mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                {thread.author?.avatarUrl ? (
                  <Image src={thread.author.avatarUrl} alt="" width={28} height={28} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                    {(thread.author?.firstName?.[0] || thread.author?.username?.[0] || "?").toUpperCase()}
                  </div>
                )}
              </div>
              {thread.author?.username ? (
                <Link href={`/profiles/${thread.author.username}`} className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-[#81a308] transition-colors">
                  {thread.author.username}
                </Link>
              ) : (
                <span className="font-medium text-zinc-500 dark:text-zinc-500">Unknown User</span>
              )}
            </div>
            <span>{formatRelativeTime(thread.createdAt)}</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {thread.viewCount} views
            </span>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap mb-4">
            {thread.content}
          </div>

          {thread.tags && thread.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {thread.tags.map((tag) => (
                <span key={tag} className="text-xs bg-[#81a308]/10 text-[#81a308] px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${userVote === "up" ? "text-[#81a308]" : "text-zinc-400"}`}
                onClick={() => handleVote("up")}
              >
                <ChevronUp className="w-5 h-5" />
              </Button>
              <span className={`text-sm font-semibold tabular-nums ${score > 0 ? "text-[#81a308]" : score < 0 ? "text-red-500" : "text-zinc-500"}`}>
                {score}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${userVote === "down" ? "text-red-500" : "text-zinc-400"}`}
                onClick={() => handleVote("down")}
              >
                <ChevronDown className="w-5 h-5" />
              </Button>
            </div>
            <span className="text-sm text-zinc-500 flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {thread.replyCount} replies
            </span>
            <button onClick={handleShare} className="text-sm text-zinc-500 hover:text-[#81a308] flex items-center gap-1 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button onClick={handleReport} className="text-sm text-zinc-500 hover:text-red-500 flex items-center gap-1 transition-colors ml-auto">
              <Flag className="w-4 h-4" />
              Report
            </button>
          </div>
        </article>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Replies ({thread.replyCount})
          </h2>
          <ReplySection threadId={threadId} isLocked={thread.isLocked} />
        </div>
      </div>
    </div>
  );
}
