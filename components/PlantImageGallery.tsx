"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { Plant } from "@/types/plants";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

export default function PlantImageGallery({
  images,
  alt,
}: {
  images: Plant["images"];
  alt: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  const selectedImage = images[selectedIndex] || { url: "/fallback.png" };

  const goNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const openLightbox = () => {
    setLightboxOpen(true);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!lightboxOpen) return;
      e.preventDefault();
      if (e.deltaY < 0) {
        setZoom((prev) => Math.min(prev + 0.25, 5));
      } else {
        setZoom((prev) => {
          const next = Math.max(prev - 0.25, 1);
          if (next === 1) setPan({ x: 0, y: 0 });
          return next;
        });
      }
    },
    [lightboxOpen]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { x: pan.x, y: pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, goNext, goPrev]);

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [selectedIndex]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="relative h-full max-w-full rounded-xl overflow-hidden flex items-center justify-center group">
          <img
            src={selectedImage.url}
            alt={alt}
            onClick={openLightbox}
            className="object-contain bg-zinc-800 max-h-[450px] w-full transition-transform duration-500 group-hover:scale-105 cursor-pointer"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
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

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative bg-zinc-900 border border-zinc-700/50 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/50 bg-zinc-900/80">
              <div className="flex items-center gap-1 text-sm text-zinc-400">
                {images.length > 1 && (
                  <span>{selectedIndex + 1} / {images.length}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 1}
                  className="p-2 rounded-lg hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-zinc-300 text-sm min-w-[3.5rem] text-center tabular-nums">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 5}
                  className="p-2 rounded-lg hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={closeLightbox}
                className="p-2 rounded-lg hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="relative flex-1 flex items-center justify-center overflow-hidden bg-zinc-950 min-h-0"
              onWheel={handleWheel}
            >
              {images.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition z-10 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition z-10 cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div
                className="w-full h-full flex items-center justify-center"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default", minHeight: "60vh" }}
              >
                <img
                  src={selectedImage.url}
                  alt={alt}
                  className="max-w-full max-h-[75vh] object-contain transition-transform duration-200 select-none"
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                  }}
                  draggable={false}
                />
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-zinc-700/50 bg-zinc-900/80">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedIndex(i)}
                    className={`rounded-full transition-all cursor-pointer ${
                      selectedIndex === i
                        ? "w-6 h-2.5 bg-emerald-500"
                        : "w-2.5 h-2.5 bg-zinc-600 hover:bg-zinc-500"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
