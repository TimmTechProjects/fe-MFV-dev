"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createForumThread } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const DEFAULT_CATEGORIES = [
  { slug: "general", name: "General Discussion" },
  { slug: "plant-care", name: "Plant Care" },
  { slug: "identification", name: "Plant Identification" },
  { slug: "pests-diseases", name: "Pests & Diseases" },
  { slug: "propagation", name: "Propagation" },
  { slug: "show-tell", name: "Show & Tell" },
  { slug: "marketplace-talk", name: "Marketplace Talk" },
  { slug: "tips-tricks", name: "Tips & Tricks" },
];

interface CreateThreadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onThreadCreated?: () => void;
  defaultCategory?: string;
}

export default function CreateThreadModal({
  open,
  onOpenChange,
  onThreadCreated,
  defaultCategory,
}: CreateThreadModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(defaultCategory || "");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const result = await createForumThread({
      title: title.trim(),
      content: content.trim(),
      category,
      tags: tagList.length > 0 ? tagList : undefined,
    });

    if (result.success) {
      toast.success("Thread created!");
      setTitle("");
      setContent("");
      setCategory(defaultCategory || "");
      setTags("");
      onOpenChange(false);
      onThreadCreated?.();
    } else {
      toast.error(result.message || "Failed to create thread");
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-white">New Discussion Thread</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <Input
              placeholder="Thread title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
              maxLength={200}
            />
          </div>

          <div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                {DEFAULT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug} className="text-zinc-900 dark:text-white">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Textarea
              placeholder="Write your discussion..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white resize-none"
            />
          </div>

          <div>
            <Input
              placeholder="Tags (comma separated, optional)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !title.trim() || !content.trim() || !category}
              className="bg-[#81a308] hover:bg-[#6c8a0a] text-white"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Post Thread
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
