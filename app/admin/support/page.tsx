"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import useAuth from "@/redux/hooks/useAuth";
import Link from "next/link";
import {
  LifeBuoy,
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Loader2,
  Send,
  ArrowLeft,
  Filter,
  BarChart3,
  StickyNote,
  Shield,
  RefreshCw,
  TrendingUp,
  Users,
  Inbox,
  ChevronDown,
} from "lucide-react";
import type {
  SupportTicket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  InternalNote,
  TicketStats,
  AdminTicketFilters,
} from "@/types/support";

const apiBase =
  process.env.NEXT_PUBLIC_FLORAL_VAULT_DEV_API_URL ||
  process.env.NEXT_PUBLIC_FLORAL_VAULT_API_URL ||
  "https://floral-vault-api.onrender.com";

function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

async function fetchAdminTickets(
  filters: AdminTicketFilters = {}
): Promise<{ tickets: SupportTicket[]; total: number; stats: TicketStats }> {
  const token = getToken();
  if (!token)
    return {
      tickets: [],
      total: 0,
      stats: { total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 },
    };
  try {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== "all")
      params.set("status", filters.status);
    if (filters.priority && filters.priority !== "all")
      params.set("priority", filters.priority);
    if (filters.category && filters.category !== "all")
      params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    if (filters.page) params.set("page", String(filters.page));
    const res = await fetch(
      `${apiBase}/api/support/admin/tickets?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok)
      return {
        tickets: [],
        total: 0,
        stats: { total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 },
      };
    return await res.json();
  } catch {
    return {
      tickets: [],
      total: 0,
      stats: { total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 },
    };
  }
}

async function fetchAdminTicketById(
  id: string
): Promise<SupportTicket | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${apiBase}/api/support/admin/tickets/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function adminReplyToTicket(
  ticketId: string,
  content: string
): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(
      `${apiBase}/api/support/admin/tickets/${ticketId}/reply`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(
      `${apiBase}/api/support/admin/tickets/${ticketId}/status`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

async function fetchInternalNotes(
  ticketId: string
): Promise<InternalNote[]> {
  const token = getToken();
  if (!token) return [];
  try {
    const res = await fetch(
      `${apiBase}/api/support/admin/tickets/${ticketId}/notes`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.notes || [];
  } catch {
    return [];
  }
}

async function addInternalNote(
  ticketId: string,
  content: string
): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(
      `${apiBase}/api/support/admin/tickets/${ticketId}/notes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

const STATUS_CONFIG: Record<
  TicketStatus,
  { bg: string; text: string; icon: typeof Clock; label: string }
> = {
  open: { bg: "bg-blue-500/10", text: "text-blue-400", icon: Clock, label: "Open" },
  in_progress: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    icon: AlertTriangle,
    label: "In Progress",
  },
  resolved: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    icon: CheckCircle2,
    label: "Resolved",
  },
  closed: { bg: "bg-zinc-500/10", text: "text-zinc-400", icon: XCircle, label: "Closed" },
};

const CATEGORY_LABELS: Record<TicketCategory, string> = {
  bug: "Bug Report",
  feature: "Feature Request",
  account: "Account Issue",
  payment: "Payment",
  other: "Other",
};

const PRIORITY_CONFIG: Record<
  TicketPriority,
  { color: string; label: string }
> = {
  low: { color: "text-zinc-400 bg-zinc-500/10", label: "Low" },
  medium: { color: "text-blue-400 bg-blue-500/10", label: "Medium" },
  high: { color: "text-orange-400 bg-orange-500/10", label: "High" },
  critical: { color: "text-red-400 bg-red-500/10", label: "Critical" },
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: typeof Clock;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          {label}
        </span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
    </div>
  );
}

type AdminView = "dashboard" | "detail";

