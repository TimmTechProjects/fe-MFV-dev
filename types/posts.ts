export type PostPrivacy = "public" | "followers" | "private";

export interface PostAuthor {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface PostImage {
  id: string;
  url: string;
}

export interface PostComment {
  id: string;
  postId: string;
  parentId?: string | null;
  content: string;
  author: PostAuthor;
  likes: number;
  liked?: boolean;
  replies?: PostComment[];
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  content: string;
  images: PostImage[];
  linkUrl?: string;
  privacy: PostPrivacy;
  author: PostAuthor;
  likes: number;
  liked?: boolean;
  commentCount: number;
  shareCount: number;
  saved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  content: string;
  images?: string[];
  linkUrl?: string;
  privacy: PostPrivacy;
}

export interface UpdatePostInput {
  content?: string;
  privacy?: PostPrivacy;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CommentsResponse {
  comments: PostComment[];
  total: number;
  page: number;
  totalPages: number;
}
