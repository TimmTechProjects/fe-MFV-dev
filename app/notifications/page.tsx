"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import useAuth from "@/redux/hooks/useAuth";
import {
  Bell,
  BellOff,
  CheckCheck,
  Heart,
  MessageCircle,
  UserPlus,
  AlertCircle,
  Clock,
  Check,
  Settings,
  Loader2,
} from "lucide-react";
import type { Notification, NotificationType } from "@/types/notifications";

const apiBase = process.env.NEXT_PUBLIC_FLORAL_VAULT_DEV_API_URL || process.env.NEXT_PUBLIC_FLORAL_VAULT_API_URL || "https://floral-vault-api.onrender.com";

async function fetchNotifications(page = 1, limit = 20): Promise<{ notifications: Notification[]; total: number; unreadCount: number; page: number; totalPages: number }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return { notifications: [], total: 0, unreadCount: 0, page: 1, totalPages: 0 };
  try {
    const res = await fetch(`${apiBase}/api/notifications?page=${page}&limit=${limit}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { notifications: [], total: 0, unreadCount: 0, page: 1, totalPages: 0 };
    return await res.json();
  } catch {
    return { notifications: [], total: 0, unreadCount: 0, page: 1, totalPages: 0 };
  }
}

async function markNotifRead(id: string): Promise<boolean> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return false;
  try {
    const res = await fetch(`${apiBase}/api/notifications/${id}/read`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function markAllNotifsRead(): Promise<boolean> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return false;
  try {
    const res = await fetch(`${apiBase}/api/notifications/read-all`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

const ICON_MAP: Record<NotificationType, typeof Heart> = {
  post_like: Heart,
  post_comment: MessageCircle,
  forum_reply: MessageCircle,
  forum_vote: Check,
  follow: UserPlus,
  mention: AlertCircle,
  reminder: Clock,
  system: Bell,
};

const COLOR_MAP: Record<NotificationType, string> = {
  post_like: "text-red-400 bg-red-500/10",
  post_comment: "text-blue-400 bg-blue-500/10",
  forum_reply: "text-emerald-400 bg-emerald-500/10",
  forum_vote: "text-amber-400 bg-amber-500/10",
  follow: "text-purple-400 bg-purple-500/10",
  mention: "text-cyan-400 bg-cyan-500/10",
  reminder: "text-orange-400 bg-orange-500/10",
  system: "text-zinc-400 bg-zinc-500/10",
};

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const loadNotifications = useCallback(async (p = 1) => {
    setLoading(true);
    const data = await fetchNotifications(p);
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
    setTotalPages(data.totalPages);
    setPage(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) loadNotifications();
  }, [user, loadNotifications]);

  const handleMarkRead = async (id: string) => {
    const ok = await markNotifRead(id);
    if (ok) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
  };

  const handleMarkAllRead = async () => {
    const ok = await markAllNotifsRead();
    if (ok) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } else {
      toast.error("Failed to mark all as read");
    }
  };

  const filtered = filter === "unread"
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center">
        <Bell className="w-12 h-12 text-zinc-400 mb-3" />
        <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">Please log in to view notifications</h2>
        <Link href="/login" className="mt-4 text-[#81a308] hover:underline text-sm">Log in</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-zinc-500 mt-0.5">{unreadCount} unread</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-xs border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
              >
                <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
                Mark all read
              </Button>
            )}
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "all"
                ? "bg-[#81a308] text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "unread"
                ? "bg-[#81a308] text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#81a308]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
              <BellOff className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </h3>
            <p className="text-sm text-zinc-500">
              {filter === "unread"
                ? "You're all caught up!"
                : "When someone interacts with your content, you'll see it here."}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((notif) => {
              const IconComp = ICON_MAP[notif.type] || Bell;
              const colorClass = COLOR_MAP[notif.type] || "text-zinc-400 bg-zinc-500/10";
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
                    notif.isRead
                      ? "bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                      : "bg-[#81a308]/5 hover:bg-[#81a308]/10 border-l-2 border-[#81a308]"
                  }`}
                  onClick={() => {
                    if (!notif.isRead) handleMarkRead(notif.id);
                  }}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notif.isRead ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-900 dark:text-white font-medium"}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-zinc-400 mt-1">{formatTime(notif.createdAt)}</p>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2 h-2 rounded-full bg-[#81a308] mt-2 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && page < totalPages && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              onClick={() => loadNotifications(page + 1)}
              className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
