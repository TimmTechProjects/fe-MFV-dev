"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { plantSchema, PlantSchema } from "@/schemas/plantSchema";
import { toast } from "sonner";
import useAuth from "@/redux/hooks/useAuth";
import {
  getPlantBySlug,
  updatePlant,
  decodeHtmlEntities,
} from "@/lib/utils";
import { Plant } from "@/types/plants";
import { UploadButton } from "@/lib/uploadthing";
import {
  ArrowLeft,
  Sprout,
  Pencil,
  ImageIcon,
  X,
  Save,
} from "lucide-react";

const PlantEditor = dynamic(() => import("@/components/editor/PlantEditor"), {
  ssr: false,
});

const EditPlantPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { username, collectionSlug, slug } = useParams();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const form = useForm<PlantSchema>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      commonName: "",
      botanicalName: "",
      description: "",
      type: "",
      origin: "",
      family: "",
      tags: [],
      images: [],
      isPublic: true,
    },
  });

  const { register, handleSubmit, watch, setValue, reset } = form;

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
          const decoded = decodeHtmlEntities(data.description);
          setEditorContent(decoded);
          reset({
            commonName: data.commonName || "",
            botanicalName: data.botanicalName || "",
            description: decoded,
            type: data.type || "",
            origin: data.origin || "",
            family: data.family || "",
            tags: data.tags.map((tag) => tag.name) || [],
            images: data.images || [],
            isPublic: data.isPublic,
          });
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
  }, [slug, username, router, reset]);

  const onSubmit = async (values: PlantSchema) => {
    if (!plant) return;
    setIsSubmitting(true);

    try {
      const result = await updatePlant(plant.id, {
        ...values,
        description: editorContent,
      });

      if (result) {
        toast.success("Plant updated successfully!");
        router.push(
          `/profiles/${username}/collections/${collectionSlug}/${result.slug}`
        );
      } else {
        toast.error("Failed to update plant. Please try again.");
      }
    } catch (err) {
      console.error("Failed to update plant:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = watch("images").filter((_, idx) => idx !== index);
    setValue("images", updated);
  };

  const handleRemoveTag = (index: number) => {
    const updated = watch("tags")?.filter((_, idx) => idx !== index);
    setValue("tags", updated || []);
  };

  const backUrl = `/profiles/${username}/collections/${collectionSlug}/${slug}`;

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <Sprout className="w-8 h-8 text-emerald-500 animate-bounce" />
          <span className="text-emerald-500">Loading plant editor...</span>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
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
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={backUrl}
            className="p-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/60 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-500" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <Pencil className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              Edit Plant
            </h1>
            <p className="text-sm text-zinc-400 truncate">
              {plant.commonName || plant.botanicalName}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="bg-zinc-900/60 rounded-2xl p-4 sm:p-5 border border-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              <h2 className="text-sm font-semibold text-zinc-200">Photos</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {watch("images").map((img, i) => (
                <div
                  key={String("id" in img && img.id ? img.id : i)}
                  className="relative aspect-square rounded-lg overflow-hidden group/img"
                >
                  <Image
                    src={"url" in img && img.url ? img.url : "/fallback.png"}
                    alt={`Plant image ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white opacity-0 group-hover/img:opacity-100 hover:bg-red-600 transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-600/90 text-white">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3">
              <UploadButton
                endpoint="plantImageUploader"
                onClientUploadComplete={(res) => {
                  const newImages = res.map((file) => ({
                    url: file.url,
                    previewUrl: file.url,
                    isMain: false,
                  }));
                  setValue("images", [...watch("images"), ...newImages]);
                }}
                onUploadError={(error: Error) => {
                  console.error("Upload error:", error.message);
                  toast.error("Image upload failed.");
                }}
              />
            </div>
          </div>

          <div className="bg-zinc-900/60 rounded-2xl p-4 sm:p-5 border border-zinc-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-500 mb-1.5">
                  Common Name
                </label>
                <input
                  {...register("commonName")}
                  className="botanical-input w-full"
                  placeholder="e.g., Lavender"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-500 mb-1.5">
                  Botanical Name
                </label>
                <input
                  {...register("botanicalName")}
                  className="botanical-input w-full italic"
                  placeholder="e.g., Lavandula angustifolia"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-500 mb-1.5">
                  Type
                </label>
                <select
                  {...register("type")}
                  className="botanical-input w-full"
                >
                  <option value="">Select type</option>
                  <option value="herb">Herb</option>
                  <option value="tree">Tree</option>
                  <option value="shrub">Shrub</option>
                  <option value="flower">Flower</option>
                  <option value="succulent">Succulent</option>
                  <option value="vine">Vine</option>
                  <option value="fungus">Fungus</option>
                  <option value="fern">Fern</option>
                  <option value="grass">Grass</option>
                  <option value="bulb">Bulb</option>
                  <option value="aquatic">Aquatic</option>
                  <option value="mushroom">Mushroom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-500 mb-1.5">
                  Origin
                </label>
                <input
                  {...register("origin")}
                  className="botanical-input w-full"
                  placeholder="e.g., Mediterranean"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-500 mb-1.5">
                  Family
                </label>
                <input
                  {...register("family")}
                  className="botanical-input w-full"
                  placeholder="e.g., Lamiaceae"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-500 mb-1.5">
                Description
              </label>
              <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 overflow-hidden">
                <PlantEditor
                  content={editorContent}
                  onChange={setEditorContent}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-500 mb-1.5">
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {watch("tags")?.map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-xs border border-emerald-500/20"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(i)}
                      className="ml-0.5 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                className="botanical-input w-full"
                placeholder="Add tags separated by commas"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const newTags = input.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t.length > 0);
                    const current = watch("tags") || [];
                    const merged = [...current, ...newTags.filter((t) => !current.includes(t))];
                    setValue("tags", merged.slice(0, 10));
                    input.value = "";
                  }
                }}
              />
              <p className="text-xs text-zinc-500 mt-1">Press Enter to add tags</p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            <Link
              href={backUrl}
              className="px-5 py-2.5 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/30"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlantPage;
