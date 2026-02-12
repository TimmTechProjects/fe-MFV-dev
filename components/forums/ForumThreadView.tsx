"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ForumThread, ForumReply } from "@/types/forums";
import {
  Heart,
  MessageSquare,
  Share2,
  MoreVertical,
  Quote,
  Flag,
  Edit,
  Trash,
  Bell,
  BellOff,
} from "lucide-react";
import { ForumReplyComposer } from "./ForumReplyComposer";
import { cn } from "@/lib/utils";

interface ForumThreadViewProps {
  thread: ForumThread;
  replies: ForumReply[];
  currentUserId?: string;
  isSubscribed?: boolean;
  onLikeReply?: (replyId: string) => void;
  onSubmitReply?: (content: string, quotedReplyId?: string) => void;
  onEditReply?: (replyId: string, content: string) => void;
  onDeleteReply?: (replyId: string) => void;
  onToggleSubscription?: () => void;
  onQuoteReply?: (replyId: string) => void;
}

export const ForumThreadView: React.FC<ForumThreadViewProps> = ({
  thread,
  replies,
  currentUserId,
  isSubscribed = false,
  onLikeReply,
  onSubmitReply,
  onEditReply,
  onDeleteReply,
  onToggleSubscription,
  onQuoteReply,
}) => {
  const [quotedReply, setQuotedReply] = useState<ForumReply | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);

  const handleQuote = (reply: ForumReply) => {
    setQuotedReply(reply);
    // Scroll to composer
    document.getElementById("reply-composer")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleSubmitReply = (content: string) => {
    onSubmitReply?.(content, quotedReply?.id);
    setQuotedReply(null);
  };

  const isAuthor = (userId: string) => currentUserId === userId;

  return (
    <div className="space-y-4">
      {/* Original Post */}
      <div className="bg-[#1a1d2d] border border-[#2c2f38] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f1419] border-b border-[#2c2f38] p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={thread.author.avatarUrl}
                  alt={thread.author.username}
                />
                <AvatarFallback>
                  {thread.author.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-white text-lg">
                  {thread.author.username}
                </h3>
                <p className="text-xs text-gray-400">
                  {thread.author.role && (
                    <span className="text-green-400 font-medium mr-2">
                      {thread.author.role}
                    </span>
                  )}
                  {thread.author.postCount && (
                    <span>{thread.author.postCount} posts</span>
                  )}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {new Date(thread.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-4">{thread.title}</h1>

          {/* Rich Text Content */}
          <div
            className="prose prose-invert prose-sm max-w-none mb-4"
            dangerouslySetInnerHTML={{ __html: thread.content }}
          />

          {/* Images */}
          {thread.images && thread.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {thread.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Thread image ${idx + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Tags */}
          {thread.tags && thread.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {thread.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#2c2f38] text-green-400 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#2c2f38] p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {thread.views} views
            </span>
            <span className="text-sm text-gray-400">
              {thread.replyCount} replies
            </span>
          </div>
          <button
            onClick={onToggleSubscription}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isSubscribed
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-[#2c2f38] text-gray-300 hover:bg-[#3c3f48]"
            )}
          >
            {isSubscribed ? (
              <>
                <BellOff className="w-4 h-4" />
                Unsubscribe
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Subscribe
              </>
            )}
          </button>
        </div>
      </div>

      {/* Replies */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          Replies ({replies.length})
        </h2>

        {replies.map((reply, index) => (
          <div
            key={reply.id}
            id={`reply-${reply.id}`}
            className="bg-[#1a1d2d] border border-[#2c2f38] rounded-lg overflow-hidden"
          >
            {/* Reply Header */}
            <div className="bg-[#0f1419] border-b border-[#2c2f38] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={reply.author.avatarUrl}
                      alt={reply.author.username}
                    />
                    <AvatarFallback>
                      {reply.author.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-white">
                      {reply.author.username}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {reply.author.role && (
                        <span className="text-green-400 font-medium mr-2">
                          {reply.author.role}
                        </span>
                      )}
                      {reply.author.postCount && (
                        <span>{reply.author.postCount} posts</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    #{index + 1}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(reply.createdAt).toLocaleString()}
                    {reply.isEdited && " (edited)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Reply Content */}
            <div className="p-6">
              {/* Quoted Reply */}
              {reply.quotedReply && (
                <div className="bg-[#0f1419] border-l-4 border-green-500 p-3 mb-4 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Quote className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {reply.quotedReply.author.username} said:
                    </span>
                  </div>
                  <div
                    className="prose prose-invert prose-sm max-w-none text-gray-400 line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: reply.quotedReply.content,
                    }}
                  />
                </div>
              )}

              {/* Reply Text */}
              {editingReplyId === reply.id ? (
                <ForumReplyComposer
                  initialContent={reply.content}
                  onSubmit={(content) => {
                    onEditReply?.(reply.id, content);
                    setEditingReplyId(null);
                  }}
                  onCancel={() => setEditingReplyId(null)}
                  submitLabel="Save Changes"
                />
              ) : (
                <div
                  className="prose prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: reply.content }}
                />
              )}
            </div>

            {/* Reply Actions */}
            <div className="border-t border-[#2c2f38] p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onLikeReply?.(reply.id)}
                  className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    reply.likedByCurrentUser
                      ? "text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  )}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={reply.likedByCurrentUser ? "currentColor" : "none"}
                  />
                  <span>{reply.likes}</span>
                </button>
                <button
                  onClick={() => handleQuote(reply)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Quote className="w-4 h-4" />
                  Quote
                </button>
              </div>
              {isAuthor(reply.author.id) && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingReplyId(reply.id)}
                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteReply?.(reply.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reply Composer */}
      <div id="reply-composer" className="scroll-mt-4">
        <ForumReplyComposer
          quotedReply={quotedReply}
          onSubmit={handleSubmitReply}
          onCancelQuote={() => setQuotedReply(null)}
        />
      </div>
    </div>
  );
};
