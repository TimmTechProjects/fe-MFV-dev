"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ForumCategory } from "@/types/forums";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateThreadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    categoryId: string;
    content: string;
    images: File[];
    tags: string[];
  }) => void;
  categories: ForumCategory[];
  defaultCategoryId?: string;
}

export const CreateThreadModal: React.FC<CreateThreadModalProps> = ({
  open,
  onClose,
  onSubmit,
  categories,
  defaultCategoryId,
}) => {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategoryId || "");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({ levels: [2, 3] }),
      Bold,
      Italic,
      Underline,
      Strike,
      Link.configure({ openOnClick: false }),
      BulletList,
      OrderedList,
      ListItem,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-invert prose-sm max-w-none",
          "px-4 py-3 min-h-[300px] focus:outline-none",
          "bg-[#0f1419] text-white rounded-lg"
        ),
      },
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    if (title.trim() && categoryId && content.trim()) {
      onSubmit({
        title: title.trim(),
        categoryId,
        content,
        images,
        tags,
      });
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setTitle("");
    setCategoryId(defaultCategoryId || "");
    setContent("");
    setImages([]);
    setImagePreviews([]);
    setTags([]);
    setTagInput("");
    editor?.commands.clearContent();
  };

  const buttons = [
    {
      label: "H2",
      command: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor?.isActive("heading", { level: 2 }),
    },
    {
      label: "H3",
      command: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor?.isActive("heading", { level: 3 }),
    },
    {
      label: "Bold",
      command: () => editor?.chain().focus().toggleBold().run(),
      active: editor?.isActive("bold"),
    },
    {
      label: "Italic",
      command: () => editor?.chain().focus().toggleItalic().run(),
      active: editor?.isActive("italic"),
    },
    {
      label: "Strike",
      command: () => editor?.chain().focus().toggleStrike().run(),
      active: editor?.isActive("strike"),
    },
    {
      label: "• List",
      command: () => editor?.chain().focus().toggleBulletList().run(),
      active: editor?.isActive("bulletList"),
    },
    {
      label: "1. List",
      command: () => editor?.chain().focus().toggleOrderedList().run(),
      active: editor?.isActive("orderedList"),
    },
    {
      label: "Link",
      command: () => {
        const url = prompt("Enter link URL:");
        if (url) {
          editor
            ?.chain()
            .focus()
            .setLink({ href: url, target: "_blank" })
            .run();
        }
      },
      active: editor?.isActive("link"),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a1d2d] border-[#2c2f38] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Thread
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thread Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title..."
              className="w-full px-4 py-3 bg-[#0f1419] border border-[#2c2f38] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/200 characters
            </p>
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1419] border border-[#2c2f38] rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
            >
              <option value="">Select a category...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content *
            </label>
            {/* Toolbar */}
            <div className="border border-[#2c2f38] rounded-t-lg p-3 bg-[#0f1419]">
              <div className="flex flex-wrap gap-2">
                {buttons.map(({ label, command, active }) => (
                  <button
                    key={label}
                    onClick={command}
                    type="button"
                    className={cn(
                      "text-xs font-medium px-3 py-1.5 rounded transition-all",
                      active
                        ? "bg-green-600 text-white"
                        : "bg-[#2c2f38] text-gray-300 hover:bg-green-500/20 hover:text-green-400"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {/* Editor */}
            <div className="border border-t-0 border-[#2c2f38] rounded-b-lg p-4 bg-[#0f1419]">
              <EditorContent
                editor={editor}
                placeholder="Write your thread content..."
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Images (Optional)
            </label>
            <div className="border-2 border-dashed border-[#2c2f38] rounded-lg p-6 text-center hover:border-green-500/50 transition-colors">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-400">
                  Click to upload images or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTag()}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-2 bg-[#0f1419] border border-[#2c2f38] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
              />
              <button
                onClick={addTag}
                type="button"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#2c2f38] text-green-400 rounded-full text-sm flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2c2f38]">
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !categoryId || !content.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Create Thread
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
