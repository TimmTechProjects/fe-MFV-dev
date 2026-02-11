"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, MoreVertical, Pencil } from "lucide-react";
import { Plant } from "@/types/plants";
import { removePlantFromAlbum } from "@/lib/utils";

interface PlantGridCardProps {
  plant: Plant & {
    user?: { username: string };
    originalCollection?: { slug: string };
  };
  collectionId?: string;
  isAlbumOwner?: boolean;
  loggedInUsername?: string;
  onRemoved?: (plantId: string) => void;
}

const PlantGridCard = ({
  plant,
  collectionId,
  isAlbumOwner = false,
  loggedInUsername,
  onRemoved,
}: PlantGridCardProps) => {
  const router = useRouter();
  const mainImage = plant.images?.[0]?.url ?? "/fallback.png";
  const author = plant.user?.username;
  const originalSlug = plant.originalCollection?.slug;
  const plantUrl = `/profiles/${author}/collections/${originalSlug}/${plant.slug}`;

  const plainDescription = plant.description
    ? plant.description.replace(/<[^>]+>/g, "").slice(0, 150)
    : "";

  const isPlantCreator = loggedInUsername && author === loggedInUsername;

  const [showConfirm, setShowConfirm] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const editMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editMenuRef.current && !editMenuRef.current.contains(e.target as Node)) {
        setShowEditMenu(false);
      }
    };
    if (showEditMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEditMenu]);

  const handleRemove = async () => {
    if (!collectionId) return;
    setIsRemoving(true);
    const result = await removePlantFromAlbum(collectionId, plant.id);
    setIsRemoving(false);
    if (result.success) {
      onRemoved?.(plant.id);
    }
    setShowConfirm(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (author && originalSlug) {
      router.push(`/profiles/${author}/collections/${originalSlug}/${plant.slug}/edit`);
    }
  };

  return (
    <div className="relative group">
      <Link href={plantUrl} className="block">
        <div className="relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
          <Image
            src={mainImage}
            alt={plant.commonName || "Plant image"}
            fill
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-2/5 group-hover:h-3/4 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all duration-300" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-semibold text-white text-lg truncate">
              {plant.commonName || plant.botanicalName}
            </h3>
            <p className="text-zinc-300 text-sm line-clamp-1 mt-0.5">
              {plainDescription || plant.botanicalName}
            </p>
            <div className="max-h-0 group-hover:max-h-24 overflow-hidden transition-all duration-300 ease-in-out">
              {plant.commonName && (
                <p className="text-emerald-400/70 text-sm italic mt-1">
                  {plant.botanicalName}
                </p>
              )}
              {plainDescription && (
                <p className="text-zinc-400 text-sm line-clamp-2 mt-1">
                  {plainDescription}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>

      {isAlbumOwner && !showConfirm && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowConfirm(true);
          }}
          className="absolute top-2 left-2 z-10 p-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-red-500/30 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 cursor-pointer"
          title="Remove from album"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      {isPlantCreator && !showConfirm && (
        <div ref={editMenuRef} className="absolute top-2 right-2 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowEditMenu(!showEditMenu);
            }}
            className="p-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-zinc-500/30 text-zinc-300 opacity-0 group-hover:opacity-100 hover:bg-zinc-500/20 hover:text-white transition-all duration-200 cursor-pointer"
            title="More options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showEditMenu && (
            <button
              onClick={handleEditClick}
              className="absolute right-full mr-1 top-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-zinc-600/50 text-zinc-200 hover:bg-zinc-700/80 hover:text-white transition-all duration-200 whitespace-nowrap text-sm cursor-pointer"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          )}
        </div>
      )}

      {showConfirm && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-black/80 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center gap-3 px-4 py-3">
            <p className="text-white text-sm font-medium text-center">
              Are you sure you want to delete?
            </p>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowConfirm(false);
                }}
                className="px-3 py-1.5 text-sm rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove();
                }}
                disabled={isRemoving}
                className="px-3 py-1.5 text-sm rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isRemoving ? "Removing..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantGridCard;
