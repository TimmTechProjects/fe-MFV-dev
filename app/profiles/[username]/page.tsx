"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams, useRouter } from "next/navigation";
import { User } from "@/types/users";
import { getUserByUsername, getUserCollections } from "@/lib/utils";
import Link from "next/link";
import {
  Plus,
  MessageCircle,
  Share2,
  MoreVertical,
  Heart,
  Home,
  Search,
  Mail,
  ShoppingCart,
  Settings,
  UserIcon,
  Calendar,
  MapPin,
  // Link,
  MoreHorizontal,
  Repeat2,
  Share,
  TrendingUp,
  Users,
  Bell,
  Bookmark,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { Collection } from "@/types/collections";
import { DUMMY_POSTS } from "@/mock/posts";
import { PostSidePanel, NestedComment } from "@/components/PostSidePanel";
import useAuth from "@/redux/hooks/useAuth";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";

const COVER_PHOTO =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";

type UserForPost = {
  username: string;
  avatarUrl: string;
};

type Comment = {
  id: number;
  user: UserForPost;
  text: string;
  createdAt: string;
};

type Post = {
  id: number;
  text?: string;
  image?: string;
  createdAt: string;
  upvotes?: number;
  comments?: Comment[];
  shares?: number;
  user: UserForPost;
};

const DEMO_COMMENTS: NestedComment[] = [
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
    replies: [],
  },
];

