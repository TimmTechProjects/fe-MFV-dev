"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ForumActivity } from "@/types/forums";
import { MessageSquare, FileText, Edit, Clock } from "lucide-react";

interface RecentActivityFeedProps {
  activities: ForumActivity[];
  limit?: number;
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  activities,
  limit = 10,
}) => {
  const displayActivities = activities.slice(0, limit);

  const getActivityIcon = (type: ForumActivity["type"]) => {
    switch (type) {
      case "new_thread":
        return <FileText className="w-4 h-4 text-green-400" />;
      case "new_reply":
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case "thread_updated":
        return <Edit className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getActivityText = (activity: ForumActivity) => {
    switch (activity.type) {
      case "new_thread":
        return "created a new thread";
      case "new_reply":
        return "replied to";
      case "thread_updated":
        return "updated";
    }
  };

  return (
    <div className="bg-[#1a1d2d] border border-[#2c2f38] rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-green-400" />
        Recent Activity
      </h3>

      <div className="space-y-4">
        {displayActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 pb-4 border-b border-[#2c2f38] last:border-b-0 last:pb-0"
          >
            {/* Activity Icon */}
            <div className="mt-1">{getActivityIcon(activity.type)}</div>

            {/* User Avatar */}
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage
                src={activity.user.avatarUrl}
                alt={activity.user.username}
              />
              <AvatarFallback className="text-xs">
                {activity.user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">
                  {activity.user.username}
                </span>{" "}
                <span className="text-gray-400">
                  {getActivityText(activity)}
                </span>{" "}
                <Link
                  href={`/forums/${activity.thread.categoryId}/${activity.thread.id}`}
                  className="font-medium text-green-400 hover:text-green-300 transition-colors"
                >
                  {activity.thread.title}
                </Link>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                in{" "}
                <Link
                  href={`/forums/${activity.thread.categoryId}`}
                  className="text-gray-400 hover:text-gray-300"
                >
                  {activity.thread.categoryName}
                </Link>{" "}
                • {new Date(activity.createdAt).toLocaleString()}
              </p>
              {activity.content && (
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                  {activity.content}
                </p>
              )}
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};
