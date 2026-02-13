"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { User } from "@/types/users";
import { getUserByUsername, getUserCollections, getUserPlants, getUserMarketplaceListings } from "@/lib/utils";
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
  Lock,
  Crown,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Collection } from "@/types/collections";
import { Plant } from "@/types/plants";
import useAuth from "@/redux/hooks/useAuth";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import ProfileImageUploadModal from "@/components/ProfileImageUploadModal";
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
    : "posts") as "garden" | "collections" | "posts" | "marketplace";

  const [usersCollections, setUsersCollections] = useState<Collection[]>([]);
  const [gardenPlants, setGardenPlants] = useState<Plant[]>([]);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<
    "garden" | "collections" | "posts" | "marketplace"
  >(initialSection);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);
  const [isBannerImageModalOpen, setIsBannerImageModalOpen] = useState(false);

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
      <div className="min-h-screen botanical-gradient-auto botanical-pattern flex items-center justify-center">
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
    <div className="min-h-screen botanical-gradient-auto botanical-pattern">
      <div className="max-w-7xl mx-auto">
        {/* Garden Header - Botanical Mosaic Style */}
        <header className="relative garden-header rounded-b-3xl overflow-hidden">
          {/* Cover Image with Dark Overlay */}
          <div className="relative h-36 sm:h-48 md:h-64 lg:h-80 group/banner">
            <img
              src={coverImage}
              alt="Garden cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(9,9,11,0.4)] to-[#18181b]" />
            
            {/* Banner edit overlay (own profile only) */}
            {isOwnProfile && (
              <button
                onClick={() => setIsBannerImageModalOpen(true)}
                className="absolute bottom-4 right-4 opacity-0 group-hover/banner:opacity-100 transition-opacity duration-200 z-[5] hover:scale-105 transform transition-transform"
              >
                <div className="flex items-center gap-2 bg-black/60 hover:bg-black/70 px-4 py-2 rounded-full border border-emerald-500/40 hover:border-emerald-500/60 shadow-lg">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  <span className="text-white text-sm font-medium">Edit Cover Image</span>
                </div>
              </button>
            )}

            {/* Decorative leaf patterns */}
            <div className="absolute top-4 left-4 opacity-20 hidden sm:block">
              <LeafIcon className="w-16 h-16 text-[var(--botanical-sage)] animate-sway" />
            </div>
            <div className="absolute top-8 right-8 opacity-15 hidden sm:block">
              <Flower2 className="w-12 h-12 text-[var(--botanical-sage)]" />
            </div>
          </div>

          {/* Profile Info Overlay */}
          <div className="relative px-4 pb-4 -mt-14 sm:px-6 sm:pb-6 sm:-mt-20 md:px-8 md:pb-8 z-10">
            <div className="flex flex-col md:flex-row md:items-end gap-3 sm:gap-6">
              {/* Avatar */}
              <div
                className="relative group/avatar cursor-pointer"
                onClick={() => isOwnProfile && setIsProfileImageModalOpen(true)}
              >
                <Avatar className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 border-2 sm:border-4 border-[var(--botanical-forest)] shadow-xl">
                  <AvatarImage
                    src={profileUser?.avatarUrl}
                    alt={profileUser?.username}
                  />
                  <AvatarFallback className="bg-[var(--botanical-sage)] text-[var(--botanical-forest)] text-xl sm:text-3xl font-bold">
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
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-2 sm:space-y-3">
                <div className="flex flex-col md:flex-row md:items-center gap-2 sm:gap-4">
                  <div>
                    <h1 className="text-xl sm:text-3xl font-bold text-[var(--botanical-cream)]">
                      {profileUser.firstName && profileUser.lastName
                        ? `${profileUser.firstName} ${profileUser.lastName}`
                        : profileUser.username}
                    </h1>
                    <p className="text-[var(--botanical-sage)] flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                      <Sprout className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Joined{" "}
                    {profileUser?.joinedAt
                      ? new Date(profileUser.joinedAt).toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" }
                        )
                      : "Unknown"}
                  </span>
                  <span className="flex items-center gap-1">
                      <TreeDeciduous className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {usersCollections.length} Albums
                  </span>
                  <span className="flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {gardenPlants.length} Plants documented
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
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
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6 md:p-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 lg:flex lg:flex-col lg:space-y-1 lg:sticky lg:top-20">
              <SidebarNavItem
                icon={<LayoutList className="w-5 h-5" />}
                label="Posts"
                active={activeSection === "posts"}
                onClick={() => setActiveSection("posts")}
              />
              <SidebarNavItem
                icon={<TreeDeciduous className="w-5 h-5" />}
                label={isOwnProfile ? "My Albums" : "Albums"}
                active={activeSection === "collections"}
                onClick={() => setActiveSection("collections")}
                badge={usersCollections.length}
              />
              <SidebarNavItem
                icon={<Sprout className="w-5 h-5" />}
                label="My Garden"
                active={activeSection === "garden"}
                onClick={() => setActiveSection("garden")}
              />
              <SidebarNavItem
                icon={<ShoppingCart className="w-5 h-5" />}
                label="Marketplace"
                active={activeSection === "marketplace"}
                onClick={() => setActiveSection("marketplace")}
              />

              {/* Quick Actions */}
              {isOwnProfile && (
                <div className="hidden lg:block pt-6 space-y-2">
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
                <div className="flex items-center justify-between mb-3 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10">
                      <Sprout className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl font-semibold text-zinc-100">
                        {isOwnProfile ? "My Garden" : `${profileUser.username}'s Garden`}
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 hidden sm:block">
                        All plants across collections
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                        viewMode === "grid"
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "text-zinc-500 hover:text-emerald-500"
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                        viewMode === "list"
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "text-zinc-500 hover:text-emerald-500"
                      }`}
                    >
                      <LayoutList className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  <div className="space-y-2 sm:space-y-4">
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
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 flex-shrink-0">
                      <TreeDeciduous className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-xl font-semibold text-zinc-100">
                        Albums
                      </h2>
                      <p className="hidden sm:block text-sm text-zinc-400">
                        Organized plant albums
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Link href={`/profiles/${profileUser.username}/collections`}>
                      <button className="px-2 py-1 text-[11px] sm:px-3 sm:py-1.5 sm:text-xs font-medium rounded-md border border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-colors whitespace-nowrap">
                        View All
                      </button>
                    </Link>
                    {isOwnProfile && (
                      <button
                        onClick={() =>
                          router.push(`/profiles/${profileUser.username}/collections/new`)
                        }
                        className="px-2 py-1 text-[11px] sm:px-3 sm:py-1.5 sm:text-xs font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-500 transition-colors flex items-center gap-1 whitespace-nowrap"
                      >
                        <Plus className="w-3 h-3" />
                        New
                      </button>
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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
                        className="collection-bed group cursor-pointer flex items-center justify-center min-h-[120px] sm:min-h-[200px] hover:border-emerald-500/40 transition-colors"
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
              <MarketplaceSection
                profileUser={profileUser}
                isOwnProfile={isOwnProfile}
                currentUser={user}
              />
            )}
          </main>
        </div>
      </div>

      {isOwnProfile && profileUser && (
        <>
          <ProfileImageUploadModal
            open={isProfileImageModalOpen}
            onOpenChange={setIsProfileImageModalOpen}
            username={profileUser.username}
            type="profile"
            currentImageUrl={profileUser.avatarUrl}
          />
          <ProfileImageUploadModal
            open={isBannerImageModalOpen}
            onOpenChange={setIsBannerImageModalOpen}
            username={profileUser.username}
            type="banner"
            currentImageUrl={null}
          />
        </>
      )}
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
        <div className="relative aspect-[3/2] sm:aspect-[4/3] md:aspect-[3/2] overflow-hidden">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={plant.commonName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800">
              <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
        </div>

        <div className="p-2 sm:p-3 md:p-4">
          <h3 className="text-zinc-100 font-medium text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-1">
            {plant.commonName}
          </h3>
          <p className="text-zinc-500 text-[10px] sm:text-xs italic line-clamp-1">
            {plant.botanicalName}
          </p>

          <div className="hidden sm:flex items-center justify-between mt-3">
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
      <BotanicalCard className="flex gap-2.5 sm:gap-4 p-2.5 sm:p-4">
        {mainImage ? (
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={mainImage.url}
              alt={plant.commonName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-zinc-800">
            <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-600" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm text-emerald-500 truncate">
              @{profileUser.username}
            </span>
          </div>
          <h3 className="text-sm sm:text-base text-zinc-100 font-medium mb-0.5 sm:mb-1 line-clamp-1">{plant.commonName}</h3>
          <p className="text-zinc-500 text-xs sm:text-sm italic mb-1 sm:mb-2 line-clamp-1">{plant.botanicalName}</p>
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
      className="collection-bed group cursor-pointer relative overflow-hidden !p-0 sm:!p-4 md:!p-6"
    >
      <LeafDecoration position="top-right" size="lg" />
      
      {/* Cover Image */}
      <div className="relative aspect-[4/3] sm:aspect-[3/2] md:h-40 md:aspect-auto overflow-hidden sm:rounded-lg">
        <img
          src={collection.thumbnailImage?.url || "/api/placeholder/400/200"}
          alt={collection.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-2.5 py-1.5 sm:px-0 sm:py-0 sm:mt-2 md:mt-4">
        <h3 className="text-xs sm:text-sm md:text-lg font-semibold text-zinc-100 group-hover:text-emerald-500 transition-colors line-clamp-1">
          {collection.name}
        </h3>
        <span className="text-[10px] sm:text-xs text-emerald-500">
          {collection.plants?.length || 0} plants
        </span>
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  );
}

// Post Card Component (Journal Style)
function PostCard({
  post,
  profileUser,
  onLike,
  timeAgo,
}: {
  post: Post;
  profileUser: User;
  onLike: (id: number) => void;
  timeAgo: (date: string) => string;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.upvotes || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    onLike(post.id);
  };

  return (
    <BotanicalCard className="p-4">
      <div className="flex gap-4">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={profileUser.avatarUrl} alt={profileUser.username} />
          <AvatarFallback className="bg-emerald-600 text-white">
            {profileUser.username?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-zinc-100">
              {profileUser.firstName && profileUser.lastName
                ? `${profileUser.firstName} ${profileUser.lastName}`
                : profileUser.username}
            </span>
            <span className="text-sm text-zinc-500">
              @{profileUser.username}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-sm text-zinc-500">
              {timeAgo(post.createdAt)}
            </span>
            <button className="ml-auto p-1 rounded-lg hover:bg-zinc-800 transition-colors">
              <MoreHorizontal className="w-4 h-4 text-zinc-500" />
            </button>
          </div>

          {post.text && (
            <p className="text-zinc-100 mb-3 leading-relaxed">
              {post.text}
            </p>
          )}

          {post.image && (
            <div className="rounded-xl overflow-hidden mb-3 border border-zinc-700/50">
              <img
                src={post.image}
                alt="Post media"
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-400 transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              </div>
              {likeCount}
            </button>
            <button className="flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-emerald-500/10 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              {post.comments?.length || 0}
            </button>
            <button className="flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-emerald-500/10 transition-colors">
                <Share className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </BotanicalCard>
  );
}

function MarketplaceSection({
  profileUser,
  isOwnProfile,
  currentUser,
}: {
  profileUser: User;
  isOwnProfile: boolean;
  currentUser: User | null;
}) {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isPaidUser =
    isOwnProfile &&
    currentUser?.subscriptionTier === "premium" &&
    currentUser?.plan === "premium";

  const isExpiredSubscription =
    isOwnProfile &&
    currentUser?.subscriptionEndsAt &&
    new Date(currentUser.subscriptionEndsAt) < new Date() &&
    currentUser?.plan !== "premium";

  const isFreeUser = isOwnProfile && !isPaidUser;

  const fetchListings = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getUserMarketplaceListings(profileUser.username);
      setListings(data);
    } catch {
      if (isOwnProfile) {
        setListings([]);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUser.username]);

  return (
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

      {loading ? (
        <MarketplaceLoadingSkeleton />
      ) : error ? (
        <MarketplaceError onRetry={fetchListings} />
      ) : !isOwnProfile ? (
        <MarketplacePublicView
          listings={listings}
          username={profileUser.username}
        />
      ) : isExpiredSubscription ? (
        <MarketplaceExpiredView />
      ) : isFreeUser ? (
        <MarketplaceFreeUserView />
      ) : listings.length > 0 ? (
        <MarketplacePaidWithListings listings={listings} />
      ) : (
        <MarketplacePaidEmptyView />
      )}
    </section>
  );
}

type MarketplaceListing = {
  id: string;
  title: string;
  price: number;
  image?: string;
  status: "active" | "sold" | "draft";
  views?: number;
  likes?: number;
  createdAt: string;
};

function MarketplaceLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <div className="aspect-[4/3] bg-zinc-800 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-1/3 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketplaceError({ onRetry }: { onRetry: () => void }) {
  return (
    <BotanicalEmptyState
      icon={<AlertCircle className="w-10 h-10 text-red-400" />}
      title="Could not load listings"
      description="Something went wrong while fetching marketplace listings. Please try again."
      action={
        <BotanicalButton variant="outline" onClick={onRetry}>
          <RefreshCw className="w-4 h-4" />
          Retry
        </BotanicalButton>
      }
    />
  );
}

function MarketplacePublicView({
  listings,
  username,
}: {
  listings: MarketplaceListing[];
  username: string;
}) {
  const activeListings = listings.filter((l) => l.status === "active");

  if (activeListings.length === 0) {
    return (
      <BotanicalEmptyState
        icon={<ShoppingCart className="w-10 h-10 text-[var(--botanical-sage)]" />}
        title="No listings yet"
        description={`${username} hasn't listed any plants for sale yet.`}
      />
    );
  }

  return (
    <div>
      <p className="text-sm text-zinc-400 mb-4">
        {activeListings.length} active listing{activeListings.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeListings.map((listing) => (
          <MarketplaceListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

function MarketplaceFreeUserView() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
        <Lock className="w-10 h-10 text-amber-400" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-100 mb-2">
        Upgrade to List Your Plants
      </h3>
      <p className="text-zinc-400 max-w-sm mb-6">
        Create marketplace listings and sell your plants to the MFV community.
      </p>
      <BotanicalButton onClick={() => router.push("/settings")}>
        <Crown className="w-4 h-4" />
        Upgrade to Premium
      </BotanicalButton>
    </div>
  );
}

function MarketplaceExpiredView() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-10 h-10 text-amber-400" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-100 mb-2">
        Your Subscription Has Ended
      </h3>
      <p className="text-zinc-400 max-w-sm mb-6">
        Upgrade to create new listings and continue selling your plants on the marketplace.
      </p>
      <BotanicalButton onClick={() => router.push("/settings")}>
        <Crown className="w-4 h-4" />
        Re-subscribe to Premium
      </BotanicalButton>
    </div>
  );
}

