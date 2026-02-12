"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ForumCategory } from "@/types/forums";
import { MessageSquare, FileText, Clock } from "lucide-react";

interface ForumCategoryListProps {
  categories: ForumCategory[];
}

export const ForumCategoryList: React.FC<ForumCategoryListProps> = ({
  categories,
}) => {
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/forums/${category.slug}`}
          className="block bg-[#1a1d2d] hover:bg-[#22254a] transition-colors border border-[#2c2f38] rounded-lg overflow-hidden"
        >
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Category Icon */}
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: category.color || "#4B5563" }}
              >
                <span className="text-2xl">{category.icon || "📁"}</span>
              </div>

              {/* Category Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-1 truncate">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {category.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">{category.threadCount}</span>
                  <span className="hidden sm:inline">threads</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium">{category.postCount}</span>
                  <span className="hidden sm:inline">posts</span>
                </div>
              </div>

              {/* Last Post */}
              {category.lastPost && (
                <div className="md:w-48 flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-[#2c2f38] md:pl-6">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage
                      src={category.lastPost.author.avatarUrl}
                      alt={category.lastPost.author.username}
                    />
                    <AvatarFallback className="text-xs">
                      {category.lastPost.author.username
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate font-medium">
                      {category.lastPost.threadTitle}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {new Date(category.lastPost.createdAt).toLocaleDateString(
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
      ))}
    </div>
  );
};
