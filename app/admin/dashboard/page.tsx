"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import useAuth from "@/redux/hooks/useAuth";
import {
  LifeBuoy,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  ArrowRight,
  TicketIcon,
  TrendingUp,
  Users,
} from "lucide-react";

const apiBase =
  process.env.NEXT_PUBLIC_FLORAL_VAULT_DEV_API_URL ||
  process.env.NEXT_PUBLIC_FLORAL_VAULT_API_URL ||
  "https://floral-vault-api.onrender.com";

function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byCategory?: Record<string, number>;
  byPriority?: Record<string, number>;
}

interface RecentTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  priority: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; username: string; firstName: string; lastName: string; avatarUrl?: string } | null;
  _count?: { replies: number; attachments: number };
}

async function fetchStats(): Promise<DashboardStats> {
  const token = getToken();
  const fallback: DashboardStats = { total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 };
  if (!token) return fallback;
  try {
    const res = await fetch(`${apiBase}/api/support/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return fallback;
    const json = await res.json();
    return json.data || json;
  } catch {
    return fallback;
  }
}

async function fetchRecentTickets(): Promise<RecentTicket[]> {
  const token = getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${apiBase}/api/support/admin/tickets?limit=5`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || json.tickets || [];
  } catch {
    return [];
  }
}

const STATUS_CONFIGS: Record<string, { bg: string; text: string; icon: typeof Clock; label: string }> = {
  OPEN: { bg: "bg-blue-500/10", text: "text-blue-400", icon: Clock, label: "Open" },
  IN_PROGRESS: { bg: "bg-amber-500/10", text: "text-amber-400", icon: AlertTriangle, label: "In Progress" },
  RESOLVED: { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: CheckCircle2, label: "Resolved" },
  CLOSED: { bg: "bg-zinc-500/10", text: "text-zinc-400", icon: XCircle, label: "Closed" },
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "text-zinc-400 bg-zinc-500/10",
  MEDIUM: "text-blue-400 bg-blue-500/10",
  HIGH: "text-orange-400 bg-orange-500/10",
  CRITICAL: "text-red-400 bg-red-500/10",
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [statsData, ticketsData] = await Promise.all([fetchStats(), fetchRecentTickets()]);
    setStats(statsData);
    setRecentTickets(ticketsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-[#81a308]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <LifeBuoy className="w-6 h-6 text-[#81a308]" />
          Admin Dashboard
        </h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Overview of support tickets and activity
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <TicketIcon className="w-4 h-4 text-[#81a308]" />
            <span className="text-xs text-zinc-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-zinc-500">Open</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.open}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-zinc-500">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.inProgress}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-zinc-500">Resolved</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.resolved}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-zinc-400" />
            <span className="text-xs text-zinc-500">Closed</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.closed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {stats.byPriority && Object.keys(stats.byPriority).length > 0 && (
          <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#81a308]" />
              By Priority
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.byPriority).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[priority] || "text-zinc-400 bg-zinc-500/10"}`}>
                    {priority}
                  </span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.byCategory && Object.keys(stats.byCategory).length > 0 && (
          <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#81a308]" />
              By Category
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{category}</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link
              href="/admin/tickets"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm text-zinc-600 dark:text-zinc-400">View All Tickets</span>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </Link>
            <Link
              href="/admin/tickets?status=OPEN"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Open Tickets</span>
              <span className="text-xs font-medium text-blue-400">{stats.open}</span>
            </Link>
            <Link
              href="/admin/tickets?priority=CRITICAL"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Critical Priority</span>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Recent Tickets</h3>
          <Link
            href="/admin/tickets"
            className="text-xs text-[#81a308] hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {recentTickets.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-8">No tickets yet</p>
        ) : (
          <div className="space-y-2">
            {recentTickets.map((ticket) => {
              const statusConfig = STATUS_CONFIGS[ticket.status] || STATUS_CONFIGS.OPEN;
              return (
                <Link
                  key={ticket.id}
                  href={`/admin/tickets/${ticket.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-zinc-400 font-mono">{ticket.ticketNumber}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                        {statusConfig.label}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${PRIORITY_COLORS[ticket.priority] || ""}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-900 dark:text-white truncate">{ticket.subject}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {ticket.user ? `@${ticket.user.username}` : ticket.name} · {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
