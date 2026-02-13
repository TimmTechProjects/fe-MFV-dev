"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getPostComments,
  createComment,
  deleteComment,
  formatRelativeTime,
} from "@/lib/utils";
import useAuth from "@/redux/hooks/useAuth";
import type { PostComment } from "@/types/posts";
import {
  Send,
  Loader2,
  CornerDownRight,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const loadComments = useCallback(async () => {
    setLoading(true);
    const data = await getPostComments(postId);
    setComments(data.comments);
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }
    setSubmitting(true);
    const result = await createComment(postId, newComment.trim());
    if (result.success && result.comment) {
      setComments((prev) => [result.comment!, ...prev]);
      setNewComment("");
      toast.success("Comment added");
    } else {
      toast.error(result.message || "Failed to add comment");
    }
    setSubmitting(false);
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    if (!user) {
      toast.error("Please log in to reply");
      return;
    }
    setSubmitting(true);
    const result = await createComment(postId, replyContent.trim(), parentId);
    if (result.success && result.comment) {
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), result.comment!],
            };
          }
          return c;
        })
      );
      setReplyContent("");
      setReplyingTo(null);
      setExpandedReplies((prev) => new Set([...prev, parentId]));
      toast.success("Reply added");
    } else {
      toast.error(result.message || "Failed to add reply");
    }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string, parentId?: string | null) => {
    const result = await deleteComment(postId, commentId);
    if (result.success) {
      if (parentId) {
        setComments((prev) =>
          prev.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: (c.replies || []).filter((r) => r.id !== commentId),
              };
            }
            return c;
          })
        );
      } else {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
      toast.success("Comment deleted");
    } else {
      toast.error(result.message || "Failed to delete comment");
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const renderComment = (comment: PostComment, isReply = false) => {
    const isOwner = user?.id === comment.author.id || user?.username === comment.author.username;
    const replyCount = comment.replies?.length || 0;
    const hasReplies = replyCount > 0;
    const repliesExpanded = expandedReplies.has(comment.id);

    return (
      <div key={comment.id} className={`${isReply ? "ml-8" : ""}`}>
        <div className="flex gap-2.5 py-2">
          <Link href={`/profiles/${comment.author.username}`} className="shrink-0">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
              {comment.author.avatarUrl ? (
                <Image
                  src={comment.author.avatarUrl}
                  alt={comment.author.username}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  {comment.author.username[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl px-3 py-2">
              <Link
                href={`/profiles/${comment.author.username}`}
                className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
              >
                {comment.author.firstName && comment.author.lastName
                  ? `${comment.author.firstName} ${comment.author.lastName}`
                  : comment.author.username}
              </Link>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-0.5 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-1 px-1">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {formatRelativeTime(comment.createdAt)}
              </span>
              {!isReply && (
                <button
                  onClick={() => {
                    setReplyingTo(replyingTo === comment.id ? null : comment.id);
                    setReplyContent("");
                  }}
                  className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition"
                >
                  Reply
                </button>
              )}
              {isOwner && (
                <button
                  onClick={() => handleDeleteComment(comment.id, comment.parentId)}
                  className="text-[11px] text-zinc-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {hasReplies && !isReply && (
          <button
            onClick={() => toggleReplies(comment.id)}
            className="flex items-center gap-1 ml-10 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition mb-1"
          >
            {repliesExpanded ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Hide {replyCount}{" "}
                {replyCount === 1 ? "reply" : "replies"}
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                View {replyCount}{" "}
                {replyCount === 1 ? "reply" : "replies"}
              </>
            )}
          </button>
        )}

        {repliesExpanded &&
          comment.replies?.map((reply) => renderComment(reply, true))}

        {replyingTo === comment.id && (
          <div className="flex gap-2 ml-10 mt-1 mb-2">
            <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0 mt-1">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.username || ""}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="flex-1 flex gap-1.5">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${comment.author.username}...`}
                rows={1}
                className="resize-none text-sm bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 min-h-[36px] py-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitReply(comment.id);
                  }
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleSubmitReply(comment.id)}
                disabled={submitting || !replyContent.trim()}
                className="h-9 w-9 shrink-0 text-emerald-600 hover:text-emerald-500"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CornerDownRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="px-4 py-3">
      <div className="flex gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user?.username || ""}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>
        <div className="flex-1 flex gap-1.5">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={1}
            className="resize-none text-sm bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 min-h-[36px] py-2"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSubmitComment}
            disabled={submitting || !newComment.trim()}
            className="h-9 w-9 shrink-0 text-emerald-600 hover:text-emerald-500"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 py-2">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-0.5">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
}
