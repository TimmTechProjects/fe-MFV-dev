"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  formatRelativeTime,
  togglePostLike,
  togglePostSave,
  deletePost,
  updatePost,
  sharePost,
} from "@/lib/utils";
import useAuth from "@/redux/hooks/useAuth";
import CommentSection from "./CommentSection";
import type { Post, PostPrivacy } from "@/types/posts";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Globe,
  Users,
  Lock,
  Pencil,
  Trash2,
  BookmarkCheck,
  Copy,
} from "lucide-react";

interface PostCardProps {
  post: Post;
  onPostDeleted?: (postId: string) => void;
  onPostUpdated?: (post: Post) => void;
}

export default function PostCard({
  post,
  onPostDeleted,
  onPostUpdated,
}: PostCardProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.liked || false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [saved, setSaved] = useState(post.saved || false);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [shareCountState, setShareCountState] = useState(post.shareCount);

  const isOwner = user?.id === post.author.id || user?.username === post.author.username;

  const canEdit = useMemo(() => {
    if (!isOwner) return false;
    const created = new Date(post.createdAt).getTime();
    const now = Date.now();
    return now - created < 15 * 60 * 1000;
  }, [isOwner, post.createdAt]);

  const handleLike = async () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    const result = await togglePostLike(post.id);
    if (result) {
      setLiked(result.liked);
      setLikeCount(result.likes);
    } else {
      setLiked(liked);
      setLikeCount(likeCount);
    }
  };

  const handleSave = async () => {
    setSaved(!saved);
    const result = await togglePostSave(post.id);
    if (result) {
      setSaved(result.saved);
      toast.success(result.saved ? "Post saved" : "Post unsaved");
    } else {
      setSaved(saved);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/posts/${post.id}`
      );
      toast.success("Link copied to clipboard");
      const result = await sharePost(post.id);
      if (result.success) {
        setShareCountState((prev) => prev + 1);
      }
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleDelete = async () => {
    const result = await deletePost(post.id);
    if (result.success) {
      toast.success("Post deleted");
      onPostDeleted?.(post.id);
    } else {
      toast.error(result.message || "Failed to delete post");
    }
    setShowDeleteDialog(false);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }
    const result = await updatePost(post.id, { content: editContent.trim() });
    if (result.success && result.post) {
      toast.success("Post updated");
      onPostUpdated?.(result.post);
      setIsEditing(false);
    } else {
      toast.error(result.message || "Failed to update post");
    }
  };

  const privacyIcon = {
    public: Globe,
    followers: Users,
    private: Lock,
  }[post.privacy] || Globe;

  const PrivacyIcon = privacyIcon;

  return (
    <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/profiles/${post.author.username}`}>
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                {post.author.avatarUrl ? (
                  <Image
                    src={post.author.avatarUrl}
                    alt={post.author.username}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                    {post.author.username[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </Link>
            <div>
              <Link
                href={`/profiles/${post.author.username}`}
                className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
              >
                {post.author.firstName && post.author.lastName
                  ? `${post.author.firstName} ${post.author.lastName}`
                  : post.author.username}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <span>{formatRelativeTime(post.createdAt)}</span>
                <span>·</span>
                <PrivacyIcon className="w-3 h-3" />
              </div>
            </div>
          </div>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 dark:text-zinc-400">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                {canEdit && (
                  <DropdownMenuItem
                    onClick={() => setIsEditing(true)}
                    className="text-zinc-700 dark:text-zinc-300"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit post
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing ? (
          <div className="mt-3 space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="resize-none bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(post.content);
                }}
                className="text-zinc-600 dark:text-zinc-400"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          post.content && (
            <p className="mt-3 text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
              {post.content}
            </p>
          )
        )}
      </div>

      {post.images.length > 0 && (
        <div
          className={`grid gap-0.5 ${
            post.images.length === 1
              ? "grid-cols-1"
              : post.images.length === 2
              ? "grid-cols-2"
              : post.images.length === 3
              ? "grid-cols-2"
              : "grid-cols-2"
          }`}
        >
          {post.images.map((img, i) => (
            <div
              key={img.id}
              className={`relative ${
                post.images.length === 1
                  ? "aspect-[16/9]"
                  : post.images.length === 3 && i === 0
                  ? "aspect-square row-span-2"
                  : "aspect-square"
              }`}
            >
              <Image
                src={img.url}
                alt={`Post image ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            {likeCount > 0 && `${likeCount} ${likeCount === 1 ? "like" : "likes"}`}
          </span>
          <div className="flex gap-3">
            {post.commentCount > 0 && (
              <span>
                {post.commentCount}{" "}
                {post.commentCount === 1 ? "comment" : "comments"}
              </span>
            )}
            {shareCountState > 0 && (
              <span>
                {shareCountState}{" "}
                {shareCountState === 1 ? "share" : "shares"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-2 py-1 border-t border-zinc-100 dark:border-zinc-800 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex-1 gap-1.5 text-xs font-medium ${
            liked
              ? "text-red-500 hover:text-red-600"
              : "text-zinc-600 dark:text-zinc-400 hover:text-red-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          Like
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex-1 gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-emerald-500"
        >
          <MessageCircle className="w-4 h-4" />
          Comment
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="flex-1 gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-500"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className={`flex-1 gap-1.5 text-xs font-medium ${
            saved
              ? "text-emerald-500 hover:text-emerald-600"
              : "text-zinc-600 dark:text-zinc-400 hover:text-emerald-500"
          }`}
        >
          {saved ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
          Save
        </Button>
      </div>

      {showComments && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          <CommentSection postId={post.id} />
        </div>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-zinc-100">Delete post?</DialogTitle>
            <DialogDescription className="text-zinc-500 dark:text-zinc-400">
              This action cannot be undone. The post will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