export default function AdminSupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<AdminView>("dashboard");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const [filters, setFilters] = useState<AdminTicketFilters>({
    status: "all",
    priority: "all",
    category: "all",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const [replyContent, setReplyContent] = useState("");
  const [replying, setReplying] = useState(false);

  const [internalNotes, setInternalNotes] = useState<InternalNote[]>([]);
  const [noteContent, setNoteContent] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const [activeTab, setActiveTab] = useState<"conversation" | "notes">("conversation");

  const loadTickets = useCallback(async () => {
    setLoading(true);
    const data = await fetchAdminTickets(filters);
    setTickets(data.tickets);
    setStats(data.stats);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    if (user) loadTickets();
  }, [user, loadTickets]);

  const openTicketDetail = async (ticket: SupportTicket) => {
    const full = await fetchAdminTicketById(ticket.id);
    setSelectedTicket(full || ticket);
    const notes = await fetchInternalNotes(ticket.id);
    setInternalNotes(notes);
    setView("detail");
    setActiveTab("conversation");
  };

  const handleAdminReply = async () => {
    if (!selectedTicket || !replyContent.trim()) return;
    setReplying(true);
    const ok = await adminReplyToTicket(selectedTicket.id, replyContent);
    if (ok) {
      toast.success("Reply sent");
      setReplyContent("");
      const updated = await fetchAdminTicketById(selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    } else {
      toast.error("Failed to send reply");
    }
    setReplying(false);
  };

  const handleStatusChange = async (status: TicketStatus) => {
    if (!selectedTicket) return;
    const ok = await updateTicketStatus(selectedTicket.id, status);
    if (ok) {
      toast.success(`Status updated to ${status.replace("_", " ")}`);
      setSelectedTicket({ ...selectedTicket, status });
      loadTickets();
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleAddNote = async () => {
    if (!selectedTicket || !noteContent.trim()) return;
    setAddingNote(true);
    const ok = await addInternalNote(selectedTicket.id, noteContent);
    if (ok) {
      toast.success("Note added");
      setNoteContent("");
      const notes = await fetchInternalNotes(selectedTicket.id);
      setInternalNotes(notes);
    } else {
      toast.error("Failed to add note");
    }
    setAddingNote(false);
  };

  const updateFilter = (key: keyof AdminTicketFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center">
        <Shield className="w-12 h-12 text-zinc-400 mb-3" />
        <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">
          Admin access required
        </h2>
        <Link href="/login" className="mt-4 text-[#81a308] hover:underline text-sm">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {view === "dashboard" && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#81a308]" />
                  <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    Admin Support
                  </h1>
                </div>
                <p className="text-sm text-zinc-500 mt-0.5">
                  Manage and respond to support tickets
                </p>
              </div>
              <Button
                onClick={loadTickets}
                variant="outline"
                className="border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                <RefreshCw className="w-4 h-4 mr-1.5" />
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              <StatCard
                label="Total"
                value={stats.total}
                icon={Inbox}
                color="text-zinc-400"
              />
              <StatCard
                label="Open"
                value={stats.open}
                icon={Clock}
                color="text-blue-400"
              />
              <StatCard
                label="In Progress"
                value={stats.inProgress}
                icon={TrendingUp}
                color="text-amber-400"
              />
              <StatCard
                label="Resolved"
                value={stats.resolved}
                icon={CheckCircle2}
                color="text-emerald-400"
              />
              <StatCard
                label="Closed"
                value={stats.closed}
                icon={XCircle}
                color="text-zinc-400"
              />
            </div>

            <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      placeholder="Search tickets by subject or user..."
                      value={filters.search || ""}
                      onChange={(e) => updateFilter("search", e.target.value)}
                      className="pl-9 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`border-zinc-200 dark:border-zinc-700 ${
                      showFilters
                        ? "bg-[#81a308]/10 text-[#81a308] border-[#81a308]/30"
                        : "text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <Filter className="w-4 h-4 mr-1.5" />
                    Filters
                    <ChevronDown
                      className={`w-3 h-3 ml-1 transition-transform ${
                        showFilters ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">
                        Status
                      </label>
                      <select
                        value={filters.status || "all"}
                        onChange={(e) => updateFilter("status", e.target.value)}
                        className="w-full text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
                      >
                        <option value="all">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">
                        Priority
                      </label>
                      <select
                        value={filters.priority || "all"}
                        onChange={(e) => updateFilter("priority", e.target.value)}
                        className="w-full text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
                      >
                        <option value="all">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">
                        Category
                      </label>
                      <select
                        value={filters.category || "all"}
                        onChange={(e) => updateFilter("category", e.target.value)}
                        className="w-full text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
                      >
                        <option value="all">All Categories</option>
                        <option value="bug">Bug Report</option>
                        <option value="feature">Feature Request</option>
                        <option value="account">Account Issue</option>
                        <option value="payment">Payment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-[#81a308]" />
                </div>
              ) : tickets.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                    <Inbox className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                    No tickets found
                  </h3>
                  <p className="text-sm text-zinc-500">
                    {filters.search || filters.status !== "all"
                      ? "Try adjusting your filters"
                      : "No support tickets yet"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {tickets.map((ticket) => {
                    const statusCfg = STATUS_CONFIG[ticket.status];
                    const priorityCfg = PRIORITY_CONFIG[ticket.priority];
                    return (
                      <button
                        key={ticket.id}
                        onClick={() => openTicketDetail(ticket)}
                        className="w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                                {ticket.subject}
                              </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mb-2">
                              {ticket.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusCfg.bg} ${statusCfg.text}`}
                              >
                                {statusCfg.label}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full ${priorityCfg.color}`}
                              >
                                {priorityCfg.label}
                              </span>
                              <span className="text-[10px] text-zinc-400">
                                {CATEGORY_LABELS[ticket.category]}
                              </span>
                              <span className="text-[10px] text-zinc-400">
                                by @{ticket.user.username}
                              </span>
                              <span className="text-[10px] text-zinc-400">
                                {new Date(ticket.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {ticket.messages?.length > 0 && (
                              <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                                <MessageSquare className="w-3 h-3" />
                                {ticket.messages.length}
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-zinc-400" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {view === "detail" && selectedTicket && (
          <>
            <button
              onClick={() => {
                setView("dashboard");
                setSelectedTicket(null);
                setReplyContent("");
                setNoteContent("");
                setShowNotes(false);
              }}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to tickets
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div>
                      <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                        {selectedTicket.subject}
                      </h1>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            STATUS_CONFIG[selectedTicket.status].bg
                          } ${STATUS_CONFIG[selectedTicket.status].text}`}
                        >
                          {STATUS_CONFIG[selectedTicket.status].label}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {CATEGORY_LABELS[selectedTicket.category]}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            PRIORITY_CONFIG[selectedTicket.priority].color
                          }`}
                        >
                          {PRIORITY_CONFIG[selectedTicket.priority].label}
                        </span>
                      </div>
                    </div>
                    <div>
                      <select
                        value={selectedTicket.status}
                        onChange={(e) =>
                          handleStatusChange(e.target.value as TicketStatus)
                        }
                        className="text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    {selectedTicket.description}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                    <span>
                      Created{" "}
                      {new Date(selectedTicket.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Updated{" "}
                      {new Date(selectedTicket.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1 bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-1">
                  <button
                    onClick={() => setActiveTab("conversation")}
                    className={`flex-1 text-sm font-medium py-2 px-4 rounded-lg transition-colors ${
                      activeTab === "conversation"
                        ? "bg-[#81a308]/10 text-[#81a308]"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 inline mr-1.5" />
                    Conversation
                  </button>
                  <button
                    onClick={() => setActiveTab("notes")}
                    className={`flex-1 text-sm font-medium py-2 px-4 rounded-lg transition-colors ${
                      activeTab === "notes"
                        ? "bg-[#81a308]/10 text-[#81a308]"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <StickyNote className="w-4 h-4 inline mr-1.5" />
                    Internal Notes
                    {internalNotes.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1.5 text-[10px] px-1.5 py-0 bg-zinc-200 dark:bg-zinc-700"
                      >
                        {internalNotes.length}
                      </Badge>
                    )}
                  </button>
                </div>

                {activeTab === "conversation" && (
                  <div className="space-y-3">
                    {selectedTicket.messages?.length === 0 && (
                      <div className="text-center py-8 text-sm text-zinc-400">
                        No messages yet
                      </div>
                    )}
                    {selectedTicket.messages?.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-xl border ${
                          msg.isAdminReply
                            ? "bg-[#81a308]/5 border-[#81a308]/20"
                            : "bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
                            {msg.sender.avatarUrl ? (
                              <img
                                src={msg.sender.avatarUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#81a308] to-emerald-600 flex items-center justify-center">
                                <span className="text-white text-[8px] font-bold">
                                  {msg.sender.username[0]?.toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-medium text-zinc-900 dark:text-white">
                            {msg.sender.username}
                            {msg.isAdminReply && (
                              <span className="ml-1 text-[#81a308]">(Staff)</span>
                            )}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {msg.content}
                        </p>
                      </div>
                    ))}

                    {selectedTicket.status !== "closed" && (
                      <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">
                          Quick Reply
                        </label>
                        <Textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write your reply to the user..."
                          rows={3}
                          className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 resize-none mb-3"
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={handleAdminReply}
                            disabled={replying || !replyContent.trim()}
                            className="bg-[#81a308] hover:bg-[#6c8a0a] text-white"
                          >
                            {replying ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                            ) : (
                              <Send className="w-4 h-4 mr-1.5" />
                            )}
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "notes" && (
                  <div className="space-y-3">
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
                      <p className="text-xs text-amber-400 flex items-center gap-1.5">
                        <StickyNote className="w-3.5 h-3.5" />
                        Internal notes are only visible to admin staff
                      </p>
                    </div>

                    {internalNotes.length === 0 && (
                      <div className="text-center py-8 text-sm text-zinc-400">
                        No internal notes yet
                      </div>
                    )}

                    {internalNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-amber-400 text-[8px] font-bold">
                              {note.author.username[0]?.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-zinc-900 dark:text-white">
                            {note.author.username}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {note.content}
                        </p>
                      </div>
                    ))}

                    <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">
                        Add Internal Note
                      </label>
                      <Textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Add a private note about this ticket..."
                        rows={3}
                        className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 resize-none mb-3"
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleAddNote}
                          disabled={addingNote || !noteContent.trim()}
                          variant="outline"
                          className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                        >
                          {addingNote ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                          ) : (
                            <StickyNote className="w-4 h-4 mr-1.5" />
                          )}
                          Add Note
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-zinc-400" />
                    Ticket Info
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wide mb-0.5">
                        Submitted by
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
                          {selectedTicket.user.avatarUrl ? (
                            <img
                              src={selectedTicket.user.avatarUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#81a308] to-emerald-600 flex items-center justify-center">
                              <span className="text-white text-[8px] font-bold">
                                {selectedTicket.user.username[0]?.toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-zinc-900 dark:text-white">
                            @{selectedTicket.user.username}
                          </p>
                          <p className="text-[10px] text-zinc-400">
                            {selectedTicket.user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3">
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wide mb-1">
                        Ticket ID
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 font-mono">
                        {selectedTicket.id}
                      </p>
                    </div>
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3">
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wide mb-1">
                        Created
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300">
                        {new Date(selectedTicket.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3">
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wide mb-1">
                        Last Updated
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300">
                        {new Date(selectedTicket.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3">
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wide mb-1">
                        Messages
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300">
                        {selectedTicket.messages?.length || 0} messages
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    {selectedTicket.status !== "in_progress" && (
                      <Button
                        onClick={() => handleStatusChange("in_progress")}
                        variant="outline"
                        className="w-full justify-start border-zinc-200 dark:border-zinc-700 text-amber-500 hover:bg-amber-500/10"
                        size="sm"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 mr-2" />
                        Mark In Progress
                      </Button>
                    )}
                    {selectedTicket.status !== "resolved" && (
                      <Button
                        onClick={() => handleStatusChange("resolved")}
                        variant="outline"
                        className="w-full justify-start border-zinc-200 dark:border-zinc-700 text-emerald-500 hover:bg-emerald-500/10"
                        size="sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                        Mark Resolved
                      </Button>
                    )}
                    {selectedTicket.status !== "closed" && (
                      <Button
                        onClick={() => handleStatusChange("closed")}
                        variant="outline"
                        className="w-full justify-start border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:bg-zinc-500/10"
                        size="sm"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-2" />
                        Close Ticket
                      </Button>
                    )}
                    {selectedTicket.status === "closed" && (
                      <Button
                        onClick={() => handleStatusChange("open")}
                        variant="outline"
                        className="w-full justify-start border-zinc-200 dark:border-zinc-700 text-blue-400 hover:bg-blue-500/10"
                        size="sm"
                      >
                        <Clock className="w-3.5 h-3.5 mr-2" />
                        Reopen Ticket
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
