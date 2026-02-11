"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { User } from "@/types/users";
import { getUserByUsername, getUserCollections, getUserPlants } from "@/lib/utils";
import Link from "next/link";
import {
  Plus,
  MessageCircle,
  Heart,
  Home,
  Search,
  Mail,
  ShoppingCart,
  Settings,
  UserIcon,
  Calendar,
  MapPin,
  Users,
  Bell,
  Bookmark,
  Leaf,
  Sprout,
  TreeDeciduous,
  Flower2,
  Grid3X3,
  LayoutList,
  ExternalLink,
  Camera,
} from "lucide-react";
import Image from "next/image";
import { Collection } from "@/types/collections";
import { Plant } from "@/types/plants";
import useAuth from "@/redux/hooks/useAuth";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import {
  BotanicalCard,
  BotanicalButton,
  BotanicalStat,
  BotanicalEmptyState,
  LeafIcon,
  SproutIcon,
  LeafDecoration,
} from "@/components/ui/botanical";

// Garden-themed cover images for variety
const GARDEN_COVERS = [
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1477554193778-9562c28588c0?auto=format&fit=crop&w=1200&q=80",
];

const ProfilePage= () => {
  const { user } = useAuth();
  const { username } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const safeUsername = Array.isArray(username) ? username[0] : username || "";

  // Read initial section from URL param
  const sectionParam = searchParams.get("section");
  const initialSection = (["garden", "collections", "posts", "marketplace"].includes(sectionParam || "") 
    ? sectionParam 
    : "garden") as "garden" | "collections" | "posts" | "marketplace";

  const [usersCollections, setUsersCollections] = useState<Collection[]>([]);
  const [gardenPlants, setGardenPlants] = useState<Plant[]>([]);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<
    "garden" | "collections" | "posts" | "marketplace"
  >(initialSection);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Update active section when URL param changes (e.g., back navigation)
  useEffect(() => {
    if (sectionParam && ["garden", "collections", "posts", "marketplace"].includes(sectionParam)) {
      setActiveSection(sectionParam as typeof activeSection);
    }
  }, [sectionParam]);

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

  useEffect(() => {
    const fetchGarden = async () => {
      if (safeUsername) {
        try {
          const plants = await getUserPlants(safeUsername);
          setGardenPlants(plants);
        } catch (err) {
          setGardenPlants([]);
          console.log(err);
        }
      }
    };
    fetchGarden();
  }, [safeUsername]);

  const isOwnProfile = user?.username === safeUsername;

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen botanical-gradient botanical-pattern flex items-center justify-center">
        <BotanicalEmptyState
          icon={<Sprout className="w-10 h-10 text-[var(--botanical-sage)]" />}
          title="Garden not found"
          description="This garden doesn't exist or has been moved."
          action={
            <BotanicalButton onClick={() => router.push("/")}>
              Return Home
            </BotanicalButton>
          }
        />
      </div>
    );
  }

  const coverImage = GARDEN_COVERS[Math.floor(Math.random() * GARDEN_COVERS.length)];

  return (
    <div className="min-h-screen botanical-gradient botanical-pattern">
      <div className="max-w-7xl mx-auto">
        {/* Garden Header - Botanical Mosaic Style */}
        <header className="relative garden-header rounded-b-3xl overflow-hidden">
          {/* Cover Image with Dark Overlay */}
          <div className="relative h-64 md:h-80 group/banner">
            <img
              src={coverImage}
              alt="Garden cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(9,9,11,0.4)] to-[#18181b]" />
            
            {/* Banner edit overlay (own profile only) */}
            {isOwnProfile && (
              <div className="absolute bottom-4 right-4 opacity-0 group-hover/banner:opacity-100 transition-opacity duration-200 z-[5]">
                <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full border border-emerald-500/40 shadow-sm">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  <span className="text-white text-sm font-medium">Edit Cover Image</span>
                </div>
              </div>
            )}

            {/* Decorative leaf patterns */}
            <div className="absolute top-4 left-4 opacity-20">
              <LeafIcon className="w-16 h-16 text-[var(--botanical-sage)] animate-sway" />
            </div>
            <div className="absolute top-8 right-8 opacity-15">
              <Flower2 className="w-12 h-12 text-[var(--botanical-sage)]" />
            </div>
          </div>

          {/* Profile Info Overlay */}
          <div className="relative px-6 pb-6 -mt-20 z-10">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Avatar */}
              <div className="relative group/avatar cursor-pointer">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-[var(--botanical-forest)] shadow-xl">
                  <AvatarImage
                    src={profileUser?.avatarUrl}
                    alt={profileUser?.username}
                  />
                  <AvatarFallback className="bg-[var(--botanical-sage)] text-[var(--botanical-forest)] text-3xl font-bold">
                    {profileUser?.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                  {/* Profile picture edit overlay (own profile only) */}
                  {isOwnProfile && (
                    <>
                      {/* Bottom wave overlay */}
                      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[115%] h-[48%] rounded-b-full bg-emerald-600/35 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200" />
                      {/* Camera pill on right */}
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200">
                        <div className="px-2.5 py-1 rounded-full bg-black/60 border border-emerald-500/40 text-white text-xs flex items-center gap-1 shadow-sm">
                          <Camera className="w-4 h-4 text-emerald-400" />
                          <span>Edit</span>
                        </div>
                      </div>
                    </>
                  )}
                {/* Online indicator */}
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-[var(--botanical-sage)] border-2 border-[var(--botanical-forest)] rounded-full" />
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[var(--botanical-cream)]">
                      {profileUser.firstName && profileUser.lastName
                        ? `${profileUser.firstName} ${profileUser.lastName}`
                        : profileUser.username}
                    </h1>
                    <p className="text-[var(--botanical-sage)] flex items-center gap-2">
                      <Sprout className="w-4 h-4" />
                      @{profileUser.username}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 md:ml-auto">
                    {isOwnProfile ? (
                      <BotanicalButton variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                        Edit Profile
                      </BotanicalButton>
                    ) : (
                      <>
                        <BotanicalButton variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4" />
                          Message
                        </BotanicalButton>
                        <BotanicalButton size="sm">
                          <Users className="w-4 h-4" />
                          Follow
                        </BotanicalButton>
                      </>
                    )}
                  </div>
                </div>

                {profileUser.bio && (
                  <p className="text-[var(--botanical-cream)] text-opacity-90 max-w-2xl">
                    {profileUser.bio}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined{" "}
                    {profileUser?.joinedAt
                      ? new Date(profileUser.joinedAt).toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" }
                        )
                      : "Unknown"}
                  </span>
                  <span className="flex items-center gap-1">
                      <TreeDeciduous className="w-4 h-4" />
                      {usersCollections.length} Albums
                  </span>
                  <span className="flex items-center gap-1">
                    <Leaf className="w-4 h-4" />
                    {gardenPlants.length} Plants documented
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <BotanicalStat
                value={usersCollections.length}
                label="Albums"
                icon={TreeDeciduous}
              />
              <BotanicalStat
                value={gardenPlants.length}
                label="Plants"
                icon={Leaf}
              />
              <BotanicalStat
                value="1.2K"
                label="Followers"
                icon={Users}
              />
              <BotanicalStat
                value="342"
                label="Following"
                icon={Heart}
              />
            </div>
          </div>
        </header>

        {/* Main Content Area - Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 p-6">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1 sticky top-6">
              <SidebarNavItem
                icon={<Sprout className="w-5 h-5" />}
                label="My Garden"
                active={activeSection === "garden"}
                onClick={() => setActiveSection("garden")}
              />
              <SidebarNavItem
                icon={<TreeDeciduous className="w-5 h-5" />}
                label={isOwnProfile ? "My Albums" : "Albums"}
                active={activeSection === "collections"}
                onClick={() => setActiveSection("collections")}
                badge={usersCollections.length}
              />
              <SidebarNavItem
                icon={<LayoutList className="w-5 h-5" />}
                label="Posts"
                active={activeSection === "posts"}
                onClick={() => setActiveSection("posts")}
              />
              <SidebarNavItem
                icon={<ShoppingCart className="w-5 h-5" />}
                label="Marketplace"
                active={activeSection === "marketplace"}
                onClick={() => setActiveSection("marketplace")}
              />

              {/* Quick Actions */}
              {isOwnProfile && (
                <div className="pt-6 space-y-2">
                  <p className="text-xs uppercase tracking-wider text-zinc-500 px-3">
                    Quick Actions
                  </p>
                  <Link
                    href={`/profiles/${profileUser.username}/collections/new`}
                    className="botanical-nav-item w-full text-left"
                  >
                    <Plus className="w-5 h-5" />
                    <span>New Album</span>
                  </Link>
                </div>
              )}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Garden Section - Card Grid */}
            {activeSection === "garden" && (
              <section className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <Sprout className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-100">
                        {isOwnProfile ? "My Garden" : `${profileUser.username}'s Garden`}
                      </h2>
                      <p className="text-sm text-zinc-400">
                        All plants across collections
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "grid"
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "text-zinc-500 hover:text-emerald-500"
                      }`}
                    >
                      <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "list"
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "text-zinc-500 hover:text-emerald-500"
                      }`}
                    >
                      <LayoutList className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {gardenPlants.length === 0 ? (
                  <BotanicalEmptyState
                    icon={<Sprout className="w-10 h-10 text-[var(--botanical-sage)]" />}
                    title="No plants yet"
                    description="Start documenting your botanical journey by adding your first plant."
                    action={
                      isOwnProfile && usersCollections.length > 0 ? (
                        <BotanicalButton
                          onClick={() =>
                            router.push(
                              `/profiles/${profileUser.username}/collections/${usersCollections[0].slug}/new`
                            )
                          }
                        >
                          <Plus className="w-4 h-4" />
                          Add First Plant
                        </BotanicalButton>
                      ) : isOwnProfile ? (
                        <BotanicalButton
                          onClick={() =>
                            router.push(`/profiles/${profileUser.username}/collections/new`)
                          }
                        >
                          <Plus className="w-4 h-4" />
                          Create Album First
                        </BotanicalButton>
                      ) : null
                    }
                  />
                ) : viewMode === "grid" ? (
                  <div className="plant-grid">
                    {gardenPlants.map((plant, index) => (
                      <GardenPlantCard
                        key={plant.id}
                        plant={plant}
                        profileUser={profileUser}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {gardenPlants.map((plant) => (
                      <GardenPlantListItem
                        key={plant.id}
                        plant={plant}
                        profileUser={profileUser}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Collections Section - Garden Beds */}
            {activeSection === "collections" && (
              <section className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <TreeDeciduous className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-100">
                        Albums
                      </h2>
                      <p className="text-sm text-zinc-400">
                        Organized plant albums
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link href={`/profiles/${profileUser.username}/collections`}>
                      <BotanicalButton variant="outline" size="sm">
                        View All
                      </BotanicalButton>
                    </Link>
                    {isOwnProfile && (
                      <BotanicalButton
                        onClick={() =>
                          router.push(`/profiles/${profileUser.username}/collections/new`)
                        }
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                        New Album
                      </BotanicalButton>
                    )}
                  </div>
                </div>

                {usersCollections.length === 0 ? (
                  <BotanicalEmptyState
                    icon={<TreeDeciduous className="w-10 h-10 text-[var(--botanical-sage)]" />}
                    title="No garden beds yet"
                    description="Create albums to organize your plants into themed garden beds."
                    action={
                      isOwnProfile && (
                        <BotanicalButton
                          onClick={() =>
                            router.push(`/profiles/${profileUser.username}/collections/new`)
                          }
                        >
                          <Plus className="w-4 h-4" />
                          Create First Bed
                        </BotanicalButton>
                      )
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {usersCollections.map((collection) => (
                      <CollectionBedCard
                        key={collection.id}
                        collection={collection}
                        username={profileUser.username}
                      />
                    ))}
                    {/* Add New Collection Card */}
                    {isOwnProfile && (
                      <Link
                        href={`/profiles/${profileUser.username}/collections/new`}
                        className="collection-bed group cursor-pointer flex items-center justify-center min-h-[200px] hover:border-emerald-500/40 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center gap-3 text-zinc-400 group-hover:text-emerald-500 transition-colors">
                          <div className="flex items-center justify-center w-16 h-16 border-2 border-zinc-600 rounded-full group-hover:border-emerald-500 transition-colors">
                            <Plus className="w-8 h-8" />
                          </div>
                          <span className="text-sm font-medium">Add New Album</span>
                        </div>
                      </Link>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* Posts Section */}
            {activeSection === "posts" && (
              <section className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <LayoutList className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-100">
                      Garden Journal
                    </h2>
                    <p className="text-sm text-zinc-400">
                      Updates and stories from the garden
                    </p>
                  </div>
                </div>

                <BotanicalEmptyState
                  icon={<LayoutList className="w-10 h-10 text-[var(--botanical-sage)]" />}
                  title="No posts yet"
                  description="Garden journal posts and updates will appear here soon."
                />
              </section>
            )}

            {/* Marketplace Section */}
            {activeSection === "marketplace" && (
              <section className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <ShoppingCart className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-100">
                      Plant Market
                    </h2>
                    <p className="text-sm text-zinc-400">
                      Plants and cuttings for sale or trade
                    </p>
                  </div>
                </div>

                <BotanicalEmptyState
                  icon={<ShoppingCart className="w-10 h-10 text-[var(--botanical-sage)]" />}
                  title="No listings yet"
                  description="Plants and cuttings for sale or trade will appear here."
                  action={
                    isOwnProfile && (
                      <BotanicalButton onClick={() => router.push("/marketplace")}>
                        <ExternalLink className="w-4 h-4" />
                        Visit Marketplace
                      </BotanicalButton>
                    )
                  }
                />
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Sidebar Navigation Item
function SidebarNavItem({
  icon,
  label,
  active = false,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`botanical-nav-item w-full text-left ${active ? "active" : ""}`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/15 text-emerald-500">
          {badge}
        </span>
      )}
    </button>
  );
}

function GardenPlantCard({
  plant,
  profileUser,
  index,
}: {
  plant: Plant;
  profileUser: User;
  index: number;
}) {
  const mainImage = plant.images?.find((img) => img.isMain) || plant.images?.[0];

  return (
    <Link href={`/plants/${plant.slug}`}>
      <BotanicalCard
        className="overflow-hidden group cursor-pointer"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={plant.commonName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800">
              <Leaf className="w-10 h-10 text-zinc-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
        </div>

        <div className="p-4">
          <h3 className="text-zinc-100 font-medium text-sm mb-1 line-clamp-1">
            {plant.commonName}
          </h3>
          <p className="text-zinc-500 text-xs italic line-clamp-1">
            {plant.botanicalName}
          </p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={profileUser.avatarUrl} alt={profileUser.username} />
                <AvatarFallback className="bg-emerald-600 text-white text-xs">
                  {profileUser.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-zinc-400">
                @{profileUser.username}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-zinc-500">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {plant.likes ?? 0}
              </span>
            </div>
          </div>
        </div>
      </BotanicalCard>
    </Link>
  );
}

function GardenPlantListItem({
  plant,
  profileUser,
}: {
  plant: Plant;
  profileUser: User;
}) {
  const mainImage = plant.images?.find((img) => img.isMain) || plant.images?.[0];

  return (
    <Link href={`/plants/${plant.slug}`}>
      <BotanicalCard className="flex gap-4 p-4">
        {mainImage ? (
          <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={mainImage.url}
              alt={plant.commonName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-zinc-800">
            <Leaf className="w-8 h-8 text-zinc-600" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={profileUser.avatarUrl} alt={profileUser.username} />
              <AvatarFallback className="bg-emerald-600 text-white text-xs">
                {profileUser.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-emerald-500">
              @{profileUser.username}
            </span>
          </div>
          <h3 className="text-zinc-100 font-medium mb-1">{plant.commonName}</h3>
          <p className="text-zinc-500 text-sm italic mb-2">{plant.botanicalName}</p>
          {plant.family && (
            <span className="text-xs text-zinc-400">Family: {plant.family}</span>
          )}
        </div>
      </BotanicalCard>
    </Link>
  );
}

// Collection Bed Card Component
function CollectionBedCard({
  collection,
  username,
}: {
  collection: Collection;
  username: string;
}) {
  return (
    <Link
      href={`/profiles/${username}/collections/${collection.slug}`}
      className="collection-bed group cursor-pointer relative overflow-hidden"
    >
      <LeafDecoration position="top-right" size="lg" />
      
      {/* Cover Image */}
      <div className="relative h-40 rounded-xl overflow-hidden mb-4">
        <img
          src={collection.thumbnailImage?.url || "/api/placeholder/400/200"}
          alt={collection.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-emerald-500 transition-colors">
            {collection.name}
          </h3>
          <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/15 text-emerald-500">
            {collection.plants?.length || 0} plants
          </span>
        </div>
        
        {collection.description && (
          <p className="text-sm text-zinc-400 line-clamp-2">
            {collection.description}
          </p>
        )}
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  );
}

export default ProfilePage;
