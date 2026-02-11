"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function CollapsibleSection({
  title,
  icon,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:pointer-events-none w-full flex items-center justify-between"
      >
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-zinc-400 lg:hidden transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div className={`${isOpen ? "block" : "hidden"} lg:block mt-4`}>
        {children}
      </div>
    </div>
  );
}
