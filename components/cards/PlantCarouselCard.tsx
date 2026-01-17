import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Plant } from "@/types/plants";
import fallback from "../../public/fallback.png";

interface PlantCarouselCardProps {
  plant: Plant;
}

const PlantCarouselCard = ({ plant }: PlantCarouselCardProps) => {
  const [imgError, setImgError] = useState(false);
  const mainImgSrc = plant.images?.[0]?.url;
  const imgSrc = !imgError && mainImgSrc ? mainImgSrc : fallback;

  return (
    <div className="group relative w-full h-full">
      {/* Main Card Container */}
      <div className="relative overflow-hidden rounded-2xl bg-black/20 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
          <Link
            href={
              plant.user?.username
                ? `/profiles/${plant.user.username}/collections/${plant.collectionId}/${plant.slug}`
                : "#"
            }
            className="block relative"
          >
            <Image
              src={imgSrc}
              alt={plant.commonName || plant.botanicalName}
              width={400}
              height={300}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* Tags Overlay on Image */}
          {plant?.tags?.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[calc(100%-1.5rem)]">
              {plant.tags.slice(0, 2).map((tag, i) => (
                <Link
                  key={i}
                  href={`/the-vault/results?tag=${encodeURIComponent(
                    tag.name
                  )}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-white/90 text-gray-800 backdrop-blur-sm hover:bg-[#81a308] hover:text-white transition-all duration-200 border-0 shadow-sm max-w-[100px] truncate"
                  >
                    {tag.name}
                  </Badge>
                </Link>
              ))}
              {plant.tags.length > 2 && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-white/90 text-gray-600 backdrop-blur-sm border-0 shadow-sm"
                >
                  +{plant.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-2 flex-1 flex flex-col">
          <Link
            href={
              plant.user?.username
                ? `/profiles/${plant.user.username}/collections/${plant.collection}/${plant.slug}`
                : "#"
            }
            className="block group/content flex-1"
          >
            {/* Plant Names */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 group-hover/content:text-green-400 transition-colors duration-200">
                {plant.commonName || plant.botanicalName}
              </h3>
              {plant.commonName && plant.botanicalName && (
                <p className="text-sm font-medium text-gray-300 italic">
                  {plant.botanicalName}
                </p>
              )}
            </div>

            {/* Description */}
            {plant.description && (
              <p className="text-sm text-gray-400 line-clamp-2 mt-2 leading-relaxed">
                {plant.description.replace(/<[^>]*>/g, "").slice(0, 120)}
                {plant.description.replace(/<[^>]*>/g, "").length > 120 &&
                  "..."}
              </p>
            )}
          </Link>

          {/* Bottom Tags (if more than 2 tags) */}
          {plant?.tags?.length > 2 && (
            <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-700 mt-auto">
              {plant.tags.slice(2, 5).map((tag, i) => (
                <Link
                  key={i}
                  href={`/the-vault/results?tag=${encodeURIComponent(
                    tag.name
                  )}`}
                >
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0.5 text-gray-300 border-gray-600 hover:bg-[#81a308] hover:border-green-500 hover:text-white transition-all duration-200 max-w-[80px] truncate"
                  >
                    {tag.name}
                  </Badge>
                </Link>
              ))}
              {plant.tags.length > 5 && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 text-gray-400 border-gray-600"
                >
                  +{plant.tags.length - 5}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantCarouselCard;
