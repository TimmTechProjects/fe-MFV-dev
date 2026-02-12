"use client";

import React from "react";
import { ImageIcon, VideoIcon, Smile, Leaf } from "lucide-react";

interface FeedHeaderProps {
  onCreatePost?: () => void;
}

export default function FeedHeader({ onCreatePost }: FeedHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800/50 bg-white dark:bg-black sticky top-0 z-10 backdrop-blur-xl bg-white/90 dark:bg-black/90">
      <div className="flex gap-3 items-start">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#81a308]/30 to-emerald-500/20 flex-shrink-0 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-[#81a308]" />
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Share something with the community..."
            onClick={onCreatePost}
            readOnly
            className="w-full bg-gray-100 dark:bg-gray-900/60 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#81a308]/30 border border-gray-200 dark:border-gray-800/50 transition-all cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900/80"
          />
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pl-14">
        <div className="flex gap-1">
          <button
            onClick={onCreatePost}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-[#81a308] px-3 py-2 rounded-lg hover:bg-[#81a308]/5 transition-all text-sm font-medium"
          >
            <ImageIcon className="w-4 h-4" />
            Photo
          </button>
          <button
            onClick={onCreatePost}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-emerald-400 px-3 py-2 rounded-lg hover:bg-emerald-500/5 transition-all text-sm font-medium"
          >
            <VideoIcon className="w-4 h-4" />
            Video
          </button>
          <button
            onClick={onCreatePost}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-green-400 px-3 py-2 rounded-lg hover:bg-green-500/5 transition-all text-sm font-medium"
          >
            <Smile className="w-4 h-4" />
            Feeling
          </button>
        </div>
        <button
          onClick={onCreatePost}
          className="bg-[#81a308] hover:bg-[#6c8a0a] text-white px-6 py-2 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#81a308]/20 transition-all"
        >
          Post
        </button>
      </div>
    </div>
  );
}
