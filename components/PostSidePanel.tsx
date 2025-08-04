import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Share2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export type NestedComment = {
  id: number;
  user: {
    username: string;
    avatarUrl: string;
  };
  text: string;
  createdAt: string;
  likes?: number;
  likedByCurrentUser?: boolean;
  replies?: NestedComment[];
  depth?: number;
};

type Post = {
  text?: string;
  createdAt: string;
  upvotes?: number;
  comments?: NestedComment[];
  shares?: number;
  user: {
    username: string;
    avatarUrl: string;
  };
};

interface CommentProps {
  comment: NestedComment;
  onLikeComment: (commentId: number) => void;
  onReplyComment: (commentId: number, parentId?: number) => void;
  onSubmitReply: (commentId: number, text: string) => void;
  depth?: number;
  maxDepth?: number;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onLikeComment,
  onReplyComment,
  onSubmitReply,
  depth = 0,
  maxDepth = 5,
}) => {
  const [showReplies, setShowReplies] = useState(true);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onSubmitReply(comment.id, replyText);
      setReplyText("");
      setShowReplyBox(false);
    }
  };

  const handleReplyClick = () => {
    setShowReplyBox(!showReplyBox);
  };

  const indentWidth = Math.min(depth * 20, maxDepth * 20);

  return (
    <div className="relative">
      {/* Indent line for nested comments */}
      {depth > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 w-px bg-gray-600"
          style={{ left: `${indentWidth - 10}px` }}
        />
      )}

      <div className="mb-4" style={{ marginLeft: `${indentWidth}px` }}>
        {/* Comment header */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-6 h-6">
            <AvatarImage
              src={comment.user.avatarUrl}
              alt={comment.user.username}
            />
            <AvatarFallback className="text-xs">
              {comment.user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm text-white font-semibold">
            {comment.user.username}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Comment text */}
        <div className="text-gray-300 text-sm mb-2 pl-8">{comment.text}</div>

        {/* Comment actions */}
        <div className="flex items-center gap-4 pl-8">
          <button
            className={`text-xs font-semibold flex items-center gap-1 ${
              comment.likedByCurrentUser
                ? "text-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
            onClick={() => onLikeComment(comment.id)}
          >
            <Heart
              className="w-3 h-3"
              fill={comment.likedByCurrentUser ? "currentColor" : "none"}
            />
            {comment.likes || 0}
          </button>

          <button
            className="text-xs text-gray-400 hover:text-green-500 font-semibold"
            onClick={handleReplyClick}
          >
            Reply
          </button>

          {comment.replies && comment.replies.length > 0 && (
            <button
              className="text-xs text-gray-400 hover:text-blue-500 font-semibold flex items-center gap-1"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              {showReplies ? "Hide" : "Show"} {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>

        {/* Reply input box */}
        {showReplyBox && (
          <div className="mt-3 pl-8">
            <div className="bg-[#2c2f38] rounded-lg p-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-gray-400"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setShowReplyBox(false)}
                  className="px-3 py-1 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim()}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && showReplies && (
          <div className="mt-3">
            {comment.replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                onLikeComment={onLikeComment}
                onReplyComment={onReplyComment}
                onSubmitReply={onSubmitReply}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface PostSidePanelProps {
  post: Post | null;
  comments: NestedComment[];
  onLikeComment: (commentId: number) => void;
  onReplyComment?: (commentId: number, parentId?: number) => void;
  onSubmitReply: (commentId: number, text: string) => void;
}

export const PostSidePanel: React.FC<PostSidePanelProps> = ({
  post,
  comments,
  onLikeComment,
  onReplyComment,
  onSubmitReply,
}) => {
  const [newCommentText, setNewCommentText] = useState("");
  console.log(comments);

  const handleSubmitNewComment = () => {
    if (newCommentText.trim()) {
      // This would typically call a prop function to add a new top-level comment
      onSubmitReply(0, newCommentText); // Using 0 as a special ID for top-level comments
      setNewCommentText("");
    }
  };

  return (
    <div
      className="w-full md:w-[480px] flex flex-col bg-[#1a1d2d] h-full min-h-0 p-0 pt-14 overflow-y-auto border-l border-[#2c2f38] max-h-screen"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 md:px-6 pt-2 pb-4 border-b border-[#2c2f38]">
        <Avatar className="w-10 h-10">
          <AvatarImage src={post?.user.avatarUrl} alt={post?.user.username} />
          <AvatarFallback>
            {post?.user.username?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold text-white text-base md:text-lg">
            {post?.user.username}
          </h2>
          <p className="text-xs md:text-sm text-gray-400">
            {post?.createdAt
              ? new Date(post?.createdAt).toLocaleDateString()
              : ""}
          </p>
        </div>
      </div>

      {/* Post Content */}
      {post?.text && (
        <div className="text-white text-sm md:text-base px-4 md:px-6 pt-4 pb-2 leading-relaxed">
          {post?.text}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex gap-4 md:gap-6 px-4 md:px-6 py-4 border-b border-[#2c2f38]">
        <button className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition">
          <Heart className="w-5 h-5" />
          <span>{post?.upvotes || 0}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition">
          <MessageCircle className="w-5 h-5" />
          <span>{comments.length || 0}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition">
          <Share2 className="w-5 h-5" />
          <span>{post?.shares || 0}</span>
        </button>
      </div>

      {/* Add new comment */}
      <div className="px-4 md:px-6 py-4 border-b border-[#2c2f38]">
        <div className="bg-[#2c2f38] rounded-lg p-2 md:p-3">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-gray-400"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmitNewComment}
              disabled={!newCommentText.trim()}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 py-4">
        <h3 className="text-gray-300 text-sm md:text-base font-semibold mb-4">
          Comments ({comments.length})
        </h3>

        {comments.length ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onLikeComment={onLikeComment}
              onReplyComment={onReplyComment || (() => {})}
              onSubmitReply={onSubmitReply}
              depth={0}
            />
          ))
        ) : (
          <div className="text-gray-400 text-sm">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

// Demo component to show how it works
export default function Demo() {
  const [comments, setComments] = useState<NestedComment[]>([
    {
      id: 1,
      user: {
        username: "john_doe",
        avatarUrl: "https://i.pravatar.cc/150?u=john",
      },
      text: "This is a great post! Thanks for sharing.",
      createdAt: "2024-01-15T10:30:00Z",
      likes: 5,
      likedByCurrentUser: false,
      replies: [
        {
          id: 2,
          user: {
            username: "jane_smith",
            avatarUrl: "https://i.pravatar.cc/150?u=jane",
          },
          text: "I totally agree! This is very helpful.",
          createdAt: "2024-01-15T11:00:00Z",
          likes: 2,
          likedByCurrentUser: true,
          replies: [
            {
              id: 3,
              user: {
                username: "bob_wilson",
                avatarUrl: "https://i.pravatar.cc/150?u=bob",
              },
              text: "Same here! Great insights.",
              createdAt: "2024-01-15T11:15:00Z",
              likes: 1,
              likedByCurrentUser: false,
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      user: {
        username: "alice_cooper",
        avatarUrl: "https://i.pravatar.cc/150?u=alice",
      },
      text: "Could you explain more about this topic?",
      createdAt: "2024-01-15T12:00:00Z",
      likes: 3,
      likedByCurrentUser: false,
      replies: [],
    },
  ]);

  const samplePost: Post = {
    text: "Just discovered this amazing new technique for building nested comment systems! The key is to use recursive components and proper state management.",
    createdAt: "2024-01-15T09:00:00Z",
    upvotes: 24,
    shares: 8,
    user: {
      username: "tech_guru",
      avatarUrl: "https://i.pravatar.cc/150?u=guru",
    },
  };

  const handleLikeComment = (commentId: number) => {
    const updateCommentLike = (comments: NestedComment[]): NestedComment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likedByCurrentUser: !comment.likedByCurrentUser,
            likes: (comment.likes || 0) + (comment.likedByCurrentUser ? -1 : 1),
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateCommentLike(comment.replies),
          };
        }
        return comment;
      });
    };

    setComments(updateCommentLike(comments));
  };

  const handleSubmitReply = (parentId: number, text: string) => {
    const newComment: NestedComment = {
      id: Date.now(),
      user: {
        username: "current_user",
        avatarUrl: "https://i.pravatar.cc/150?u=current",
      },
      text: text,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedByCurrentUser: false,
      replies: [],
    };

    if (parentId === 0) {
      // Add as top-level comment
      setComments([newComment, ...comments]);
    } else {
      // Add as nested reply
      const addReplyToComment = (
        comments: NestedComment[]
      ): NestedComment[] => {
        return comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: addReplyToComment(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(addReplyToComment(comments));
    }
  };

  return (
    <div className="h-screen bg-[#0f1419]">
      <PostSidePanel
        post={samplePost}
        comments={comments}
        onLikeComment={handleLikeComment}
        onSubmitReply={handleSubmitReply}
      />
    </div>
  );
}
