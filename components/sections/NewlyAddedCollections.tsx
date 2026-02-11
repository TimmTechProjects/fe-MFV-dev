import Link from "next/link";
import { Button } from "@/components/ui/button";
import PlantCarousel from "./PlantCarousel";

export default function NewCollectionsSection() {
  return (
    <div className="w-full bg-gray-50 dark:bg-[#121212] text-zinc-900 dark:text-white py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Heading and View All Button */}
        <div className="flex items-center justify-between px-4">
          <Link href="/the-vault">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white cursor-pointer">
              Newly Added Plants
            </h2>
          </Link>

          <Link href="/plants">
            <Button className="bg-[#81a308] text-white font-medium py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-[20px] uppercase text-[10px] sm:text-xs tracking-wide">
              Discover All Plants
            </Button>
          </Link>
        </div>

        {/* Carousel Section */}
        <div className="px-4">
          <PlantCarousel />
        </div>
      </div>
    </div>
  );
}
