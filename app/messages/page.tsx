"use client";

import useAuth from "@/redux/hooks/useAuth";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function MessagesPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center">
        <Mail className="w-12 h-12 text-zinc-400 mb-3" />
        <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">Please log in to view messages</h2>
        <Link href="/login" className="mt-4 text-[#81a308] hover:underline text-sm">Log in</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Messages</h1>
        <p className="text-zinc-500 dark:text-zinc-400">No messages yet. Start a conversation with someone.</p>
      </div>
    </div>
  );
}
