"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plant } from "@/types/plants";
import { UserResult } from "@/types/users";
import { Collection } from "@/types/collections";
import { Badge } from "../ui/badge";

interface ResultsCardProps {
  plant?: Plant;
  user?: UserResult;
  album?: Collection;
  compact?: boolean;
  imageHeight?: number;
}

const fallbackImg = "/fallback.png";

const ResultsCard = ({
  plant,
  user,
  album,
  imageHeight,
  compact = false,
}: ResultsCardProps) => {
  if (!plant && !user && !album) return null;

  const isPlant = !!plant;
  const isUser = !!user;
  // const isAlbum = !!album;

  // Build href based on type
  const href = isPlant
    ? `/profiles/${plant!.user.username}/collections/${plant.collection}/${
        plant.slug
      }`
    : isUser
    ? `/profiles/${user!.username}`
    : `/profiles/${album!.user.username}/collections/${album!.slug}`;

  // Image source
  const [imgSrc, setImgSrc] = useState(
    isPlant
      ? plant!.images?.[0]?.url || fallbackImg
      : isUser
      ? user!.avatarUrl || fallbackImg
      : album!.coverImage || fallbackImg
  );

  // Alt text
  const altText = isPlant
    ? plant!.commonName ?? "Unknown Plant"
    : isUser
    ? user!.username ?? "User"
    : album!.name ?? "Album";

  // Rounded style
  const roundedStyle = isUser ? "rounded-full" : "rounded-xl";

  return (
    <Link href={href} className="group">
      <div
        className={`${
          compact
            ? "flex items-center gap-3  text-white bg-[#2b2a2a] rounded-md hover:bg-[#3a3a3a]"
            : "flex flex-col w-full max-w-7xl gap-2 mb-5 bg-[#2b2a2a] rounded-2xl p-5"
        } cursor-pointer shadow-lg shadow-black/30 hover:shadow-xl transition-shadow duration-200 ease-in-out`}
      >
        {/* Image */}
        <div className="flex justify-center">
          <Image
            src={imgSrc}
            alt={altText}
            width={compact ? 100 : 200}
            height={compact ? 100 : 200}
            className={`${roundedStyle} object-cover flex-shrink-0 ${
              compact ? "h-[100px] w-[100px]" : "h-[200px] w-full max-w-[200px]"
            }`}
            onError={() => setImgSrc(fallbackImg)}
          />
        </div>

        {/* Text Content */}
        <div className="flex flex-col pt-4 overflow-hidden w-full">
          {isPlant ? (
            <>
              <div className="flex flex-col gap-1 pointer-events-none">
                <h2
                  className={`${
                    compact ? "text-sm" : "text-2xl"
                  } text-[#81a308]`}
                >
                  {plant!.commonName}
                </h2>
                <h3 className={`${compact ? "text-xs" : "text-base"}`}>
                  {plant!.botanicalName}
                </h3>
              </div>

              {!compact && (
                <div
                  className="text-sm mt-2 prose prose-invert max-w-none line-clamp-3 pointer-events-none"
                  dangerouslySetInnerHTML={{ __html: plant!.description }}
                ></div>
              )}

              {/* Tags for plants only */}
              {plant!.tags && plant!.tags.length > 0 && (
                <div
                  className="flex flex-wrap gap-2 mt-3"
                  style={{
                    maxWidth: "100%",
                    overflow: "hidden",
                  }}
                >
                  {plant!.tags.slice(0, 3).map((tag, i) => (
                    <Link
                      href={`/the-vault/results?tag=${encodeURIComponent(
                        tag.name
                      )}`}
                      key={i}
                      tabIndex={-1}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Badge
                        variant="secondary"
                        className="text-[12px] px-2 py-0.5 max-w-[90px] truncate hover:bg-[#5f9f6a] hover:rounded-2xl hover:text-white"
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : isUser ? (
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Image
                  src={imgSrc}
                  alt={altText}
                  width={compact ? 48 : 80}
                  height={compact ? 48 : 80}
                  className={`rounded-full object-cover ${
                    compact ? "h-12 w-12" : "h-20 w-20"
                  }`}
                  onError={() => setImgSrc(fallbackImg)}
                />
              </div>
              <div className="flex flex-col">
                <p
                  className={`${
                    compact ? "text-sm" : "text-2xl font-semibold"
                  } text-[#dab9df]`}
                >
                  {user!.username}
                </p>
                {!compact && (
                  <p className="text-sm mt-1 text-gray-400">
                    {user!.firstName} {user!.lastName}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              <p
                className={`${
                  compact ? "text-sm" : "text-2xl font-semibold"
                } text-[#dab9df]`}
              >
                {album!.name}
              </p>
              {!compact && album?.description && (
                <p className="text-sm mt-1 pointer-events-none line-clamp-3">
                  {album?.description}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ResultsCard;
