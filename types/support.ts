export type TicketCategory = "bug" | "feature" | "account" | "payment" | "other";
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  user: {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
  };
  messages: TicketMessage[];
  internalNotes?: InternalNote[];
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessage {
  id: string;
  content: string;
  isAdminReply: boolean;
  sender: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

export interface InternalNote {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
  };
  createdAt: string;
}

export interface CreateTicketInput {
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
}

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  category: TicketCategory;
  message: string;
}

export interface TicketsResponse {
  tickets: SupportTicket[];
  total: number;
  page: number;
  totalPages: number;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  avgResponseTime?: string;
}
