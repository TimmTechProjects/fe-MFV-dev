"use client";

import { Bookmark, Leaf } from "lucide-react";
import Link from "next/link";

export default function SavedPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-7 h-7 text-[#81a308]" />
            <h1 className="text-3xl font-bold">Saved</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Your saved plants, posts, and collections
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-[#81a308]/10 rounded-full flex items-center justify-center mb-4">
            <Bookmark className="w-8 h-8 text-[#81a308]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No saved items yet
          </h3>
          <p className="text-gray-500 max-w-md text-sm mb-6">
            Start saving plants, posts, and collections you love to easily find them later!
          </p>
          <Link
            href="/the-vault"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#81a308] hover:bg-[#6c8a0a] text-white font-semibold rounded-xl transition-all"
          >
            <Leaf className="w-4 h-4" />
            Explore The Vault
          </Link>
        </div>
      </div>
    </div>
  );
}
