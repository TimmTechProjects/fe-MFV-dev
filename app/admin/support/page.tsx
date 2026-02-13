"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/redux/hooks/useAuth";
import {
  LifeBuoy,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronRight,
  BarChart3,
  Filter,
  ArrowUpDown,
  Inbox,
  ShieldAlert,
} from "lucide-react";
import type {
  SupportTicket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  TicketStats,
} from "@/types/support";

const apiBase =
  process.env.NEXT_PUBLIC_FLORAL_VAULT_DEV_API_URL ||
  process.env.NEXT_PUBLIC_FLORAL_VAULT_API_URL ||
  "https://floral-vault-api.onrender.com";

function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

async function fetchAllTickets(
  page = 1,
  filters: { status?: string; priority?: string; category?: string } = {}
): Promise<{ tickets: SupportTicket[]; total: number }> {
  const token = getToken();
  if (!token) return { tickets: [], total: 0 };
  try {
    const params = new URLSearchParams({ page: String(page) });
    if (filters.status) params.set("status", filters.status);
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.category) params.set("category", filters.category);

    const res = await fetch(`${apiBase}/api/support/admin/tickets?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { tickets: [], total: 0 };
    return await res.json();
  } catch {
    return { tickets: [], total: 0 };
  }
}

async function fetchStats(): Promise<TicketStats> {
  const token = getToken();
  const fallback: TicketStats = { total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 };
  if (!token) return fallback;
  try {
    const res = await fetch(`${apiBase}/api/support/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

const STATUS_CONFIGS: Record<TicketStatus, { bg: string; text: string; icon: typeof Clock; label: string }> = {
  open: { bg: "bg-blue-500/10", text: "text-blue-400", icon: Clock, label: "Open" },
  in_progress: { bg: "bg-amber-500/10", text: "text-amber-400", icon: AlertTriangle, label: "In Progress" },
  resolved: { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: CheckCircle2, label: "Resolved" },
  closed: { bg: "bg-zinc-500/10", text: "text-zinc-400", icon: XCircle, label: "Closed" },
};

const CATEGORY_LABELS: Record<TicketCategory, string> = {
  bug: "Bug Report",
  feature: "Feature Request",
  account: "Account Issue",
  payment: "Payment",
  other: "Other",
};

const PRIORITY_COLORS: Record<TicketPriority, string> = {
  low: "text-zinc-400 bg-zinc-500/10",
  medium: "text-blue-400 bg-blue-500/10",
  high: "text-orange-400 bg-orange-500/10",
  critical: "text-red-400 bg-red-500/10",
};

export default function AdminSupportPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<TicketStats>({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<"createdAt" | "priority" | "status">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const loadData = useCallback(async () => {
    setLoading(true);
    const [ticketData, statsData] = await Promise.all([
      fetchAllTickets(1, {
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        category: categoryFilter || undefined,
      }),
      fetchStats(),
    ]);
    setTickets(ticketData.tickets);
    setStats(statsData);
    setLoading(false);
  }, [statusFilter, priorityFilter, categoryFilter]);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  const filteredTickets = tickets
    .filter((t) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.subject.toLowerCase().includes(q) ||
        t.user.username.toLowerCase().includes(q) ||
        t.user.email.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const priorityOrder: Record<TicketPriority, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      const statusOrder: Record<TicketStatus, number> = { open: 4, in_progress: 3, resolved: 2, closed: 1 };

      let comparison = 0;
      if (sortField === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === "priority") {
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortField === "status") {
        comparison = statusOrder[a.status] - statusOrder[b.status];
      }
      return sortDir === "desc" ? -comparison : comparison;
    });

  const toggleSort = (field: "createdAt" | "priority" | "status") => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center">
        <ShieldAlert className="w-12 h-12 text-zinc-400 mb-3" />
        <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">Please log in to access admin panel</h2>
        <Link href="/login" className="mt-4 text-[#81a308] hover:underline text-sm">Log in</Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center">
        <ShieldAlert className="w-12 h-12 text-red-400 mb-3" />
        <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">Access Denied</h2>
        <p className="text-sm text-zinc-500 mt-1">You don&apos;t have permission to access this page.</p>
        <Link href="/" className="mt-4 text-[#81a308] hover:underline text-sm">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <LifeBuoy className="w-6 h-6 text-[#81a308]" />
              Support Dashboard
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">Manage and respond to support tickets</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <button
            onClick={() => { setStatusFilter(""); loadData(); }}
            className={`p-4 rounded-xl border transition-colors ${
              !statusFilter
                ? "bg-[#81a308]/10 border-[#81a308]/30"
                : "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-[#81a308]/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-[#81a308]" />
              <span className="text-xs text-zinc-500">Total</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.total}</p>
          </button>
          <button
            onClick={() => { setStatusFilter("open"); }}
            className={`p-4 rounded-xl border transition-colors ${
              statusFilter === "open"
                ? "bg-blue-500/10 border-blue-500/30"
                : "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-zinc-500">Open</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.open}</p>
          </button>
          <button
            onClick={() => { setStatusFilter("in_progress"); }}
            className={`p-4 rounded-xl border transition-colors ${
              statusFilter === "in_progress"
                ? "bg-amber-500/10 border-amber-500/30"
                : "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-amber-500/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-zinc-500">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.inProgress}</p>
          </button>
          <button
            onClick={() => { setStatusFilter("resolved"); }}
            className={`p-4 rounded-xl border transition-colors ${
              statusFilter === "resolved"
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-zinc-500">Resolved</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.resolved}</p>
          </button>
          <button
            onClick={() => { setStatusFilter("closed"); }}
            className={`p-4 rounded-xl border transition-colors col-span-2 lg:col-span-1 ${
              statusFilter === "closed"
                ? "bg-zinc-500/10 border-zinc-500/30"
                : "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-zinc-500/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-zinc-400" />
              <span className="text-xs text-zinc-500">Closed</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.closed}</p>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search by subject, user, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-zinc-200 dark:border-zinc-800 gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {(priorityFilter || categoryFilter) && (
              <span className="w-2 h-2 bg-[#81a308] rounded-full" />
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="mb-4 p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
                >
                  <option value="">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="account">Account Issue</option>
                  <option value="payment">Payment</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPriorityFilter("");
                  setCategoryFilter("");
                  setStatusFilter("");
                }}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        <div className="hidden md:flex items-center gap-2 mb-2 px-4">
          <button
            onClick={() => toggleSort("createdAt")}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Date
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <button
            onClick={() => toggleSort("priority")}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Priority
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <button
            onClick={() => toggleSort("status")}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Status
            <ArrowUpDown className="w-3 h-3" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#81a308]" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400 mb-1">No tickets found</h3>
            <p className="text-sm text-zinc-500">
              {statusFilter || priorityFilter || categoryFilter || searchQuery
                ? "Try adjusting your filters"
                : "No support tickets yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTickets.map((ticket) => {
              const statusConfig = STATUS_CONFIGS[ticket.status];
              const StatusIcon = statusConfig.icon;
              return (
                <Link
                  key={ticket.id}
                  href={`/admin/support/${ticket.id}`}
                  className="block w-full text-left p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-[#81a308]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-1">
                          {ticket.subject}
                        </h3>
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-1 mb-2">{ticket.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.label}
                        </span>
                        <span className="text-[10px] text-zinc-400">{CATEGORY_LABELS[ticket.category]}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${PRIORITY_COLORS[ticket.priority]}`}>
                          {ticket.priority}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          by @{ticket.user.username}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                        {ticket.messages.length > 0 && (
                          <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                            {ticket.messages.length} replies
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
