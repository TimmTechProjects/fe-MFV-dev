"use client";

import React from "react";
import Link from "next/link";
import { PopularThread } from "@/types/forums";
import { TrendingUp, MessageSquare, Eye, Flame } from "lucide-react";

interface PopularThreadsSidebarProps {
  threads: PopularThread[];
  limit?: number;
}

export const PopularThreadsSidebar: React.FC<PopularThreadsSidebarProps> = ({
  threads,
  limit = 5,
}) => {
  const displayThreads = threads.slice(0, limit);

  return (
    <div className="bg-[#1a1d2d] border border-[#2c2f38] rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-400" />
        Popular Threads
      </h3>

      <div className="space-y-3">
        {displayThreads.map((item, index) => {
          const { thread } = item;
          return (
            <Link
              key={thread.id}
              href={`/forums/${thread.categoryId}/${thread.slug}`}
              className="block p-3 bg-[#0f1419] hover:bg-[#1a1d2d] border border-[#2c2f38] rounded-lg transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Rank Badge */}
                <div
                  className={`w-6 h-6 flex-shrink-0 rounded flex items-center justify-center text-xs font-bold ${
                    index === 0
                      ? "bg-yellow-600 text-white"
                      : index === 1
                      ? "bg-gray-400 text-white"
                      : index === 2
                      ? "bg-orange-600 text-white"
                      : "bg-[#2c2f38] text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Thread Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white line-clamp-2 mb-2">
                    {thread.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{thread.replyCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{thread.views}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    in {thread.categoryName}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}

        {threads.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No popular threads yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
