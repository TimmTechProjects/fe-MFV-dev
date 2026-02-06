"use client";

import Image from "next/image";
import { useState } from "react";
import { Plant } from "@/types/plants";

export default function PlantImageGallery({
  images,
  alt,
}: {
  images: Plant["images"];
  alt: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = images[selectedIndex] || { url: "/fallback.png" };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-full max-w-full rounded-xl overflow-hidden flex items-center justify-center group cursor-zoom-in">
        <img
          src={selectedImage.url}
          alt={alt}
          className="object-contain bg-zinc-800 max-h-[450px] w-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto mt-2 max-w-full pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:opacity-100 ${
                selectedIndex === i
                  ? "border-emerald-500 shadow-lg shadow-emerald-500/20 opacity-100"
                  : "border-transparent opacity-70"
              }`}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${i + 1}`}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
