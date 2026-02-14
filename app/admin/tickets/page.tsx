"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useAuth from "@/redux/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Filter,
  ArrowUpDown,
  Inbox,
  TicketIcon,
} from "lucide-react";

const apiBase =
  process.env.NEXT_PUBLIC_FLORAL_VAULT_DEV_API_URL ||
  process.env.NEXT_PUBLIC_FLORAL_VAULT_API_URL ||
  "https://floral-vault-api.onrender.com";

function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

interface TicketUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
}

interface AdminTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  user?: TicketUser | null;
  assignedTo?: TicketUser | null;
  _count?: { replies: number; attachments: number };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

async function fetchAdminTickets(
  page: number,
  filters: { status?: string; priority?: string; category?: string; search?: string }
): Promise<{ tickets: AdminTicket[]; pagination: Pagination }> {
  const token = getToken();
  if (!token) return { tickets: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
  try {
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (filters.status) params.set("status", filters.status);
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.category) params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);

    const res = await fetch(`${apiBase}/api/support/admin/tickets?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { tickets: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
    const json = await res.json();
    return {
      tickets: json.data || json.tickets || [],
      pagination: json.pagination || { page: 1, limit: 20, total: 0, pages: 0 },
    };
  } catch {
    return { tickets: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
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
    const json = await res.json();
    return json.data || json;
  } catch {
    return fallback;
  }
}

const STATUS_CONFIGS: Record<string, { bg: string; text: string; icon: typeof Clock; label: string }> = {
  OPEN: { bg: "bg-blue-500/10", text: "text-blue-400", icon: Clock, label: "Open" },
  IN_PROGRESS: { bg: "bg-amber-500/10", text: "text-amber-400", icon: AlertTriangle, label: "In Progress" },
  RESOLVED: { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: CheckCircle2, label: "Resolved" },
  CLOSED: { bg: "bg-zinc-500/10", text: "text-zinc-400", icon: XCircle, label: "Closed" },
};

const CATEGORY_LABELS: Record<string, string> = {
  BUG: "Bug Report",
  FEATURE_REQUEST: "Feature Request",
  ACCOUNT: "Account Issue",
  PAYMENT: "Payment",
  OTHER: "Other",
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "text-zinc-400 bg-zinc-500/10",
  MEDIUM: "text-blue-400 bg-blue-500/10",
  HIGH: "text-orange-400 bg-orange-500/10",
  CRITICAL: "text-red-400 bg-red-500/10",
};

export default function AdminTicketsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [stats, setStats] = useState<TicketStats>({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams?.get("status") || "");
  const [priorityFilter, setPriorityFilter] = useState(searchParams?.get("priority") || "");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<"createdAt" | "priority" | "status">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const loadData = useCallback(async () => {
    setLoading(true);
    const [ticketData, statsData] = await Promise.all([
      fetchAdminTickets(page, {
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        category: categoryFilter || undefined,
        search: searchQuery || undefined,
      }),
      fetchStats(),
    ]);
    setTickets(ticketData.tickets);
    setPagination(ticketData.pagination);
    setStats(statsData);
    setLoading(false);
  }, [page, statusFilter, priorityFilter, categoryFilter, searchQuery]);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  const handleSearch = () => {
    setPage(1);
    loadData();
  };

  const localSorted = [...tickets].sort((a, b) => {
    const priorityOrder: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    const statusOrder: Record<string, number> = { OPEN: 4, IN_PROGRESS: 3, RESOLVED: 2, CLOSED: 1 };

    let comparison = 0;
    if (sortField === "createdAt") {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortField === "priority") {
      comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
    } else if (sortField === "status") {
      comparison = (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <TicketIcon className="w-6 h-6 text-[#81a308]" />
            Support Tickets
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">Manage and respond to support tickets</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          { key: "", label: "Total", count: stats.total, activeBg: "bg-[#81a308]/10", activeBorder: "border-[#81a308]/30", iconColor: "text-[#81a308]", Icon: TicketIcon },
          { key: "OPEN", label: "Open", count: stats.open, activeBg: "bg-blue-500/10", activeBorder: "border-blue-500/30", iconColor: "text-blue-400", Icon: Clock },
          { key: "IN_PROGRESS", label: "In Progress", count: stats.inProgress, activeBg: "bg-amber-500/10", activeBorder: "border-amber-500/30", iconColor: "text-amber-400", Icon: AlertTriangle },
          { key: "RESOLVED", label: "Resolved", count: stats.resolved, activeBg: "bg-emerald-500/10", activeBorder: "border-emerald-500/30", iconColor: "text-emerald-400", Icon: CheckCircle2 },
          { key: "CLOSED", label: "Closed", count: stats.closed, activeBg: "bg-zinc-500/10", activeBorder: "border-zinc-500/30", iconColor: "text-zinc-400", Icon: XCircle },
        ].map(({ key, label, count, activeBg, activeBorder, iconColor, Icon }) => (
          <button
            key={label}
            onClick={() => { setStatusFilter(key); setPage(1); }}
            className={`p-4 rounded-xl border transition-colors ${
              statusFilter === key
                ? `${activeBg} ${activeBorder}`
                : "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
            } ${label === "Closed" ? "col-span-2 lg:col-span-1" : ""}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-4 h-4 ${iconColor}`} />
              <span className="text-xs text-zinc-500">{label}</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{count}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search by subject, email, or ticket number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
                className="w-full text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
              >
                <option value="">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 mb-1 block">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                className="w-full text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
              >
                <option value="">All Categories</option>
                <option value="BUG">Bug Report</option>
                <option value="FEATURE_REQUEST">Feature Request</option>
                <option value="ACCOUNT">Account Issue</option>
                <option value="PAYMENT">Payment</option>
                <option value="OTHER">Other</option>
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
                setSearchQuery("");
                setPage(1);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      )}

      <div className="hidden md:flex items-center gap-2 mb-2 px-4">
        {(["createdAt", "priority", "status"] as const).map((field) => (
          <span key={field}>
            {field !== "createdAt" && <span className="text-zinc-300 dark:text-zinc-700 mr-2">|</span>}
            <button
              onClick={() => toggleSort(field)}
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {field === "createdAt" ? "Date" : field.charAt(0).toUpperCase() + field.slice(1)}
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#81a308]" />
        </div>
      ) : localSorted.length === 0 ? (
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
        <>
          <div className="space-y-2">
            {localSorted.map((ticket) => {
              const statusConfig = STATUS_CONFIGS[ticket.status] || STATUS_CONFIGS.OPEN;
              return (
                <Link
                  key={ticket.id}
                  href={`/admin/tickets/${ticket.id}`}
                  className="block w-full text-left p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-[#81a308]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-zinc-400 font-mono">{ticket.ticketNumber}</span>
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-1">
                          {ticket.subject}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.label}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {CATEGORY_LABELS[ticket.category] || ticket.category}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${PRIORITY_COLORS[ticket.priority] || ""}`}>
                          {ticket.priority}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {ticket.user ? `@${ticket.user.username}` : ticket.name}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                        {ticket._count && ticket._count.replies > 0 && (
                          <span className="text-[10px] text-zinc-400">
                            {ticket._count.replies} {ticket._count.replies === 1 ? "reply" : "replies"}
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

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="border-zinc-200 dark:border-zinc-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-zinc-500">
                Page {page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="border-zinc-200 dark:border-zinc-800"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
