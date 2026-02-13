"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/redux/hooks/useAuth";
import {
  ArrowLeft,
  Send,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  StickyNote,
  MessageSquare,
  ShieldAlert,
  User,
} from "lucide-react";
import type {
  SupportTicket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  InternalNote,
} from "@/types/support";

const apiBase =
  process.env.NEXT_PUBLIC_FLORAL_VAULT_DEV_API_URL ||
  process.env.NEXT_PUBLIC_FLORAL_VAULT_API_URL ||
  "https://floral-vault-api.onrender.com";

function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

async function fetchTicketById(id: string): Promise<SupportTicket | null> {
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

async function adminReply(ticketId: string, content: string): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${apiBase}/api/support/admin/tickets/${ticketId}/reply`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function addInternalNote(ticketId: string, content: string): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${apiBase}/api/support/admin/tickets/${ticketId}/notes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function updateTicketStatus(ticketId: string, status: TicketStatus): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${apiBase}/api/support/admin/tickets/${ticketId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function updateTicketPriority(ticketId: string, priority: TicketPriority): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${apiBase}/api/support/admin/tickets/${ticketId}/priority`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ priority }),
    });
    return res.ok;
  } catch {
    return false;
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

export default function AdminTicketDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const ticketId = params?.id as string;

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [replying, setReplying] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [activeTab, setActiveTab] = useState<"messages" | "notes">("messages");

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const loadTicket = useCallback(async () => {
    if (!ticketId) return;
    setLoading(true);
    const data = await fetchTicketById(ticketId);
    setTicket(data);
    setLoading(false);
  }, [ticketId]);

  useEffect(() => {
    if (user && ticketId) loadTicket();
  }, [user, ticketId, loadTicket]);

  const handleReply = async () => {
    if (!ticket || !replyContent.trim()) return;
    setReplying(true);
    const ok = await adminReply(ticket.id, replyContent);
    if (ok) {
      toast.success("Reply sent");
      setReplyContent("");
      loadTicket();
    } else {
      toast.error("Failed to send reply");
    }
    setReplying(false);
  };

  const handleAddNote = async () => {
    if (!ticket || !noteContent.trim()) return;
    setAddingNote(true);
    const ok = await addInternalNote(ticket.id, noteContent);
    if (ok) {
      toast.success("Note added");
      setNoteContent("");
      loadTicket();
    } else {
      toast.error("Failed to add note");
    }
    setAddingNote(false);
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket) return;
    const ok = await updateTicketStatus(ticket.id, newStatus);
    if (ok) {
      toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
      loadTicket();
    } else {
      toast.error("Failed to update status");
    }
  };

  const handlePriorityChange = async (newPriority: TicketPriority) => {
    if (!ticket) return;
    const ok = await updateTicketPriority(ticket.id, newPriority);
    if (ok) {
      toast.success(`Priority updated to ${newPriority}`);
      loadTicket();
    } else {
      toast.error("Failed to update priority");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center">
        <ShieldAlert className="w-12 h-12 text-zinc-400 mb-3" />
        <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">Please log in</h2>
        <Link href="/login" className="mt-4 text-[#81a308] hover:underline text-sm">Log in</Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center">
        <ShieldAlert className="w-12 h-12 text-red-400 mb-3" />
        <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">Access Denied</h2>
        <Link href="/" className="mt-4 text-[#81a308] hover:underline text-sm">Back to Home</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex justify-center items-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#81a308]" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">Ticket not found</h2>
        <Link href="/admin/support" className="mt-4 text-[#81a308] hover:underline text-sm">Back to Dashboard</Link>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIGS[ticket.status];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          href="/admin/support"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{ticket.subject}</h1>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                {statusConfig.label}
              </span>
              <span className="text-xs text-zinc-400">{CATEGORY_LABELS[ticket.category]}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${PRIORITY_COLORS[ticket.priority]}`}>
                {ticket.priority}
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{ticket.description}</p>
            <p className="text-[10px] text-zinc-400 mt-3">
              Created {new Date(ticket.createdAt).toLocaleString()} · Updated {new Date(ticket.updatedAt).toLocaleString()}
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="text-xs font-medium text-zinc-500 uppercase mb-3">User Info</h3>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
                  {ticket.user.avatarUrl ? (
                    <img src={ticket.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#81a308] to-emerald-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">@{ticket.user.username}</p>
                  <p className="text-xs text-zinc-400">{ticket.user.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="text-xs font-medium text-zinc-500 uppercase mb-3">Actions</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Status</label>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Priority</label>
                  <select
                    value={ticket.priority}
                    onChange={(e) => handlePriorityChange(e.target.value as TicketPriority)}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1 mb-4 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "messages"
                ? "border-[#81a308] text-[#81a308]"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Messages ({ticket.messages?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "notes"
                ? "border-[#81a308] text-[#81a308]"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <StickyNote className="w-4 h-4" />
            Internal Notes ({ticket.internalNotes?.length || 0})
          </button>
        </div>

        {activeTab === "messages" && (
          <>
            <div className="space-y-3 mb-4">
              {(!ticket.messages || ticket.messages.length === 0) ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm text-zinc-500">No messages yet</p>
                </div>
              ) : (
                ticket.messages.map((msg) => (
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
                            <span className="text-white text-[8px] font-bold">
                              {msg.sender.username[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-zinc-900 dark:text-white">
                        {msg.sender.username}
                        {msg.isAdminReply && <span className="ml-1 text-[#81a308]">(Staff)</span>}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{msg.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                <Send className="w-4 h-4 text-[#81a308]" />
                Quick Reply
              </h3>
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type your reply to the user..."
                rows={3}
                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 resize-none mb-3"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleReply}
                  disabled={replying || !replyContent.trim()}
                  className="bg-[#81a308] hover:bg-[#6c8a0a] text-white"
                >
                  {replying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                  Send Reply
                </Button>
              </div>
            </div>
          </>
        )}

        {activeTab === "notes" && (
          <>
            <div className="space-y-3 mb-4">
              {(!ticket.internalNotes || ticket.internalNotes.length === 0) ? (
                <div className="text-center py-8">
                  <StickyNote className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm text-zinc-500">No internal notes yet</p>
                </div>
              ) : (
                ticket.internalNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-medium text-zinc-900 dark:text-white">
                        {note.author.username}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{note.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-amber-400" />
                Add Internal Note
              </h3>
              <p className="text-xs text-zinc-500 mb-3">Internal notes are only visible to admin staff.</p>
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add an internal note..."
                rows={3}
                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 resize-none mb-3"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAddNote}
                  disabled={addingNote || !noteContent.trim()}
                  variant="outline"
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                >
                  {addingNote ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <StickyNote className="w-4 h-4 mr-2" />}
                  Add Note
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
