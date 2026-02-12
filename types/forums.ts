// Forum Types for MFV Forums System

export interface ForumUser {
  id: string;
  username: string;
  avatarUrl: string;
  role?: 'admin' | 'moderator' | 'member';
  joinDate?: string;
  postCount?: number;
}

export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  threadCount: number;
  postCount: number;
  icon?: string;
  color?: string;
  lastPost?: {
    id: string;
    threadId: string;
    threadTitle: string;
    author: ForumUser;
    createdAt: string;
  };
}

export interface ForumThread {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  author: ForumUser;
  content: string; // Rich text HTML
  createdAt: string;
  updatedAt: string;
  views: number;
  replyCount: number;
  isSticky: boolean;
  isLocked: boolean;
  isPinned: boolean;
  tags?: string[];
  images?: string[];
  lastReply?: {
    id: string;
    author: ForumUser;
    createdAt: string;
  };
  subscribers?: string[]; // User IDs
}

export interface ForumReply {
  id: string;
  threadId: string;
  author: ForumUser;
  content: string; // Rich text HTML
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedByCurrentUser?: boolean;
  isEdited: boolean;
  editedAt?: string;
  quotedReply?: {
    id: string;
    author: ForumUser;
    content: string;
  };
}

export interface ForumActivity {
  id: string;
  type: 'new_thread' | 'new_reply' | 'thread_updated';
  thread: {
    id: string;
    title: string;
    categoryId: string;
    categoryName: string;
  };
  user: ForumUser;
  content?: string;
  createdAt: string;
}

export interface PopularThread {
  thread: ForumThread;
  score: number; // Calculated based on views, replies, and recency
}

export interface CreateThreadInput {
  title: string;
  categoryId: string;
  content: string;
  images?: File[];
  tags?: string[];
}

export interface CreateReplyInput {
  threadId: string;
  content: string;
  quotedReplyId?: string;
}

export interface ForumSearchResult {
  threads: ForumThread[];
  replies: ForumReply[];
  total: number;
}
