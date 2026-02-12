export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  threadCount: number;
  postCount: number;
  lastActivity?: string;
}

export interface ForumThreadAuthor {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  category: string;
  categorySlug?: string;
  author: ForumThreadAuthor;
  upvotes: number;
  downvotes: number;
  userVote?: "up" | "down" | null;
  replyCount: number;
  viewCount: number;
  isPinned: boolean;
  isLocked: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ForumReply {
  id: string;
  threadId: string;
  parentId?: string | null;
  content: string;
  author: ForumThreadAuthor;
  upvotes: number;
  downvotes: number;
  userVote?: "up" | "down" | null;
  replies?: ForumReply[];
  isAccepted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateThreadInput {
  title: string;
  content: string;
  category: string;
  tags?: string[];
}

export interface ThreadsResponse {
  threads: ForumThread[];
  total: number;
  page: number;
  totalPages: number;
}

export interface RepliesResponse {
  replies: ForumReply[];
  total: number;
  page: number;
  totalPages: number;
}

export type ThreadSortOption = "hot" | "new" | "top" | "controversial";
