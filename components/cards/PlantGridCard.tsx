"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plant } from "@/types/plants";

interface PlantGridCardProps {
  plant: Plant & {
    user?: { username: string };
    originalCollection?: { slug: string };
  };
}

const PlantGridCard = ({ plant }: PlantGridCardProps) => {
  const mainImage = plant.images?.[0]?.url ?? "/fallback.png";
  const author = plant.user?.username;
  const originalSlug = plant.originalCollection?.slug;
  const plantUrl = `/profiles/${author}/collections/${originalSlug}/${plant.slug}`;

  const plainDescription = plant.description
    ? plant.description.replace(/<[^>]+>/g, "").slice(0, 120)
    : "";

  return (
    <Link href={plantUrl} className="block">
      <div className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
        <Image
          src={mainImage}
          alt={plant.commonName || "Plant image"}
          fill
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/5 group-hover:h-2/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all duration-300" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-semibold text-white text-lg truncate">
            {plant.commonName || plant.botanicalName}
          </h3>
          <p className="text-emerald-400/70 text-sm italic truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-0.5">
            {plant.botanicalName}
          </p>
          {plainDescription && (
            <p className="text-zinc-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
              {plainDescription}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PlantGridCard;
