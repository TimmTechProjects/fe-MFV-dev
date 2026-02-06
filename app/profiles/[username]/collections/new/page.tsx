"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createNewCollection } from "@/lib/utils";
import {
  ArrowLeft,
  Upload,
  X,
  Leaf,
  TreeDeciduous,
  Sparkles,
  Eye,
  ImageIcon,
  Check,
} from "lucide-react";
import Link from "next/link";
import {
  BotanicalCard,
  BotanicalButton,
  BotanicalInput,
  BotanicalTextarea,
  LeafIcon,
  LeafDecoration,
} from "@/components/ui/botanical";

interface NewCollectionPageProps {
  params: Promise<{
    username: string;
  }>;
}

const NewCollectionPage = ({ params }: NewCollectionPageProps) => {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setUsername(resolvedParams.username);
    };

    unwrapParams();
  }, [params]);

  // Clean up preview URL when unmounting or when preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setThumbnail(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const clearThumbnail = () => {
    setThumbnail(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !name.trim()) return;

    setIsSubmitting(true);
    
    try {
      const response = await createNewCollection(username, { name, description });

      if (response.ok) {
        const data = await response.json();
        const slug = data.slug;

        if (slug) {
          if (redirectTo) {
            router.push(redirectTo);
          } else {
            router.push(`/profiles/${username}/collections/${slug}`);
          }
        } else {
          router.push(`/profiles/${username}`);
        }
      } else {
        alert("Failed to create collection. Please try again.");
      }
    } catch (error) {
      console.error("Error creating collection:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen botanical-gradient botanical-pattern">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={username ? `/profiles/${username}` : "/"}
            className="p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <TreeDeciduous className="w-6 h-6 text-emerald-500" />
              Create New Garden Bed
            </h1>
            <p className="text-sm text-zinc-400">
              Organize your plants into a themed collection
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <BotanicalCard className="p-6 relative overflow-hidden">
            <LeafDecoration position="top-right" size="lg" />
            
            <form onSubmit={handleCreateCollection} className="space-y-6 relative z-10">
              {/* Collection Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-emerald-500">
                  <LeafIcon className="w-4 h-4" />
                  Collection Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Tropical Paradise, Herb Garden, Succulents..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                  className="botanical-input w-full text-lg"
                />
                <p className="text-xs text-zinc-500">
                  Choose a descriptive name that reflects the theme of your collection
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-emerald-500">
                  <Sparkles className="w-4 h-4" />
                  Description
                  <span className="text-zinc-500 font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="Describe your collection... What makes it special? What types of plants will it contain?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="botanical-input w-full resize-none"
                />
              </div>

              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-emerald-500">
                  <ImageIcon className="w-4 h-4" />
                  Cover Image
                  <span className="text-zinc-500 font-normal">(optional)</span>
                </label>

                {!previewUrl ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer
                      transition-all duration-200
                      ${
                        isDragActive
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-zinc-700 hover:border-emerald-500/50 hover:bg-zinc-800/50"
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-zinc-100 font-medium">
                          {isDragActive ? "Drop your image here" : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-sm text-zinc-500 mt-1">
                          PNG, JPG, WebP up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-zinc-700">
                    <img
                      src={previewUrl}
                      alt="Thumbnail Preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearThumbnail}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-sm text-white truncate">{thumbnail?.name}</p>
                    </div>
                  </div>
                )}

                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="hidden"
                />
              </div>

              {/* Form Divider */}
              <div className="botanical-divider">
                <LeafIcon className="w-4 h-4" />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">
                  You can add plants after creating the collection
                </p>
                <BotanicalButton
                  type="submit"
                  disabled={!name.trim() || !username || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Create Garden Bed
                    </>
                  )}
                </BotanicalButton>
              </div>
            </form>
          </BotanicalCard>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-emerald-500">
              <Eye className="w-5 h-5" />
              <h2 className="font-medium">Live Preview</h2>
            </div>

            {/* Preview Card */}
            <div className="collection-bed relative overflow-hidden">
              <LeafDecoration position="top-right" size="lg" />
              
              {/* Cover Image Preview */}
              <div className="relative h-40 rounded-xl overflow-hidden mb-4 bg-zinc-800/50">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <TreeDeciduous className="w-12 h-12 text-zinc-700 mx-auto mb-2" />
                      <p className="text-sm text-zinc-600">
                        Cover image preview
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-50" />
              </div>

              {/* Content Preview */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {name || "Untitled Collection"}
                  </h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/15 text-emerald-500">
                    0 plants
                  </span>
                </div>
                
                <p className="text-sm text-zinc-400 line-clamp-2">
                  {description || "No description yet..."}
                </p>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600" />
            </div>

            {/* Tips Card */}
            <BotanicalCard className="p-5">
              <h3 className="flex items-center gap-2 text-emerald-500 font-medium mb-4">
                <Leaf className="w-5 h-5" />
                Tips for Great Collections
              </h3>
              <ul className="space-y-3">
                <TipItem>
                  <strong>Theme it:</strong> Group plants by type, color, care needs, or growing conditions
                </TipItem>
                <TipItem>
                  <strong>Name wisely:</strong> Descriptive names help others discover your collection
                </TipItem>
                <TipItem>
                  <strong>Add context:</strong> Use the description to share what makes your collection special
                </TipItem>
                <TipItem>
                  <strong>Cover image:</strong> A good cover photo makes your collection stand out
                </TipItem>
              </ul>
            </BotanicalCard>

            {/* Inspiration */}
            <div className="text-center py-4">
              <p className="text-sm text-zinc-500">
                Need inspiration? Browse{" "}
                <Link href="/newly-added" className="text-emerald-500 hover:underline">
                  popular collections
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tip Item Component
function TipItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-zinc-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export default NewCollectionPage;
