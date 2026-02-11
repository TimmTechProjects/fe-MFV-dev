import Link from "next/link";
import { Button } from "@/components/ui/button";
import PlantCarousel from "./PlantCarousel";

export default function NewCollectionsSection() {
  return (
    <div className="w-full bg-gray-50 dark:bg-[#121212] text-zinc-900 dark:text-white py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Heading and View All Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4">
          <Link href="/the-vault">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white cursor-pointer">
              Newly Added Plants
            </h2>
          </Link>

          <Link href="/plants">
            <Button className="mt-3 sm:mt-0 self-end sm:self-auto bg-[#81a308] text-white font-medium py-1.5 px-3 sm:py-2 sm:px-4 rounded-[20px] uppercase text-xs sm:text-sm tracking-wide">
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
