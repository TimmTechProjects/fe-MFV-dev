"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, ChevronDown, MessageSquare, Flag, Loader2, CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getThreadReplies, createThreadReply, voteOnReply, formatRelativeTime } from "@/lib/utils";
import { toast } from "sonner";
import type { ForumReply } from "@/types/forums";

interface ReplySectionProps {
  threadId: string;
  isLocked?: boolean;
}

function ReplyItem({
  reply,
  threadId,
  depth,
  isLocked,
  onReplyAdded,
}: {
  reply: ForumReply;
  threadId: string;
  depth: number;
  isLocked?: boolean;
  onReplyAdded: () => void;
}) {
  const [upvotes, setUpvotes] = useState(reply.upvotes);
  const [downvotes, setDownvotes] = useState(reply.downvotes);
  const [userVote, setUserVote] = useState(reply.userVote || null);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(depth < 2);
  const handleVote = async (vote: "up" | "down") => {
    const result = await voteOnReply(reply.id, vote);
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

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    const result = await createThreadReply(threadId, replyContent.trim(), reply.id);
    if (result.success) {
      setReplyContent("");
      setShowReplyInput(false);
      onReplyAdded();
    } else {
      toast.error(result.message || "Failed to post reply");
    }
    setSubmitting(false);
  };

  const score = upvotes - downvotes;

  return (
    <div className={`${depth > 0 ? "ml-6 pl-4 border-l-2 border-zinc-200 dark:border-zinc-800" : ""}`}>
      <div className="py-3">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden shrink-0">
            {reply.author.avatarUrl ? (
              <Image src={reply.author.avatarUrl} alt="" width={28} height={28} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                {(reply.author.firstName?.[0] || reply.author.username[0]).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Link href={`/profiles/${reply.author.username}`} className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-[#81a308] transition-colors">
                {reply.author.username}
              </Link>
              <span>{formatRelativeTime(reply.createdAt)}</span>
            </div>
            <p className="text-sm text-zinc-800 dark:text-zinc-200 mt-1 whitespace-pre-wrap">
              {reply.content}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 ${userVote === "up" ? "text-[#81a308]" : "text-zinc-400"}`}
                  onClick={() => handleVote("up")}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <span className={`text-xs font-medium tabular-nums ${score > 0 ? "text-[#81a308]" : score < 0 ? "text-red-500" : "text-zinc-500"}`}>
                  {score}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 ${userVote === "down" ? "text-red-500" : "text-zinc-400"}`}
                  onClick={() => handleVote("down")}
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
              {!isLocked && depth < 4 && (
                <button
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="text-xs text-zinc-500 hover:text-[#81a308] flex items-center gap-1 transition-colors"
                >
                  <CornerDownRight className="w-3 h-3" />
                  Reply
                </button>
              )}
            </div>

            {showReplyInput && (
              <div className="mt-2 space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[80px] text-sm bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSubmitReply}
                    disabled={submitting || !replyContent.trim()}
                    className="bg-[#81a308] hover:bg-[#6c8a0a] text-white text-xs"
                  >
                    {submitting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                    Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setShowReplyInput(false); setReplyContent(""); }}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {reply.replies && reply.replies.length > 0 && (
          <>
            {!showReplies ? (
              <button
                onClick={() => setShowReplies(true)}
                className="ml-10 mt-2 text-xs text-[#81a308] hover:underline flex items-center gap-1"
              >
                <MessageSquare className="w-3 h-3" />
                Show {reply.replies.length} {reply.replies.length === 1 ? "reply" : "replies"}
              </button>
            ) : (
              <div className="mt-1">
                {reply.replies.map((r) => (
                  <ReplyItem
                    key={r.id}
                    reply={r}
                    threadId={threadId}
                    depth={depth + 1}
                    isLocked={isLocked}
                    onReplyAdded={onReplyAdded}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ReplySection({ threadId, isLocked }: ReplySectionProps) {
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [newReply, setNewReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const loadReplies= useCallback(async (p = 1) => {
    setLoading(true);
    const data = await getThreadReplies(threadId, p);
    if (p === 1) {
      setReplies(data.replies);
    } else {
      setReplies((prev) => [...prev, ...data.replies]);
    }
    setTotalPages(data.totalPages);
    setPage(p);
    setLoading(false);
  }, [threadId]);

  useEffect(() => {
    loadReplies();
  }, [loadReplies]);

  const handleSubmitReply = async () => {
    if (!newReply.trim()) return;
    setSubmitting(true);
    const result = await createThreadReply(threadId, newReply.trim());
    if (result.success) {
      setNewReply("");
      loadReplies(1);
    } else {
      toast.error(result.message || "Failed to post reply");
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {!isLocked && (
        <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
          <Textarea
            placeholder="Write a reply..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            className="min-h-[100px] bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white resize-none"
          />
          <div className="flex justify-end mt-3">
            <Button
              onClick={handleSubmitReply}
              disabled={submitting || !newReply.trim()}
              className="bg-[#81a308] hover:bg-[#6c8a0a] text-white"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Post Reply
            </Button>
          </div>
        </div>
      )}

      {isLocked && (
        <div className="text-center py-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <p className="text-sm text-amber-600 dark:text-amber-400">This thread is locked. New replies are not allowed.</p>
        </div>
      )}

      <div className="space-y-1">
        {replies.map((reply) => (
          <ReplyItem
            key={reply.id}
            reply={reply}
            threadId={threadId}
            depth={0}
            isLocked={isLocked}
            onReplyAdded={() => loadReplies(1)}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-[#81a308]" />
        </div>
      )}

      {!loading && replies.length === 0 && (
        <div className="text-center py-8">
          <MessageSquare className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto mb-2" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No replies yet. Be the first to respond!</p>
        </div>
      )}

      {!loading && page < totalPages && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => loadReplies(page + 1)}
            className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
          >
            Load more replies
          </Button>
        </div>
      )}
    </div>
  );
}
