"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import EditCollectionWrapper from "@/components/EditCollectionButton";
import { useRouter } from "next/navigation";
import { Plant } from "@/types/plants";
import { Plus, Leaf, Sparkles, ArrowLeft } from "lucide-react";
import useAuth from "@/redux/hooks/useAuth";
import { decodeHtmlEntities } from "@/lib/utils";

interface CollectionsPageProps {
  username: string;
  collectionSlug: string;
  collectionData: {
    name: string;
    description?: string;
    thumbnailImage?: { url: string } | null;
    plants: (Plant & {
      user?: {
        username: string;
      };
      collection?: {
        slug: string;
      };
    })[];
  };
}

const ClientCollectionView = ({
  username,
  collectionSlug,
  collectionData,
}: CollectionsPageProps) => {
  const { user } = useAuth();
  const router = useRouter();

  const isOwner = user?.username === username;
  const { name, description, thumbnailImage, plants } = collectionData;

  return (
    <div className="min-h-screen">
      {/* Botanical gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-zinc-950 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-2 8-8 14-16 16 8 2 14 8 16 16 2-8 8-14 16-16-8-2-14-8-16-16z' fill='%2310b981' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => router.push(`/profiles/${username}/collections`)}
          className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Albums</span>
        </button>

        {/* Header */}
        <div className="relative mb-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Collection thumbnail */}
              {thumbnailImage?.url && (
                <div className="hidden sm:block w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10 flex-shrink-0">
                  <Image
                    src={thumbnailImage.url}
                    alt={name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 text-sm font-medium uppercase tracking-wider">Album</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {name}
                </h1>
                <p className="text-zinc-400">
                  by{" "}
                  <Link
                    href={`/profiles/${username}`}
                    className="text-emerald-400 hover:text-emerald-300 transition"
                  >
                    @{username}
                  </Link>
                  <span className="mx-2">•</span>
                  <span>{plants.length} {plants.length === 1 ? 'plant' : 'plants'}</span>
                </p>
                {description && (
                  <p className="mt-3 text-zinc-300 max-w-xl leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {isOwner && (
              <div className="flex gap-3 sm:self-start">
                <EditCollectionWrapper
                  collection={{
                    name,
                    description: description || "",
                    thumbnailUrl: thumbnailImage?.url || "",
                    slug: collectionSlug,
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Decorative line */}
          <div className="mt-6 h-px bg-gradient-to-r from-emerald-500/50 via-emerald-500/20 to-transparent" />
        </div>

        {/* Plants Grid */}
        {plants.length === 0 ? (
          /* Empty State - Welcoming design */
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative mb-6">
              {/* Decorative circles */}
              <div className="absolute -inset-8 bg-emerald-500/5 rounded-full blur-2xl" />
              <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-xl" />
              
              {/* Main icon container */}
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center">
                <Leaf className="w-16 h-16 text-emerald-400" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-emerald-300 animate-pulse" />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-2">
              Your garden awaits!
            </h2>
            <p className="text-zinc-400 text-center max-w-md mb-8 leading-relaxed">
              This album is ready for its first plant. Start documenting your botanical journey by adding your first entry.
            </p>

            {isOwner && (
              <button
                onClick={() =>
                  router.push(
                    `/profiles/${username}/collections/${collectionSlug}/new`
                  )
                }
                className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Plant</span>
                <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}

            {!isOwner && (
              <p className="text-zinc-500 text-sm italic">
                This album doesn't have any plants yet.
              </p>
            )}
          </div>
        ) : (
          /* Plants Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plants.map((plant: Plant) => {
              const mainImage = plant.images?.[0]?.url ?? "/fallback.png";
              const author = plant.user?.username;
              const originalSlug = plant.originalCollection?.slug;

              if (!author || !originalSlug) {
                console.warn("Missing plant author or originalSlug:", plant);
              }

              const plantUrl = `/profiles/${author}/collections/${originalSlug}/${plant.slug}`;

              return (
                <Link
                  key={plant.id}
                  href={plantUrl}
                  className="group relative bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="w-full sm:w-48 h-48 flex-shrink-0 relative overflow-hidden">
                      <Image
                        src={mainImage}
                        alt={plant.commonName || "Plant image"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent sm:bg-gradient-to-r" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {plant.commonName}
                      </h3>
                      <p className="text-sm text-emerald-400/70 italic mb-3">
                        {plant.botanicalName}
                      </p>

                      <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">
                        {plant.description
                          ? decodeHtmlEntities(plant.description)
                              .replace(/<[^>]+>/g, "")
                              .slice(0, 150) +
                            (decodeHtmlEntities(plant.description).replace(/<[^>]+>/g, "").length > 150 ? "..." : "")
                          : "No description provided."}
                      </p>

                      {plant.tags && plant.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {plant.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.name}
                              className="inline-block bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20"
                            >
                              {tag.name}
                            </span>
                          ))}
                          {plant.tags.length > 3 && (
                            <span className="text-xs text-zinc-500">
                              +{plant.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Add New Plant Card (for owners) */}
            {isOwner && (
              <button
                onClick={() =>
                  router.push(
                    `/profiles/${username}/collections/${collectionSlug}/new`
                  )
                }
                className="group relative bg-zinc-900/30 backdrop-blur-sm border-2 border-dashed border-zinc-700 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-zinc-900/50 min-h-[200px] flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-4 p-8">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 group-hover:bg-emerald-500/20 border border-zinc-700 group-hover:border-emerald-500/50 flex items-center justify-center transition-all duration-300">
                    <Plus className="w-8 h-8 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-zinc-400 group-hover:text-emerald-400 transition-colors">
                      Add New Plant
                    </p>
                    <p className="text-sm text-zinc-600 group-hover:text-zinc-500 transition-colors">
                      Expand your album
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientCollectionView;
