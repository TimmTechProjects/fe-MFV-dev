"use client";

import React, { useEffect, useState } from "react";
import { getUserCollections } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import useAuth from "@/redux/hooks/useAuth";
import { CollectionsPageSkeleton } from "@/components/skeletons/CollectionCardSkeleton";

interface CollectionsPageProps {
  params: Promise<{
    username: string;
  }>;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImageUrl?: string | null;
  thumbnailImage?: {
    url: string;
  } | null;
  plants?: {
    images: {
      url: string;
    }[];
    user?: {
      username: string;
    };
    slug: string;
    collection?: {
      slug: string;
    };
  }[];
}

const CollectionsPage = ({ params }: CollectionsPageProps) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { username } = React.use(params);

  const isOwner = user?.username === username;

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collections = await getUserCollections(username);
        setCollections(collections);
      } catch (error) {
        console.error("Error fetching collections", error);
        setError("Failed to load collections");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [username]);

  if (loading) {
    return <CollectionsPageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen botanical-gradient-light dark:botanical-gradient botanical-pattern text-zinc-900 dark:text-white px-10 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold ml-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <Link href={`/profiles/${username}`}>
                <span className="text-zinc-900 dark:text-white hover:text-emerald-500 transition-colors">
                  {isOwner ? "My" : <span className="capitalize">{username}&apos;s</span>}
                </span>
              </Link>{" "}
              <span className="text-zinc-900 dark:text-white">Albums</span>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-normal mt-1">
                {collections.length} album{collections.length !== 1 ? 's' : ''} • Organized plant albums
              </p>
            </div>
          </h2>
        </div>

      {collections.length === 0 ? (
        <div className="flex flex-col justify-center mt-28 pl-10">
          {isOwner ? (
            <div className="w-56 h-72 sm:w-60 sm:h-80 flex group items-center justify-center">
              <Link
                href={`/profiles/${username}/collections/new`}
                className="flex flex-col items-center justify-center gap-2 text-zinc-400 group hover:text-emerald-500 transition duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-center w-16 h-16 border-2 border-zinc-600 rounded-full group-hover:border-emerald-500 transition duration-200">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="text-sm font-semibold text-center mt-2">
                  Add New Album
                </span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col justify-center mt-28">
              <p className="text-lg justify-center text-center">
                {username} hasn&apos;t added any albums yet. Check back
                later!
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-16">
          {/* Existing collections */}
          {collections.map((collection) => {
            const imgUrl =
              collection.coverImageUrl ??
              collection.thumbnailImage?.url ??
              collection.plants?.[0]?.images?.[0]?.url ??
              "/fallback.png";

            const authorUsername = collection.plants?.[0]?.user?.username;
            const originalCollectionSlug =
              collection.plants?.[0]?.collection?.slug;

            return (
              <Link
                key={collection.id}
                href={
                  authorUsername && originalCollectionSlug
                    ? `/profiles/${authorUsername}/collections/${originalCollectionSlug}/${collection.plants?.[0]?.slug}`
                    : `/profiles/${username}/collections/${collection.slug}`
                }
              >
                <div className="relative group rounded-2xl overflow-hidden w-56 h-72 sm:w-60 sm:h-80 cursor-pointer shadow hover:shadow-lg transition-shadow duration-200">
                  <Image
                    src={imgUrl}
                    alt={collection.name || "Collection thumbnail"}
                    fill
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-102"
                  />

                  {/* Bottom content (fades out on hover) */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-200 group-hover:opacity-0" />
                  <div className="absolute bottom-3 left-3 right-3 text-white z-10 transition-opacity duration-200 group-hover:opacity-0">
                    <h3 className="text-lg font-semibold truncate">
                      {collection.name}
                    </h3>
                  </div>

                  {/* Slide-up overlay on hover */}
                  <div className="absolute inset-x-0 bottom-0 h-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative p-4 flex flex-col h-full">
                      <h3 className="text-white text-lg font-semibold">
                        {collection.name}
                      </h3>
                      {collection.description && (
                        <p className="text-white/90 text-sm mt-2 overflow-hidden">
                          {collection.description}
                        </p>
                      )}
                      <div className="mt-auto text-white/80 text-xs">
                        {(collection.plants?.length || 0)} {(collection.plants?.length || 0) === 1 ? "plant" : "plants"}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* New Collection Card */}
          {isOwner && (
            <div className="w-56 h-72 sm:w-60 sm:h-80 flex items-center justify-center">
              <Link
                href={`/profiles/${username}/collections/new`}
                className="flex flex-col items-center justify-center gap-2 text-zinc-400 group hover:text-emerald-500 transition duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-center w-16 h-16 border-2 border-zinc-600 rounded-full group-hover:border-emerald-500 transition duration-200">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="text-sm font-semibold text-center mt-2">
                  Add New Album
                </span>
              </Link>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default CollectionsPage;
