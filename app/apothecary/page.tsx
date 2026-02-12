"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Leaf,
  Heart,
  AlertTriangle,
  Droplets,
  Sun,
  BookOpen,
  Pill,
  Flower2,
  ChevronRight,
  Loader2,
  Sparkles,
  Shield,
} from "lucide-react";

interface MedicinalPlant {
  id: string;
  name: string;
  scientificName: string;
  image?: string;
  category: string;
  uses: string[];
  safetyLevel: "safe" | "caution" | "warning";
}

const SAMPLE_PLANTS: MedicinalPlant[] = [
  { id: "1", name: "Lavender", scientificName: "Lavandula angustifolia", category: "Calming", uses: ["Anxiety", "Sleep", "Headaches"], safetyLevel: "safe" },
  { id: "2", name: "Chamomile", scientificName: "Matricaria chamomilla", category: "Digestive", uses: ["Digestion", "Sleep", "Inflammation"], safetyLevel: "safe" },
  { id: "3", name: "Echinacea", scientificName: "Echinacea purpurea", category: "Immune", uses: ["Cold prevention", "Immune support"], safetyLevel: "safe" },
  { id: "4", name: "Peppermint", scientificName: "Mentha piperita", category: "Digestive", uses: ["Nausea", "Headaches", "Congestion"], safetyLevel: "safe" },
  { id: "5", name: "Valerian", scientificName: "Valeriana officinalis", category: "Calming", uses: ["Insomnia", "Anxiety"], safetyLevel: "caution" },
  { id: "6", name: "Turmeric", scientificName: "Curcuma longa", category: "Anti-inflammatory", uses: ["Inflammation", "Joint pain", "Digestion"], safetyLevel: "safe" },
  { id: "7", name: "St. John's Wort", scientificName: "Hypericum perforatum", category: "Mood", uses: ["Depression", "Anxiety", "Nerve pain"], safetyLevel: "warning" },
  { id: "8", name: "Ginger", scientificName: "Zingiber officinale", category: "Digestive", uses: ["Nausea", "Inflammation", "Cold symptoms"], safetyLevel: "safe" },
  { id: "9", name: "Aloe Vera", scientificName: "Aloe barbadensis", category: "Skin", uses: ["Burns", "Skin irritation", "Digestion"], safetyLevel: "safe" },
  { id: "10", name: "Elderberry", scientificName: "Sambucus nigra", category: "Immune", uses: ["Cold & flu", "Immune support", "Antioxidant"], safetyLevel: "caution" },
  { id: "11", name: "Rosemary", scientificName: "Rosmarinus officinalis", category: "Cognitive", uses: ["Memory", "Circulation", "Hair growth"], safetyLevel: "safe" },
  { id: "12", name: "Ashwagandha", scientificName: "Withania somnifera", category: "Adaptogen", uses: ["Stress", "Energy", "Sleep"], safetyLevel: "caution" },
];

const CATEGORIES = ["All", "Calming", "Digestive", "Immune", "Anti-inflammatory", "Mood", "Skin", "Cognitive", "Adaptogen"];

const AILMENTS = [
  { name: "Anxiety & Stress", icon: Heart, color: "text-purple-400 bg-purple-500/10" },
  { name: "Sleep Issues", icon: Sun, color: "text-blue-400 bg-blue-500/10" },
  { name: "Digestive Health", icon: Droplets, color: "text-green-400 bg-green-500/10" },
  { name: "Immune Support", icon: Shield, color: "text-amber-400 bg-amber-500/10" },
  { name: "Pain & Inflammation", icon: AlertTriangle, color: "text-red-400 bg-red-500/10" },
  { name: "Skin Care", icon: Flower2, color: "text-pink-400 bg-pink-500/10" },
];