const ProfilePage = () => {
  const { user } = useAuth();
  const { username } = useParams();
  const router = useRouter();
  const safeUsername = Array.isArray(username) ? username[0] : username || "";

  const [usersCollections, setUsersCollections] = useState<Collection[]>([]);
  const [posts, setPosts] = useState(DUMMY_POSTS);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "posts" | "media" | "marketplace" | "collections"
  >("posts");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalComments, setModalComments] = useState<NestedComment[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.username === safeUsername) {
        setProfileUser(user);
      } else if (typeof safeUsername === "string") {
        const fetchedUser = await getUserByUsername(safeUsername);
        setProfileUser(fetchedUser);
      }
      setLoading(false);
    };

    const fetchCollections = async () => {
      if (safeUsername) {
        try {
          const collections = await getUserCollections(safeUsername);
          setUsersCollections(collections);
        } catch (err) {
          setUsersCollections([]);
          console.log(err);
        }
      }
    };

    fetchProfile();
    fetchCollections();
  }, [safeUsername, user]);

  const isOwnProfile = user?.username === safeUsername;

  const handleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, upvotes: (post.upvotes || 0) + 1 }
          : post
      )
    );
  };

  const handleOpenModal = (post: Post) => {
    setModalComments(DEMO_COMMENTS);
    setSelectedPost(post);
    setModalImage(post.image!);
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto flex">
          <div className="flex-1 flex items-center justify-center h-screen">
            <p>User not found</p>
          </div>
        </div>
      </div>
    );
  }

  const photoPosts: Post[] = posts.filter((p) => p.image);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto flex">
        {/* Left Sidebar - Navigation */}
        <aside className="w-64 flex-shrink-0 p-4 border-r border-gray-800 h-screen sticky top-0">
          <div className="space-y-2">
            <nav className="space-y-1">
              <NavItem icon={<Home />} label="Home" />
              <NavItem icon={<Search />} label="Explore" />
              <NavItem icon={<Bell />} label="Notifications" />
              <NavItem icon={<Mail />} label="Messages" />
              <NavItem icon={<Bookmark />} label="Bookmarks" />
              <NavItem icon={<UserIcon />} label="Profile" active={true} />
              <NavItem icon={<ShoppingCart />} label="Marketplace" href="/marketplace" />
            </nav>

            <button className="w-full bg-[#81a308] text-black font-bold py-3 px-6 rounded-full mt-8 transition-colors">
              New Post
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 border-r border-gray-800">
          {/* Header with Cover Photo */}
          <div className="relative">
            {/* Cover Photo */}
            <div className="h-48 bg-gray-800 overflow-hidden">
              <img
                src={COVER_PHOTO}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Info Section */}
            <div className="px-4 pb-4">
              <div className="flex justify-between items-start -mt-16 mb-4">
                <Avatar className="w-32 h-32 border-4 border-black">
                  <AvatarImage
                    src={profileUser?.avatarUrl}
                    alt={profileUser?.username}
                  />
                  <AvatarFallback className="bg-[#81a308] text-black text-2xl">
                    {profileUser?.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {isOwnProfile ? (
                  <button className="mt-16 px-4 py-2 border border-gray-600 text-white font-bold rounded-full hover:bg-gray-900 transition-colors">
                    Edit profile
                  </button>
                ) : (
                  <div className="flex gap-2 mt-16">
                    <button className="p-2 border border-gray-600 rounded-full hover:bg-gray-900 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    <button className="px-4 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                      Follow
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <h1 className="text-2xl font-bold text-white">
                  {profileUser.firstName && profileUser.lastName
                    ? `${profileUser.firstName} ${profileUser.lastName}`
                    : profileUser.username}
                </h1>
                <p className="text-gray-400">@{profileUser.username}</p>
              </div>

              {profileUser.bio && (
                <p className="text-white mb-3">{profileUser.bio}</p>
              )}

              <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined{" "}
                    {profileUser?.joinedAt
                      ? new Date(profileUser.joinedAt).toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" }
                        )
                      : "Unknown"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 text-sm">
                <span className="hover:underline cursor-pointer">
                  <strong className="text-white">
                    {usersCollections.length}
                  </strong>{" "}
                  <span className="text-gray-400">Collections</span>
                </span>
                <span className="hover:underline cursor-pointer">
                  <strong className="text-white">{posts.length}</strong>{" "}
                  <span className="text-gray-400">Posts</span>
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-800">
              <div className="flex">
                {[
                  { key: "posts", label: "Posts" },
                  { key: "media", label: "Media" },
                  { key: "collections", label: "Collections" },
                  { key: "marketplace", label: "Marketplace" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-6 py-4 text-sm font-medium transition-colors relative hover:bg-gray-900/50 ${
                      activeTab === tab.key
                        ? "text-white"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#81a308]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="divide-y divide-gray-800">
            {/* Posts Tab */}
            {activeTab === "posts" && (
              <>
                {isOwnProfile && (
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={profileUser.avatarUrl}
                          alt={profileUser.username}
                        />
                        <AvatarFallback className="bg-[#81a308] text-black">
                          {profileUser.username?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="What's happening with your plants?"
                          className="w-full bg-transparent text-xl placeholder-gray-500 border-none outline-none resize-none text-white"
                        />
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center space-x-4 text-[#81a308]">
                            <ImageIcon className="w-5 h-5 cursor-pointer hover:bg-gray-900 p-0.5 rounded" />
                          </div>
                          <button className="bg-[#81a308] text-black font-bold py-2 px-6 rounded-full disabled:opacity-50">
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {posts.map((post) => (
                  <PlantPost
                    key={post.id}
                    post={post}
                    profileUser={profileUser}
                    onLike={handleLike}
                    onOpenModal={handleOpenModal}
                    timeAgo={timeAgo}
                  />
                ))}
              </>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <div className="p-4">
                {photoPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                      No photos or videos
                    </h3>
                    <p className="text-gray-500">
                      When you share photos or videos, they will show up here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {photoPosts.map((post) => (
                      <div
                        key={post.id}
                        className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => setModalImage(post.image!)}
                      >
                        <img
                          src={post.image}
                          alt="Media"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Collections Tab */}
            {activeTab === "collections" && (
              <div className="p-4">
                {usersCollections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">📚</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                      No collections yet
                    </h3>
                    <p className="text-gray-500">
                      Collections will appear here when created.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {usersCollections.map((collection) => (
                      <Link
                        key={collection.id}
                        href={`/profiles/${profileUser.username}/collections/${collection.slug}`}
                        className="block bg-gray-900 rounded-2xl p-4 hover:bg-gray-800 transition-colors"
                      >
                        <div className="relative w-full h-32 mb-3 rounded-xl overflow-hidden">
                          <img
                            src={
                              collection.thumbnailImage?.url ||
                              "/api/placeholder/200/128"
                            }
                            alt={collection.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-semibold text-white mb-1">
                          {collection.name}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {collection.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Marketplace Tab */}
            {activeTab === "marketplace" && (
              <div className="p-4">
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No marketplace items
                  </h3>
                  <p className="text-gray-500">
                    Items for sale will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 p-4 space-y-4">
          {/* Search */}
          <div className="bg-gray-900 rounded-full p-3 flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search plants, people..."
              className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
            />
          </div>

          {/* Who to follow */}
          {!isOwnProfile && (
            <div className="bg-gray-900 rounded-2xl p-4">
              <h2 className="text-xl font-bold mb-3">Who to follow</h2>
              <div className="space-y-3">
                <SuggestedUser
                  username="plant_lover"
                  name="Plant Lover"
                  avatar="https://i.pravatar.cc/150?u=plant1"
                />
                <SuggestedUser
                  username="garden_guru"
                  name="Garden Guru"
                  avatar="https://i.pravatar.cc/150?u=garden1"
                />
              </div>
            </div>
          )}

          {/* What's happening */}
          <div className="bg-gray-900 rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-3">What's happening</h2>
            <div className="space-y-3">
              <TrendingItem
                category="Trending in Plants"
                title="#MonsteraMonday"
                posts="12.5K posts"
              />
              <TrendingItem
                category="Plant Care"
                title="Watering schedules"
                posts="8,432 posts"
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex bg-black"
          onClick={() => {
            setModalImage(null);
            setSelectedPost(null);
          }}
        >
          <div className="relative flex w-full h-full">
            <div
              className="flex-1 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modalImage}
                alt="Full size"
                className="object-contain max-h-full max-w-full"
              />
            </div>
            <button
              className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition"
              onClick={() => {
                setModalImage(null);
                setSelectedPost(null);
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Navigation Item Component
function NavItem({
  icon,
  label,
  active = false,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
}) {
  return (
    <Link
      href={href || "#"}
      className={`flex items-center space-x-3 p-3 rounded-full hover:bg-gray-900 transition-colors text-xl w-full text-left ${
        active ? "font-bold" : "font-normal"
      }`}
    >
      <span className="w-6 h-6">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

// Plant Post Component (adapted from vault)
function PlantPost({
  post,
  profileUser,
  onLike,
  onOpenModal,
  timeAgo,
}: {
  post: Post;
  profileUser: User;
  onLike: (id: number) => void;
  onOpenModal: (post: Post) => void;
  timeAgo: (date: string) => string;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.upvotes || 0);
  const [retweeted, setRetweeted] = useState(false);
  const [retweetCount, setRetweetCount] = useState(
    Math.floor(Math.random() * 10) + 1
  );

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    onLike(post.id);
  };

  const handleRetweet = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRetweeted(!retweeted);
    setRetweetCount((prev) => (retweeted ? prev - 1 : prev + 1));
  };

  return (
    <article className="p-4 hover:bg-gray-950/30 transition-colors cursor-pointer">
      <div className="flex space-x-3">
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarImage
            src={profileUser.avatarUrl}
            alt={profileUser.username}
          />
          <AvatarFallback className="bg-[#81a308] text-black">
            {profileUser.username?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 mb-1">
            <span className="font-bold text-white hover:underline">
              {profileUser.firstName && profileUser.lastName
                ? `${profileUser.firstName} ${profileUser.lastName}`
                : profileUser.username}
            </span>
            <span className="text-gray-400 text-sm">
              @{profileUser.username}
            </span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-400 text-sm">
              {timeAgo(post.createdAt)}
            </span>
            <div className="ml-auto">
              <button className="p-1 hover:bg-gray-800 rounded-full">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {post.text && (
            <div className="text-white leading-relaxed mb-3">{post.text}</div>
          )}

          {post.image && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-gray-700">
              <img
                src={post.image}
                alt="Post media"
                className="w-full max-h-96 object-cover cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(post);
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between max-w-md">
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-blue-900/20 transition-colors group"
            >
              <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
              <span className="text-sm text-gray-400 group-hover:text-blue-400">
                {post.comments?.length || 0}
              </span>
            </button>

            <button
              onClick={handleRetweet}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-green-900/20 transition-colors group"
            >
              <Repeat2
                className={`w-5 h-5 transition-colors ${
                  retweeted
                    ? "text-green-500"
                    : "text-gray-400 group-hover:text-green-400"
                }`}
              />
              <span
                className={`text-sm transition-colors ${
                  retweeted
                    ? "text-green-500"
                    : "text-gray-400 group-hover:text-green-400"
                }`}
              >
                {retweetCount}
              </span>
            </button>

            <button
              onClick={handleLike}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-red-900/20 transition-colors group"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  liked
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400 group-hover:text-red-400"
                }`}
              />
              <span
                className={`text-sm transition-colors ${
                  liked
                    ? "text-red-500"
                    : "text-gray-400 group-hover:text-red-400"
                }`}
              >
                {likeCount}
              </span>
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-900 transition-colors group"
            >
              <Share className="w-5 h-5 text-gray-400 group-hover:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// Suggested User Component
function SuggestedUser({
  username,
  name,
  avatar,
}: {
  username: string;
  name: string;
  avatar: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold text-white text-sm">{name}</p>
          <p className="text-gray-400 text-sm">@{username}</p>
        </div>
      </div>
      <button className="bg-white text-black px-4 py-1 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
        Follow
      </button>
    </div>
  );
}

// Trending Item Component
function TrendingItem({
  category,
  title,
  posts,
}: {
  category: string;
  title: string;
  posts: string;
}) {
  return (
    <div className="hover:bg-gray-800/50 p-2 rounded cursor-pointer">
      <p className="text-gray-500 text-sm">{category}</p>
      <p className="font-bold text-white">{title}</p>
      <p className="text-gray-500 text-sm">{posts}</p>
    </div>
  );
}

export default ProfilePage;