function MarketplacePaidWithListings({
  listings,
}: {
  listings: MarketplaceListing[];
}) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price" | "status">("newest");

  const activeListings = listings.filter((l) => l.status !== "draft");
  const draftListings = listings.filter((l) => l.status === "draft");

  const sortedListings = [...activeListings].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "price":
        return b.price - a.price;
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <p className="text-sm text-zinc-400">
          My Marketplace Listings ({activeListings.length})
        </p>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price">Price</option>
            <option value="status">Status</option>
          </select>
          <BotanicalButton
            size="sm"
            onClick={() => router.push("/marketplace")}
          >
            <Plus className="w-4 h-4" />
            Create New Listing
          </BotanicalButton>
        </div>
      </div>

      {draftListings.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
          <p className="text-sm text-amber-400 mb-2">
            You have {draftListings.length} draft listing{draftListings.length !== 1 ? "s" : ""}
          </p>
          <BotanicalButton
            variant="outline"
            size="sm"
            onClick={() => router.push("/marketplace")}
          >
            Complete Draft{draftListings.length !== 1 ? "s" : ""}
          </BotanicalButton>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedListings.map((listing) => (
          <MarketplaceListingCard
            key={listing.id}
            listing={listing}
            showActions
          />
        ))}
      </div>
    </div>
  );
}

