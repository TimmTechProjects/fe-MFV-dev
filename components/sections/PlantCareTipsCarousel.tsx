"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Droplets, Sun, Wind, Snowflake, CircleDot, Leaf, Thermometer } from "lucide-react";

const CARE_TIPS = [
  {
    icon: Droplets,
    title: "Watering Basics",
    description:
      "Most plants prefer soil to dry slightly between waterings. Overwatering is the #1 cause of plant death. Check soil moisture before watering.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Sun,
    title: "Light Needs",
    description:
      "Know your plant's light requirements. South-facing windows provide bright light, north-facing give low light. Rotate plants for even growth.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Wind,
    title: "Humidity Matters",
    description:
      "Tropical plants thrive in 50-60% humidity. Group plants together or use a humidifier to create a micro-climate they'll love.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Snowflake,
    title: "Seasonal Adjustments",
    description:
      "Plants grow slower in winter. Reduce watering and fertilizing during dormant months. Resume regular care when spring arrives.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: CircleDot,
    title: "Drainage is Key",
    description:
      "Always use pots with drainage holes to prevent root rot. Add perlite or pumice to soil mix for better aeration and drainage.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Thermometer,
    title: "Temperature Control",
    description:
      "Most houseplants prefer 65-75°F (18-24°C). Keep plants away from cold drafts and heating vents for consistent growth.",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    icon: Leaf,
    title: "Fertilizing Tips",
    description:
      "Feed plants during the growing season (spring/summer) with balanced fertilizer. Always dilute to half strength to avoid burn.",
    color: "text-[#81a308]",
    bg: "bg-[#81a308]/10",
  },
];

export default function PlantCareTipsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white dark:bg-[#0a0a0a] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-[#81a308]" />
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Plant Care Tips
            </h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-[#81a308]/50 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-[#81a308]/50 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CARE_TIPS.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.title}
                className="min-w-[260px] max-w-[280px] flex-shrink-0 snap-start"
              >
                <div className="rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-[#81a308]/30">
                  <div
                    className={`w-12 h-12 rounded-xl ${tip.bg} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${tip.color}`} />
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">
                    {tip.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
