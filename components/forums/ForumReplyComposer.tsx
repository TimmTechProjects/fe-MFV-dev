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
import { ForumReply } from "@/types/forums";
import { X, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface ForumReplyComposerProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  onCancelQuote?: () => void;
  quotedReply?: ForumReply | null;
  initialContent?: string;
  submitLabel?: string;
  placeholder?: string;
}

export const ForumReplyComposer: React.FC<ForumReplyComposerProps> = ({
  onSubmit,
  onCancel,
  onCancelQuote,
  quotedReply,
  initialContent = "",
  submitLabel = "Post Reply",
  placeholder = "Write your reply...",
}) => {
  const [content, setContent] = useState(initialContent);

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
    content: initialContent,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-invert prose-sm max-w-none",
          "px-4 py-3 min-h-[200px] focus:outline-none",
          "bg-[#0f1419] text-white rounded-lg"
        ),
      },
    },
  });

  const handleSubmit = () => {
    if (content.trim() && content !== "<p></p>") {
      onSubmit(content);
      editor?.commands.clearContent();
      setContent("");
    }
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

  if (!editor) return null;

  return (
    <div className="bg-[#1a1d2d] border border-[#2c2f38] rounded-lg overflow-hidden">
      {/* Quoted Reply Banner */}
      {quotedReply && (
        <div className="bg-[#0f1419] border-b border-[#2c2f38] p-3 flex items-start gap-3">
          <Quote className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-400 mb-1">
              Quoting {quotedReply.author.username}:
            </p>
            <div
              className="prose prose-invert prose-sm max-w-none text-gray-500 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: quotedReply.content }}
            />
          </div>
          <button
            onClick={onCancelQuote}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="border-b border-[#2c2f38] p-3">
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
      <div className="p-4">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>

      {/* Actions */}
      <div className="border-t border-[#2c2f38] p-4 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || content === "<p></p>"}
          className="px-6 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};
