// @ts-nocheck
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2 } from "lucide-react";

type User = {
  username: string;
  avatarUrl: string;
};

type ModalComment = {
  id: number;
  user: User;
  text: string;
  createdAt: string;
  likes?: number;
  likedByCurrentUser?: boolean;
};

type Post = {
  text?: string;
  createdAt: string;
  upvotes?: number;
  comments?: ModalComment[];
  shares?: number;
  user: User;
};

interface PostSidePanelProps {
  post: Post | null;
  comments: ModalComment[];
  onLikeComment: (commentId: number) => void;
  onReplyComment?: (commentId: number) => void;
}

export const PostSidePanel: React.FC<PostSidePanelProps> = ({
  post,
  comments,
  onLikeComment,
  onReplyComment,
}) => {
  return (
    <div
      className="w-full md:w-[480px] flex flex-col bg-[#1a1d2d] h-full p-0 pt-14 overflow-y-auto border-l border-[#2c2f38]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-2 pb-4 border-b border-[#2c2f38]">
        <Avatar className="w-10 h-10">
          <AvatarImage src={post?.user.avatarUrl} alt={post?.user.username} />
          <AvatarFallback>
            {post?.user.username?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold text-white text-base">
            {post?.user.username}
          </h2>
          <p className="text-xs text-gray-400">
            {post?.createdAt
              ? new Date(post?.createdAt).toLocaleDateString()
              : ""}
          </p>
        </div>
      </div>

      {/* Post Content */}
      {post?.text && (
        <div className="text-white text-sm px-6 pt-4 pb-2 leading-relaxed">
          {post?.text}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex gap-6 px-6 py-4 border-b border-[#2c2f38]">
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

      {/* Comments */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <h3 className="text-gray-300 text-sm font-semibold mb-4">Comments</h3>

        {comments.length ? (
          comments.map((comment) => (
            <div key={comment.id} className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="w-7 h-7">
                  <AvatarImage
                    src={comment.user.avatarUrl}
                    alt={comment.user.username}
                  />
                  <AvatarFallback>
                    {comment.user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm text-white font-semibold">
                  {comment.user.username}
                </div>
                <div className="text-xs text-gray-500 ml-auto">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="ml-9 text-gray-300 text-sm">{comment.text}</div>
              <div className="ml-9 mt-2 flex items-center gap-4">
                <button
                  className={`text-xs font-semibold ${
                    comment.likedByCurrentUser
                      ? "text-green-500"
                      : "text-gray-400 hover:text-green-500"
                  }`}
                  onClick={() => onLikeComment(comment.id)}
                >
                  <Heart className="inline w-4 h-4 mr-1" />
                  {comment.likes || 0} Like
                </button>
                {onReplyComment && (
                  <button
                    className="text-xs text-gray-400 hover:text-green-500 font-semibold"
                    onClick={() => onReplyComment(comment.id)}
                  >
                    Reply
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm">No comments yet.</div>
        )}
      </div>
    </div>
  );
};
