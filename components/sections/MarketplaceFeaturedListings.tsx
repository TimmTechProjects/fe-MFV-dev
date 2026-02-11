"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Gavel, Tag } from "lucide-react";
import { getMarketplaceListings } from "@/lib/utils";
import { MarketplaceListing } from "@/types/marketplace";

function formatTimeLeft(endDate: string): string {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end.getTime() - now.getTime();
  if (diffMs <= 0) return "Ended";
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

export default function MarketplaceFeaturedListings() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarketplaceListings({ limit: 6, sort: "newest" })
      .then((data) => setListings(data.listings.filter((l) => l.status === "active")))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white dark:bg-[#0a0a0a] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <ShoppingCart className="w-6 h-6 text-[#81a308]" />
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Featured Marketplace Listings
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-gray-100 dark:bg-zinc-900 animate-pulse h-[280px]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return (
      <section className="w-full bg-white dark:bg-[#0a0a0a] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-[#81a308]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                Featured Marketplace Listings
              </h2>
            </div>
            <Link
              href="/marketplace"
              className="bg-[#81a308] hover:bg-[#6c8a0a] text-white font-medium py-2 px-4 sm:py-2.5 sm:px-6 rounded-full text-xs sm:text-sm uppercase tracking-wide transition-all hover:shadow-lg hover:shadow-[#81a308]/25"
            >
              Browse Marketplace
            </Link>
          </div>
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Marketplace Coming Soon
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              Buy, sell, and auction plants with fellow collectors. Be the first to list your plants!
            </p>
            <Link
              href="/marketplace"
              className="inline-block mt-6 bg-[#81a308] hover:bg-[#6c8a0a] text-white font-medium py-2 px-4 sm:py-2.5 sm:px-6 rounded-full text-xs sm:text-sm transition-all hover:shadow-lg hover:shadow-[#81a308]/25"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white dark:bg-[#0a0a0a] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-[#81a308]" />
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Featured Marketplace Listings
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="bg-[#81a308] hover:bg-[#6c8a0a] text-white font-medium py-2 px-4 sm:py-2.5 sm:px-6 rounded-full text-xs sm:text-sm uppercase tracking-wide transition-all hover:shadow-lg hover:shadow-[#81a308]/25"
          >
            Browse Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {listings.slice(0, 6).map((listing) => (
            <Link
              key={listing.id}
              href={`/marketplace`}
              className="group"
            >
              <div className="rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#81a308]/30 h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={listing.image || "/fallback.png"}
                    alt={listing.plantName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    {listing.listingType === "auction" ? (
                      <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        <Gavel className="w-3 h-3" />
                        Auction
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        <Tag className="w-3 h-3" />
                        For Sale
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-zinc-900 dark:text-white text-sm sm:text-base truncate">
                    {listing.plantName}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    by @{listing.sellerUsername}
                  </p>
                  <div className="mt-auto pt-2">
                    {listing.listingType === "auction" ? (
                      <div>
                        <p className="text-[#81a308] font-bold text-sm sm:text-base">
                          Starting bid: ${listing.currentBid || listing.price}
                        </p>
                        {listing.auctionEndDate && (
                          <p className="text-xs text-amber-500 mt-0.5">
                            Ends: {formatTimeLeft(listing.auctionEndDate)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-[#81a308] font-bold text-sm sm:text-base">
                        ${listing.price}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
