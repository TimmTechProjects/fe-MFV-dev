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

export interface CreateTicketInput {
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
}

export interface TicketsResponse {
  tickets: SupportTicket[];
  total: number;
  page: number;
  totalPages: number;
}
