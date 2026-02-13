"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera, Upload, Trash2, Loader2, User as UserIcon, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { uploadProfileImage, uploadBannerImage } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthingClient";

interface ProfileImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  type: "profile" | "banner";
  currentImageUrl?: string | null;
}

const ProfileImageUploadModal = ({
  open,
  onOpenChange,
  username,
  type,
  currentImageUrl,
}: ProfileImageUploadModalProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader");

  const maxSize = 5 * 1024 * 1024; // 5MB

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: { errors?: { code?: string }[] }[]) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors?.[0]?.code === "file-too-large") {
        toast.error("File is too large. Maximum size is 5MB.");
      } else {
        toast.error("Invalid file. Please select a valid image.");
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      if (file.size > maxSize) {
        toast.error("File is too large. Maximum size is 5MB.");
        return;
      }

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: false,
    maxSize,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const uploadResult = await startUpload([selectedFile]);
      if (!uploadResult || uploadResult.length === 0) {
        toast.error("Failed to upload image");
        return;
      }

      const { url: ufsUrl, key } = uploadResult[0];

      const result = type === "profile"
        ? await uploadProfileImage(username, ufsUrl, key)
        : await uploadBannerImage(username, ufsUrl, key);

      if (result.success) {
        toast.success(`${type === "profile" ? "Profile picture" : "Banner"} updated successfully!`);
        
        if (type === "profile") {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            localStorage.setItem("user", JSON.stringify({ ...user, avatarUrl: ufsUrl }));
          }
        }
        
        closeAndReset();
      } else {
        toast.error(result.message || "Failed to update image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(`Failed to upload ${type === "profile" ? "profile picture" : "banner"}`);
    } finally {
      setIsUploading(false);
    }
  };

  const closeAndReset = () => {
    setPreview(null);
    setSelectedFile(null);
    onOpenChange(false);
    router.refresh();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !isUploading) {
      setPreview(null);
      setSelectedFile(null);
    }
    onOpenChange(isOpen);
  };

  const title = type === "profile" ? "Update Profile Picture" : "Update Cover Image";
  const description = type === "profile" 
    ? "Upload a new profile picture. Recommended size: 400x400px"
    : "Upload a new cover image. Recommended size: 1200x400px";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-zinc-900 border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            {type === "profile" ? <UserIcon className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            {title}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {preview ? (
            <div className="relative rounded-xl overflow-hidden border border-zinc-700">
              <div className={`relative ${type === "profile" ? "aspect-square max-w-xs mx-auto" : "aspect-[3/1]"}`}>
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                onClick={() => {
                  setPreview(null);
                  setSelectedFile(null);
                }}
                disabled={isUploading}
                className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-full transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                isDragActive
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-zinc-600 hover:border-emerald-500/50 hover:bg-zinc-800/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-zinc-400 mb-3" />
              {isDragActive ? (
                <p className="text-emerald-400 text-sm">Drop your image here...</p>
              ) : (
                <>
                  <p className="text-zinc-300 text-sm text-center px-4">
                    Drag & drop an image, or click to browse
                  </p>
                  <p className="text-zinc-500 text-xs mt-2">
                    Maximum file size: 5MB
                  </p>
                  <p className="text-zinc-500 text-xs">
                    Supported formats: JPG, PNG, WebP
                  </p>
                </>
              )}
            </div>
          )}

          {currentImageUrl && !preview && (
            <div className="pt-2">
              <p className="text-xs text-zinc-500 mb-2">Current {type === "profile" ? "profile picture" : "cover image"}:</p>
              <div className={`relative rounded-lg overflow-hidden border border-zinc-700 ${type === "profile" ? "aspect-square max-w-[150px]" : "aspect-[3/1]"}`}>
                <Image
                  src={currentImageUrl}
                  alt="Current"
                  fill
                  className="object-cover opacity-50"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isUploading}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileImageUploadModal;
