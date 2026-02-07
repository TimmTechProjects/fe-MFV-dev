"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Camera,
  Upload,
  Trash2,
  Loader2,
  ImageIcon,
  RotateCcw,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  uploadCollectionCover,
  deleteCollectionCover,
  setCollectionThumbnail,
} from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthingClient";

type Tab = "upload" | "album" | "auto";

interface PlantImage {
  id: string;
  url: string;
  plantName?: string;
}

interface CoverImageUploadModalProps {
  collectionId: string;
  currentCoverUrl?: string | null;
  plantImages: PlantImage[];
}

const CoverImageUploadModal = ({
  collectionId,
  currentCoverUrl,
  plantImages,
}: CoverImageUploadModalProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAlbumImageId, setSelectedAlbumImageId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    maxSize: 4 * 1024 * 1024,
  });

  const handleUploadNew = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const uploadResult = await startUpload([selectedFile]);
      if (!uploadResult || uploadResult.length === 0) {
        toast.error("Failed to upload image");
        return;
      }

      const { ufsUrl, key } = uploadResult[0];
      const result = await uploadCollectionCover(collectionId, ufsUrl, key);

      if (result.success) {
        toast.success("Cover image updated!");
        closeAndReset();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload cover image");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePickFromAlbum = async () => {
    if (!selectedAlbumImageId) return;

    setIsSaving(true);
    try {
      const result = await setCollectionThumbnail(collectionId, selectedAlbumImageId);
      if (result.success) {
        toast.success("Cover updated from album!");
        closeAndReset();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Set thumbnail error:", err);
      toast.error("Failed to set cover from album");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUseAuto = async () => {
    setIsSaving(true);
    try {
      const result = await deleteCollectionCover(collectionId);
      if (result.success) {
        toast.success("Reverted to auto cover");
        closeAndReset();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Revert error:", err);
      toast.error("Failed to revert cover");
    } finally {
      setIsSaving(false);
    }
  };

  const closeAndReset = () => {
    setOpen(false);
    setPreview(null);
    setSelectedFile(null);
    setSelectedAlbumImageId(null);
    setActiveTab("upload");
    router.refresh();
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setPreview(null);
      setSelectedFile(null);
      setSelectedAlbumImageId(null);
      setActiveTab("upload");
    }
  };

  const isLoading = isUploading || isSaving;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "upload", label: "Upload New", icon: <Upload className="w-4 h-4" /> },
    { key: "album", label: "From Album", icon: <ImageIcon className="w-4 h-4" /> },
    { key: "auto", label: "Use Auto", icon: <RotateCcw className="w-4 h-4" /> },
  ];

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="rounded-2xl text-black hover:text-black bg-gray-300 hover:bg-white"
        onClick={() => setOpen(true)}
      >
        <Camera className="w-4 h-4 mr-1.5" />
        Change Cover
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg bg-zinc-900 border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Collection Cover Image</DialogTitle>
          </DialogHeader>

          <div className="flex gap-1 p-1 bg-zinc-800 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[220px]">
            {activeTab === "upload" && (
              <div className="space-y-4">
                {preview ? (
                  <div className="relative rounded-xl overflow-hidden border border-zinc-700">
                    <Image
                      src={preview}
                      alt="Cover preview"
                      width={450}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => {
                        setPreview(null);
                        setSelectedFile(null);
                      }}
                      disabled={isLoading}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className={`flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                      isDragActive
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-zinc-600 hover:border-emerald-500/50 hover:bg-zinc-800/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                    {isDragActive ? (
                      <p className="text-emerald-400 text-sm">Drop your image here...</p>
                    ) : (
                      <>
                        <p className="text-zinc-300 text-sm">
                          Drag & drop an image, or click to browse
                        </p>
                        <p className="text-zinc-500 text-xs mt-1">Max 4MB</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "album" && (
              <div className="space-y-3">
                {plantImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-zinc-400">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                    <p className="text-sm">No plant images in this album yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                    {plantImages.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedAlbumImageId(img.id)}
                        disabled={isLoading}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedAlbumImageId === img.id
                            ? "border-emerald-500 ring-2 ring-emerald-500/30"
                            : "border-zinc-700 hover:border-zinc-500"
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={img.plantName || "Plant image"}
                          fill
                          className="object-cover"
                        />
                        {selectedAlbumImageId === img.id && (
                          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                        {img.plantName && (
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-1 py-0.5">
                            <p className="text-[10px] text-white truncate">{img.plantName}</p>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "auto" && (
              <div className="flex flex-col items-center justify-center h-48 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <RotateCcw className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="text-zinc-300 text-sm font-medium">
                    Use Auto Cover
                  </p>
                  <p className="text-zinc-500 text-xs mt-1 max-w-xs">
                    Removes any custom cover and automatically uses the first plant&apos;s
                    image as the collection cover.
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {activeTab === "upload" && (
              <Button
                size="sm"
                onClick={handleUploadNew}
                disabled={!selectedFile || isLoading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1.5" />
                    Upload Cover
                  </>
                )}
              </Button>
            )}

            {activeTab === "album" && (
              <Button
                size="sm"
                onClick={handlePickFromAlbum}
                disabled={!selectedAlbumImageId || isLoading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    Set as Cover
                  </>
                )}
              </Button>
            )}

            {activeTab === "auto" && (
              <Button
                size="sm"
                onClick={handleUseAuto}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Reverting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-1.5" />
                    Revert to Auto
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CoverImageUploadModal;