const SAFETY_BADGE: Record<string, { label: string; color: string }> = {
  safe: { label: "Generally Safe", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  caution: { label: "Use with Caution", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  warning: { label: "Consult Professional", color: "text-red-400 bg-red-500/10 border-red-500/20" },
};

export default function ApothecaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlant, setSelectedPlant] = useState<MedicinalPlant | null>(null);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const filteredPlants = SAMPLE_PLANTS.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.uses.some((u) => u.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || plant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAiSearch = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    await new Promise((r) => setTimeout(r, 1500));
    setAiResponse(
      `Based on your query "${aiQuery}", here are some suggestions:\n\n` +
      `For natural relief, consider these well-studied herbs:\n` +
      `- **Chamomile** - Known for calming properties and digestive support\n` +
      `- **Lavender** - Helpful for anxiety and sleep quality\n` +
      `- **Peppermint** - Effective for headaches and digestive issues\n\n` +
      `**Important:** Always consult with a healthcare professional before starting any herbal remedy, especially if you are taking medications.\n\n` +
      `*AI-powered recommendations will be fully integrated once the backend API is connected.*`
    );
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">The Apothecary</h1>
              <p className="text-sm text-zinc-500">AI-powered medicinal plant encyclopedia</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/5 to-green-500/5 border border-emerald-500/10 rounded-2xl p-1 mb-6">
          <div className="bg-white/50 dark:bg-zinc-900/80 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Ask AI about medicinal plants</h2>
            </div>
            <div className="flex gap-2">
              <Input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="e.g. What herbs help with anxiety?"
                onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
                className="flex-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
              />
              <Button onClick={handleAiSearch} disabled={aiLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
            {aiResponse && (
              <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {aiResponse}
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 mb-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-700 dark:text-yellow-400">
              <strong>Disclaimer:</strong> Information provided is for educational purposes only. Always consult a qualified healthcare professional before using herbal remedies.
            </p>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Browse by Ailment</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
          {AILMENTS.map((ailment) => {
            const AilmentIcon = ailment.icon;
            return (
              <button
                key={ailment.name}
                onClick={() => setSearchQuery(ailment.name.split(" ")[0])}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ailment.color}`}>
                  <AilmentIcon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400 text-center">{ailment.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plants, ailments..."
              className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {selectedPlant ? (
          <div className="bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <button
              onClick={() => setSelectedPlant(null)}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-4 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to list
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{selectedPlant.name}</h2>
                <p className="text-sm text-zinc-500 italic">{selectedPlant.scientificName}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{selectedPlant.category}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${SAFETY_BADGE[selectedPlant.safetyLevel].color}`}>
                    {SAFETY_BADGE[selectedPlant.safetyLevel].label}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Common Uses</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlant.uses.map((use) => (
                    <span key={use} className="text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">{use}</span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Preparation Methods</h3>
                </div>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>Tea / Infusion</li>
                  <li>Tincture</li>
                  <li>Essential Oil (topical)</li>
                  <li>Capsule / Supplement</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Growing Conditions</h3>
                </div>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>Full sun to partial shade</li>
                  <li>Well-draining soil</li>
                  <li>Moderate watering</li>
                  <li>Hardy in zones 5-9</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Safety & Warnings</h3>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  May interact with certain medications. Consult your healthcare provider before use, especially if pregnant, nursing, or taking prescription drugs.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredPlants.length === 0 ? (
              <div className="col-span-full flex flex-col items-center py-12 text-center">
                <Leaf className="w-10 h-10 text-zinc-400 mb-3" />
                <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">No plants found</h3>
                <p className="text-sm text-zinc-500">Try a different search term or category</p>
              </div>
            ) : (
              filteredPlants.map((plant) => (
                <button
                  key={plant.id}
                  onClick={() => setSelectedPlant(plant)}
                  className="text-left p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors">{plant.name}</h3>
                      <p className="text-[10px] text-zinc-500 italic">{plant.scientificName}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {plant.uses.slice(0, 3).map((use) => (
                      <span key={use} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">{use}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{plant.category}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${SAFETY_BADGE[plant.safetyLevel].color}`}>
                      {SAFETY_BADGE[plant.safetyLevel].label}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
