"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import useAuth from "@/redux/hooks/useAuth";
import { getPlantBySlug } from "@/lib/utils";
import { Plant } from "@/types/plants";
import PlantEditForm from "@/components/PlantEditForm";
import Link from "next/link";
import { ArrowLeft, Sprout, Pencil } from "lucide-react";

const EditPlantPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { username, collectionSlug, slug } = useParams();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace(
        `/login?redirect=/profiles/${username}/collections/${collectionSlug}/${slug}/edit`
      );
      return;
    }

    if (typeof username === "string" && user.username !== username) {
      router.replace("/");
      return;
    }
  }, [user, username, collectionSlug, slug, router]);

  useEffect(() => {
    const fetchPlant = async () => {
      if (typeof slug !== "string" || typeof username !== "string") {
        setLoading(false);
        return;
      }

      try {
        const data = await getPlantBySlug(slug, username);
        if (data) {
          setPlant(data);
        } else {
          router.replace("/404");
        }
      } catch (err) {
        console.error("Failed to fetch plant", err);
        router.replace("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [slug, username, router]);

  if (!user || loading) {
    return (
      <div className="min-h-screen botanical-gradient botanical-pattern flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <Sprout className="w-8 h-8 text-[var(--botanical-sage)] animate-bounce" />
          <span className="text-[var(--botanical-sage)]">Loading plant editor...</span>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen botanical-gradient botanical-pattern flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Plant not found</p>
          <button
            onClick={() => router.back()}
            className="text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen botanical-gradient botanical-pattern">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/profiles/${username}/collections/${collectionSlug}/${slug}`}
            className="p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-500" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <Pencil className="w-6 h-6 text-emerald-500" />
              Edit Plant
            </h1>
            <p className="text-sm text-zinc-400">
              Editing <span className="text-emerald-500">{plant.commonName || plant.botanicalName}</span>
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
          <PlantEditForm
            plant={plant}
            onCancel={() =>
              router.push(
                `/profiles/${username}/collections/${collectionSlug}/${slug}`
              )
            }
            onSave={(updated) => {
              router.push(
                `/profiles/${username}/collections/${collectionSlug}/${updated.slug}`
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditPlantPage;
