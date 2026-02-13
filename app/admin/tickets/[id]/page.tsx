"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
  MessageSquare,
  User,
  Mail,
  Tag,
} from "lucide-react";

const apiBase =
  process.env.NEXT_PUBLIC_FLORAL_VAULT_DEV_API_URL ||
  process.env.NEXT_PUBLIC_FLORAL_VAULT_API_URL ||
  "https://floral-vault-api.onrender.com";

function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

interface ReplyUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
}

interface TicketReply {
  id: string;
  ticketId: string;
  userId?: string | null;
  message: string;
  isStaff: boolean;
  senderName?: string | null;
  senderEmail?: string | null;
  source: string;
  user?: ReplyUser | null;
  createdAt: string;
}

interface TicketDetail {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  email: string;
  name: string;
  emailThreadId?: string | null;
  userId?: string | null;
  assignedToId?: string | null;
  user?: ReplyUser | null;
  assignedTo?: ReplyUser | null;
  replies: TicketReply[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
}

async function fetchTicketById(id: string): Promise<TicketDetail | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${apiBase}/api/support/admin/tickets/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json;
  } catch {
    return null;
  }
}

async function sendAdminReply(ticketId: string, message: string): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${apiBase}/api/support/admin/tickets/${ticketId}/reply`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function updateStatus(ticketId: string, status: string): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${apiBase}/api/support/admin/tickets/${ticketId}/status`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function updatePriority(ticketId: string, priority: string): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${apiBase}/api/support/admin/tickets/${ticketId}/priority`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ priority }),
    });
    return res.ok;
  } catch {
    return false;
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

export default function AdminTicketDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const ticketId = params?.id as string;

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [replying, setReplying] = useState(false);

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
    const ok = await sendAdminReply(ticket.id, replyContent);
    if (ok) {
      toast.success("Reply sent successfully");
      setReplyContent("");
      loadTicket();
    } else {
      toast.error("Failed to send reply");
    }
    setReplying(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket) return;
    const ok = await updateStatus(ticket.id, newStatus);
    if (ok) {
      toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
      loadTicket();
    } else {
      toast.error("Failed to update status");
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!ticket) return;
    const ok = await updatePriority(ticket.id, newPriority);
    if (ok) {
      toast.success(`Priority updated to ${newPriority}`);
      loadTicket();
    } else {
      toast.error("Failed to update priority");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-[#81a308]" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">Ticket not found</h2>
        <Link href="/admin/tickets" className="mt-4 text-[#81a308] hover:underline text-sm">
          Back to Tickets
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIGS[ticket.status] || STATUS_CONFIGS.OPEN;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link
        href="/admin/tickets"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Tickets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-zinc-400 font-mono">{ticket.ticketNumber}</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{ticket.subject}</h1>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
              {statusConfig.label}
            </span>
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {CATEGORY_LABELS[ticket.category] || ticket.category}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${PRIORITY_COLORS[ticket.priority] || ""}`}>
              {ticket.priority}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span>Created {new Date(ticket.createdAt).toLocaleString()}</span>
            <span>Updated {new Date(ticket.updatedAt).toLocaleString()}</span>
            {ticket.closedAt && <span>Closed {new Date(ticket.closedAt).toLocaleString()}</span>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <h3 className="text-xs font-medium text-zinc-500 uppercase mb-3">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    {ticket.user ? `@${ticket.user.username}` : ticket.name}
                  </p>
                  {ticket.user && (
                    <p className="text-xs text-zinc-400">
                      {ticket.user.firstName} {ticket.user.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-400" />
                <p className="text-xs text-zinc-400">{ticket.email}</p>
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
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Priority</label>
                <select
                  value={ticket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-[#81a308]" />
          Conversation ({ticket.replies?.length || 0})
        </h3>
      </div>

      <div className="space-y-3 mb-6">
        {(!ticket.replies || ticket.replies.length === 0) ? (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-500">No messages yet</p>
          </div>
        ) : (
          ticket.replies.map((reply) => (
            <div
              key={reply.id}
              className={`p-4 rounded-xl border ${
                reply.isStaff
                  ? "bg-[#81a308]/5 border-[#81a308]/20"
                  : "bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
                  {reply.user?.avatarUrl ? (
                    <img src={reply.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${
                      reply.isStaff
                        ? "bg-gradient-to-br from-[#81a308] to-emerald-600"
                        : "bg-gradient-to-br from-zinc-400 to-zinc-500"
                    }`}>
                      <span className="text-white text-[8px] font-bold">
                        {(reply.user?.username?.[0] || reply.senderName?.[0] || "?").toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-zinc-900 dark:text-white">
                  {reply.user?.username ? `@${reply.user.username}` : reply.senderName || reply.senderEmail}
                  {reply.isStaff && <span className="ml-1 text-[#81a308]">(Staff)</span>}
                </span>
                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                  {reply.source === "EMAIL" && <Mail className="w-2.5 h-2.5" />}
                  {new Date(reply.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{reply.message}</p>
            </div>
          ))
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
          <Send className="w-4 h-4 text-[#81a308]" />
          Reply to Customer
        </h3>
        <p className="text-xs text-zinc-500 mb-3">
          Your reply will be sent to {ticket.email} via email.
        </p>
        <Textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Type your reply..."
          rows={4}
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
    </div>
  );
}
