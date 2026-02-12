"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { ForumThreadView, ForumPagination } from "@/components/forums";
import {
  mockForumCategories,
  mockForumThreads,
  mockForumReplies,
} from "@/mock/forums";
import { ChevronLeft } from "lucide-react";

const REPLIES_PER_PAGE = 10;

export default function ThreadPage({
  params,
}: {
  params: Promise<{ category: string; threadId: string }>;
}) {
  const resolvedParams = use(params);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Find the category
  const category = mockForumCategories.find(
    (cat) => cat.slug === resolvedParams.category
  );

  // Find the thread
  const thread = mockForumThreads.find(
    (t) => t.slug === resolvedParams.threadId
  );

  if (!category || !thread) {
    return (
      <div className="min-h-screen bg-[#0f1419] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Thread Not Found</h1>
          <p className="text-gray-400 mb-6">
            The thread you're looking for doesn't exist.
          </p>
          <Link
            href="/forums"
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            ← Back to Forums
          </Link>
        </div>
      </div>
    );
  }

  // Get replies for this thread
  const threadReplies = mockForumReplies.filter(
    (reply) => reply.threadId === thread.id
  );

  // Paginate replies
  const totalPages = Math.ceil(threadReplies.length / REPLIES_PER_PAGE);
  const startIndex = (currentPage - 1) * REPLIES_PER_PAGE;
  const paginatedReplies = threadReplies.slice(
    startIndex,
    startIndex + REPLIES_PER_PAGE
  );

  const handleLikeReply = (replyId: string) => {
    console.log("Liking reply:", replyId);
    // TODO: Implement like functionality when backend is ready
  };

  const handleSubmitReply = (content: string, quotedReplyId?: string) => {
    console.log("Submitting reply:", { content, quotedReplyId });
    // TODO: Implement reply submission when backend is ready
  };

  const handleEditReply = (replyId: string, content: string) => {
    console.log("Editing reply:", { replyId, content });
    // TODO: Implement reply editing when backend is ready
  };

  const handleDeleteReply = (replyId: string) => {
    if (confirm("Are you sure you want to delete this reply?")) {
      console.log("Deleting reply:", replyId);
      // TODO: Implement reply deletion when backend is ready
    }
  };

  const handleToggleSubscription = () => {
    setIsSubscribed(!isSubscribed);
    console.log("Toggling subscription:", !isSubscribed);
    // TODO: Implement subscription when backend is ready
  };

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      {/* Header */}
      <div className="bg-[#1a1d2d] border-b border-[#2c2f38]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link
              href="/forums"
              className="hover:text-white transition-colors"
            >
              Forums
            </Link>
            <span>/</span>
            <Link
              href={`/forums/${category.slug}`}
              className="hover:text-white transition-colors"
            >
              {category.name}
            </Link>
            <span>/</span>
            <span className="text-white truncate max-w-xs md:max-w-md">
              {thread.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Thread Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/forums/${category.slug}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {category.name}
        </Link>

        <ForumThreadView
          thread={thread}
          replies={paginatedReplies}
          currentUserId="1" // TODO: Get from auth context
          isSubscribed={isSubscribed}
          onLikeReply={handleLikeReply}
          onSubmitReply={handleSubmitReply}
          onEditReply={handleEditReply}
          onDeleteReply={handleDeleteReply}
          onToggleSubscription={handleToggleSubscription}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <ForumPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Thread Navigation (Previous/Next) */}
      <div className="bg-[#1a1d2d] border-t border-[#2c2f38] mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="text-sm">
              <span className="text-gray-400">Previous Thread:</span>
              <br />
              <span className="text-gray-500">
                (Navigate to previous thread when implemented)
              </span>
            </div>
            <div className="text-sm md:text-right">
              <span className="text-gray-400">Next Thread:</span>
              <br />
              <span className="text-gray-500">
                (Navigate to next thread when implemented)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Threads Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-xl font-bold text-white mb-4">
          More from {category.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockForumThreads
            .filter(
              (t) => t.categoryId === category.id && t.id !== thread.id
            )
            .slice(0, 4)
            .map((relatedThread) => (
              <Link
                key={relatedThread.id}
                href={`/forums/${category.slug}/${relatedThread.slug}`}
                className="block p-4 bg-[#1a1d2d] border border-[#2c2f38] rounded-lg hover:bg-[#22254a] transition-colors"
              >
                <h4 className="text-white font-semibold mb-2 line-clamp-2">
                  {relatedThread.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{relatedThread.replyCount} replies</span>
                  <span>•</span>
                  <span>{relatedThread.views} views</span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
