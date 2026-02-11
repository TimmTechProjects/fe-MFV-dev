"use client";

import React, { useEffect, useRef, useState } from "react";
import { Trait, TraitCategory } from "@/types/plants";
import { fetchTraitsGrouped } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

interface TraitSelectorProps {
  selectedTraitIds: string[];
  onChange: (traitIds: string[]) => void;
}

const CATEGORY_LABELS: Record<TraitCategory, string> = {
  BLOOMING_LIFECYCLE: "Blooming & Lifecycle",
  ENVIRONMENT_GROWTH: "Environment & Growth",
  USE_ORIGIN: "Use & Origin",
};

const CATEGORY_ORDER: TraitCategory[] = [
  "BLOOMING_LIFECYCLE",
  "ENVIRONMENT_GROWTH",
  "USE_ORIGIN",
];

const TraitSelector = ({ selectedTraitIds, onChange }: TraitSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [grouped, setGrouped] = useState<Record<string, Trait[]>>({});
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTraitsGrouped().then((data) => {
      setGrouped(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTrait = (traitId: string) => {
    if (selectedTraitIds.includes(traitId)) {
      onChange(selectedTraitIds.filter((id) => id !== traitId));
    } else {
      onChange([...selectedTraitIds, traitId]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const allTraits = CATEGORY_ORDER.flatMap((cat) => grouped[cat] || []);
  const selectedNames = allTraits
    .filter((t) => selectedTraitIds.includes(t.id))
    .map((t) => t.name);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-transparent border border-border rounded-md text-white hover:bg-[#2b2a2a] transition-colors"
      >
        <span className="truncate">
          {selectedTraitIds.length > 0
            ? `Selected: ${selectedTraitIds.length}`
            : "Select secondary traits..."}
        </span>
        <ChevronDown
          className={`ml-2 h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 z-50 w-full min-w-[600px] bg-[#1e1e1e] border border-border rounded-lg shadow-xl">
          {loading ? (
            <div className="p-4 text-center text-sm text-zinc-400">Loading traits...</div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-0 divide-x divide-border">
                {CATEGORY_ORDER.map((category) => (
                  <div key={category} className="p-3">
                    <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-2">
                      {CATEGORY_LABELS[category]}
                    </h4>
                    <div className="space-y-1.5">
                      {(grouped[category] || []).map((trait) => (
                        <label
                          key={trait.id}
                          className="flex items-center gap-2 cursor-pointer text-sm text-white hover:text-emerald-400 transition-colors py-0.5"
                        >
                          <Checkbox
                            checked={selectedTraitIds.includes(trait.id)}
                            onCheckedChange={() => toggleTrait(trait.id)}
                            className="border-zinc-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                          />
                          <span>{trait.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {selectedTraitIds.length > 0 && (
                <div className="flex items-center justify-between px-3 py-2 border-t border-border">
                  <span className="text-xs text-zinc-400 truncate max-w-[80%]">
                    {selectedNames.join(", ")}
                  </span>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs text-red-400 hover:text-red-300 shrink-0 ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TraitSelector;
