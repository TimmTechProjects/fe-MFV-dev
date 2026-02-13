"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createPost } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthingClient";
import { useDropzone } from "react-dropzone";
import useAuth from "@/redux/hooks/useAuth";
import Image from "next/image";
import type { PostPrivacy, Post } from "@/types/posts";
import {
  ImagePlus,
  X,
  Loader2,
  Globe,
  Users,
  Lock,
  Leaf,
} from "lucide-react";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated?: (post: Post) => void;
}

export default function CreatePostModal({
  open,
  onOpenChange,
  onPostCreated,
}: CreatePostModalProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState<PostPrivacy>("public");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { startUpload } = useUploadThing("imageUploader");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (imageUrls.length + acceptedFiles.length > 4) {
        toast.error("Maximum 4 images allowed");
        return;
      }
      setIsUploading(true);
      try {
        const result = await startUpload(acceptedFiles);
        if (result) {
          const urls = result.map((r) => r.ufsUrl || r.url);
          setImageUrls((prev) => [...prev, ...urls]);
        }
      } catch {
        toast.error("Failed to upload images");
      } finally {
        setIsUploading(false);
      }
    },
    [startUpload, imageUrls.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
    multiple: true,
    maxSize: 4 * 1024 * 1024,
    maxFiles: 4,
  });

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && imageUrls.length === 0) {
      toast.error("Please add some content or images");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await createPost({
        content: content.trim(),
        images: imageUrls.length > 0 ? imageUrls : undefined,
        privacy,
      });
      if (result.success && result.post) {
        toast.success("Post created!");
        onPostCreated?.(result.post);
        setContent("");
        setImageUrls([]);
        setPrivacy("public");
        onOpenChange(false);
      } else {
        toast.error(result.message || "Failed to create post");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  const privacyOptions = [
    { value: "public", label: "Public", icon: Globe, desc: "Anyone can see" },
    { value: "followers", label: "Followers", icon: Users, desc: "Followers only" },
    { value: "private", label: "Private", icon: Lock, desc: "Only you" },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Leaf className="w-5 h-5 text-emerald-500" />
            Create Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.username || ""}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {user?.firstName} {user?.lastName}
              </p>
              <Select
                value={privacy}
                onValueChange={(v) => setPrivacy(v as PostPrivacy)}
              >
                <SelectTrigger className="w-fit h-7 text-xs bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                  {privacyOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-zinc-900 dark:text-zinc-100">
                      <span className="flex items-center gap-2">
                        <opt.icon className="w-3.5 h-3.5" />
                        {opt.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's growing in your garden?"
            rows={4}
            className="resize-none bg-transparent border-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:ring-0 text-base"
          />

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden aspect-square">
                  <Image
                    src={url}
                    alt={`Upload ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {imageUrls.length < 4 && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
                isDragActive
                  ? "border-emerald-500 bg-emerald-500/5"
                  : "border-zinc-300 dark:border-zinc-700 hover:border-emerald-500/50"
              }`}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <div className="flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <ImagePlus className="w-4 h-4" />
                  <span className="text-sm">
                    Add photos (up to {4 - imageUrls.length})
                  </span>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading || (!content.trim() && imageUrls.length === 0)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              "Share Post"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
