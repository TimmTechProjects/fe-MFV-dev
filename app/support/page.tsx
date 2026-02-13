"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/redux/hooks/useAuth";
import {
  LifeBuoy,
  Plus,
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
} from "lucide-react";
import type {
  SupportTicket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  CreateTicketInput,
} from "@/types/support";

const apiBase = process.env.NEXT_PUBLIC_FLORAL_VAULT_DEV_API_URL || process.env.NEXT_PUBLIC_FLORAL_VAULT_API_URL || "https://floral-vault-api.onrender.com";

function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

async function fetchTickets(page = 1): Promise<{ tickets: SupportTicket[]; total: number }> {
  const token = getToken();
  if (!token) return { tickets: [], total: 0 };
  try {
    const res = await fetch(`${apiBase}/api/support/tickets?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { tickets: [], total: 0 };
    return await res.json();
  } catch {
    return { tickets: [], total: 0 };
  }
}

async function fetchTicketById(id: string): Promise<SupportTicket | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${apiBase}/api/support/tickets/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function createTicket(input: CreateTicketInput): Promise<SupportTicket | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${apiBase}/api/support/tickets`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function replyToTicket(ticketId: string, content: string): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${apiBase}/api/support/tickets/${ticketId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const STATUS_COLORS: Record<TicketStatus, { bg: string; text: string; icon: typeof Clock }> = {
  open: { bg: "bg-blue-500/10", text: "text-blue-400", icon: Clock },
  in_progress: { bg: "bg-amber-500/10", text: "text-amber-400", icon: AlertTriangle },
  resolved: { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: CheckCircle2 },
  closed: { bg: "bg-zinc-500/10", text: "text-zinc-400", icon: XCircle },
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

export default function SupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TicketCategory>("bug");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [submitting, setSubmitting] = useState(false);

  const [replyContent, setReplyContent] = useState("");
  const [replying, setReplying] = useState(false);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    const data = await fetchTickets();
    setTickets(data.tickets);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) loadTickets();
  }, [user, loadTickets]);

  const handleCreateTicket = async () => {
    if (!subject.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    const ticket = await createTicket({ subject, description, category, priority });
    if (ticket) {
      toast.success("Ticket created successfully");
      setSubject("");
      setDescription("");
      setCategory("bug");
      setPriority("medium");
      setView("list");
      loadTickets();
    } else {
      toast.error("Failed to create ticket");
    }
    setSubmitting(false);
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyContent.trim()) return;
    setReplying(true);
    const ok = await replyToTicket(selectedTicket.id, replyContent);
    if (ok) {
      toast.success("Reply sent");
      setReplyContent("");
      const updated = await fetchTicketById(selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    } else {
      toast.error("Failed to send reply");
    }
    setReplying(false);
  };

  const openTicket = async (ticket: SupportTicket) => {
    const full = await fetchTicketById(ticket.id);
    setSelectedTicket(full || ticket);
    setView("detail");
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center">
        <LifeBuoy className="w-12 h-12 text-zinc-400 mb-3" />
        <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">Please log in to access support</h2>
        <Link href="/login" className="mt-4 text-[#81a308] hover:underline text-sm">Log in</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {view === "list" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Support</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Get help from our team</p>
              </div>
              <Button
                onClick={() => setView("create")}
                className="bg-[#81a308] hover:bg-[#6c8a0a] text-white"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                New Ticket
              </Button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#81a308]" />
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                  <LifeBuoy className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400 mb-1">No tickets</h3>
                <p className="text-sm text-zinc-500 mb-4">Need help? Create a support ticket.</p>
                <Button onClick={() => setView("create")} className="bg-[#81a308] hover:bg-[#6c8a0a] text-white">
                  Create Ticket
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTickets.map((ticket) => {
                  const statusConfig = STATUS_COLORS[ticket.status];
                  const StatusIcon = statusConfig.icon;
                  return (
                    <button
                      key={ticket.id}
                      onClick={() => openTicket(ticket)}
                      className="w-full text-left p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-[#81a308]/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-1">{ticket.subject}</h3>
                          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{ticket.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                              {ticket.status.replace("_", " ")}
                            </span>
                            <span className="text-[10px] text-zinc-400">{CATEGORY_LABELS[ticket.category]}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${PRIORITY_COLORS[ticket.priority]}`}>
                              {ticket.priority}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {view === "create" && (
          <>
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to tickets
            </button>

            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Create Support Ticket</h1>

            <div className="space-y-4 bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Subject</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TicketCategory)}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
                  >
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="account">Account Issue</option>
                    <option value="payment">Payment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows={6}
                  className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 resize-none"
                />
              </div>

              <Button
                onClick={handleCreateTicket}
                disabled={submitting}
                className="w-full bg-[#81a308] hover:bg-[#6c8a0a] text-white"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Submit Ticket
              </Button>
            </div>
          </>
        )}

        {view === "detail" && selectedTicket && (
          <>
            <button
              onClick={() => { setView("list"); setSelectedTicket(null); }}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to tickets
            </button>

            <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 mb-4">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{selectedTicket.subject}</h1>
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[selectedTicket.status].bg} ${STATUS_COLORS[selectedTicket.status].text}`}>
                  {selectedTicket.status.replace("_", " ")}
                </span>
                <span className="text-xs text-zinc-400">{CATEGORY_LABELS[selectedTicket.category]}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${PRIORITY_COLORS[selectedTicket.priority]}`}>
                  {selectedTicket.priority}
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{selectedTicket.description}</p>
              <p className="text-[10px] text-zinc-400 mt-3">Created {new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="space-y-3 mb-4">
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
                        <img src={msg.sender.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#81a308] to-emerald-600 flex items-center justify-center">
                          <span className="text-white text-[8px] font-bold">{msg.sender.username[0].toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium text-zinc-900 dark:text-white">
                      {msg.sender.username}
                      {msg.isAdminReply && <span className="ml-1 text-[#81a308]">(Staff)</span>}
                    </span>
                    <span className="text-[10px] text-zinc-400">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{msg.content}</p>
                </div>
              ))}
            </div>

            {selectedTicket.status !== "closed" && (
              <div className="flex gap-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  rows={2}
                  className="flex-1 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 resize-none"
                />
                <Button
                  onClick={handleReply}
                  disabled={replying || !replyContent.trim()}
                  className="bg-[#81a308] hover:bg-[#6c8a0a] text-white self-end"
                >
                  {replying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
