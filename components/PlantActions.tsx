"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Heart, Plus, Check } from "lucide-react";
import {
  cn,
  getUserCollectionsWithAuth,
  savePlantToAlbum,
  removePlantFromAlbum,
  togglePlantLike,
  getPlantLikeStatus,
} from "@/lib/utils";
import { Collection } from "@/types/collections";
import { toast } from "sonner";
import Link from "next/link";
import useAuth from "@/redux/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function SaveToAlbumButton({ plantId }: { plantId: string }) {
  const { user } = useAuth();
  const username = user?.username;
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [plantAlbumMap, setPlantAlbumMap] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (!user) return;

    const fetchLikeStatus = async () => {
      const result = await getPlantLikeStatus(plantId);
      if (result) {
        setLiked(result.liked);
      }
    };

    fetchLikeStatus();
  }, [user, plantId]);

  const handleToggleLike = useCallback(async () => {
    if (!user) {
      router.push("/login");
      toast.error("You must be logged in to like a plant.");
      return;
    }

    setLiked((prev) => !prev);

    const result = await togglePlantLike(plantId);
    if (result) {
      setLiked(result.liked);
    } else {
      setLiked((prev) => !prev);
      toast.error("Failed to update like.");
    }
  }, [user, plantId, router]);

  const handleTogglePlant = async (collectionId: string) => {
    const isCurrentlyInAlbum = plantAlbumMap[collectionId];

    setPlantAlbumMap((prev) => ({
      ...prev,
      [collectionId]: !prev[collectionId],
    }));

    const result = isCurrentlyInAlbum
      ? await removePlantFromAlbum(collectionId, plantId)
      : await savePlantToAlbum(collectionId, plantId);

    if (!result.success) {
      setPlantAlbumMap((prev) => ({
        ...prev,
        [collectionId]: isCurrentlyInAlbum,
      }));
    }

    if (result.success && "movedToUncategorized" in result && result.movedToUncategorized) {
      toast.warning(result.message);
      const userCollections = await getUserCollectionsWithAuth();
      const plantMap: { [key: string]: boolean } = {};
      for (const collection of userCollections) {
        const plantIds =
          collection.plants?.map((p: { id: string }) => p.id) || [];
        plantMap[collection.id] = plantIds.includes(plantId);
      }
      setCollections(userCollections);
      setPlantAlbumMap(plantMap);
      return;
    }

    toast[result.success ? "success" : "error"](result.message);
  };

  useEffect(() => {
    if (!user) return;

    const fetchCollections = async () => {
      setLoading(true);
      const userCollections = await getUserCollectionsWithAuth();

      const plantMap: { [key: string]: boolean } = {};
      for (const collection of userCollections) {
        const plantIds =
          collection.plants?.map((p: { id: string }) => p.id) || [];
        plantMap[collection.id] = plantIds.includes(plantId);
      }

      setCollections(userCollections);
      setPlantAlbumMap(plantMap);
      setLoading(false);
    };

    fetchCollections();
  }, [plantId, user]);

  return (
    <div className="flex gap-3 items-center">
      <button
        onClick={handleToggleLike}
        className={cn(
          "flex items-center gap-2 px-3 py-1 rounded border transition cursor-pointer",
          liked
            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
            : "bg-transparent border-zinc-600 text-zinc-300 hover:bg-white/10"
        )}
      >
        {liked ? (
          <Heart className="w-4 h-4 fill-current text-emerald-400" />
        ) : (
          <Heart className="w-4 h-4" />
        )}
        Like
      </button>

      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 text-sm text-zinc-200 hover:text-white border border-zinc-600 px-3 py-1 rounded hover:bg-white/10 transition cursor-pointer">
            <Plus className="w-4 h-4" />
            Save
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-64 bg-zinc-900 border border-zinc-700 p-4 text-sm text-white rounded">
          <p className="mb-2 text-xs text-zinc-400">Add to album</p>

          {loading ? (
            <p className="text-xs text-zinc-500">Loading...</p>
          ) : collections.length === 0 ? (
            <p className="text-xs text-zinc-500">No albums found</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {collections.map((album) => {
                const isInAlbum = plantAlbumMap[album.id];

                return (
                  <button
                    key={album.id}
                    onClick={() => handleTogglePlant(album.id)}
                    className="w-full flex items-center justify-start gap-2 text-left hover:bg-zinc-800 px-2 py-1 rounded cursor-pointer"
                  >
                    <div className="w-4 h-4 border border-zinc-500 rounded-sm flex items-center justify-center">
                      {isInAlbum && (
                        <Check className="w-3 h-3 text-emerald-400" />
                      )}
                    </div>
                    <span>{album.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {username && (
            <Link
              href={`/profiles/${username}/collections/new?redirectTo=${encodeURIComponent(
                window.location.pathname
              )}`}
            >
              <button className="mt-3 text-xs text-emerald-400 hover:underline cursor-pointer">
                + Create New Album
              </button>
            </Link>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