function MarketplacePaidEmptyView() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
        <Leaf className="w-10 h-10 text-emerald-500" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-100 mb-2">
        Start Selling Your Plants
      </h3>
      <p className="text-zinc-400 max-w-sm mb-6">
        You haven&apos;t created any listings yet. Share your plants with the community!
      </p>
      <BotanicalButton onClick={() => router.push("/marketplace")}>
        <Plus className="w-4 h-4" />
        Create Your First Listing
      </BotanicalButton>
    </div>
  );
}

function MarketplaceListingCard({
  listing,
  showActions = false,
}: {
  listing: MarketplaceListing;
  showActions?: boolean;
}) {
  const statusColors = {
    active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
    sold: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
    draft: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  };

  return (
    <BotanicalCard className="overflow-hidden group cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-800">
        {listing.image ? (
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-zinc-600" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 text-xs rounded-full border ${statusColors[listing.status]}`}
          >
            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-sm font-medium text-zinc-100 truncate mb-1">
          {listing.title}
        </h4>
        <p className="text-emerald-500 font-semibold">
          ${listing.price.toFixed(2)}
        </p>
        {(listing.views !== undefined || listing.likes !== undefined) && (
          <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
            {listing.views !== undefined && (
              <span>{listing.views} views</span>
            )}
            {listing.likes !== undefined && (
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {listing.likes}
              </span>
            )}
          </div>
        )}
        {showActions && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-800">
            <button className="text-xs text-zinc-400 hover:text-emerald-500 transition-colors">
              Edit
            </button>
            <span className="text-zinc-700">|</span>
            <button className="text-xs text-zinc-400 hover:text-red-400 transition-colors">
              Delete
            </button>
          </div>
        )}
      </div>
    </BotanicalCard>
  );
}

export default ProfilePage;
