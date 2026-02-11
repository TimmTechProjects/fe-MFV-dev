"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Filter,
  X,
  Search,
  Star,
  ShoppingCart,
  Gavel,
  Plus,
  Clock,
  Loader2,
  Tag,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useAuth from "@/redux/hooks/useAuth";
import { MarketplaceListing } from "@/types/marketplace";
import { marketplacePlants, MarketplacePlant } from "@/mock/marketplaceData";
import {
  getMarketplaceListings,
  createMarketplaceListing,
  placeBid,
} from "@/lib/utils";

type ListingTab = "all" | "sale" | "auction";
type SortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "ending_soon";

function adaptMockToListing(mock: MarketplacePlant): MarketplaceListing {
  const priceNum = parseFloat(mock.price.replace("$", ""));
  return {
    id: String(mock.id),
    plantName: mock.name,
    description: "",
    price: priceNum,
    image: mock.image,
    sellerId: "",
    sellerUsername: mock.shop,
    listingType:
      mock.listingType === "both"
        ? "sale"
        : mock.listingType === "buy"
          ? "sale"
          : mock.listingType,
    condition: "good",
    shippingCost: mock.freeShipping ? 0 : 5.99,
    freeShipping: mock.freeShipping,
    category: "plants",
    rating: mock.rating,
    reviews: mock.reviews,
    views: 0,
    favorites: 0,
    status: "active",
    currentBid:
      mock.listingType === "auction" || mock.listingType === "both"
        ? priceNum
        : undefined,
    bidCount:
      mock.listingType === "auction" || mock.listingType === "both"
        ? Math.floor(Math.random() * 10) + 1
        : undefined,
    minimumBid:
      mock.listingType === "auction" || mock.listingType === "both"
        ? priceNum * 0.8
        : undefined,
    auctionEndDate:
      mock.listingType === "auction" || mock.listingType === "both"
        ? new Date(
            Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000
          ).toISOString()
        : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function AuctionCountdown({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const end = new Date(endDate).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Ended");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [endDate]);

  const isUrgent = (() => {
    const diff = new Date(endDate).getTime() - Date.now();
    return diff > 0 && diff < 24 * 60 * 60 * 1000;
  })();

  return (
    <span
      className={`flex items-center gap-1 text-[11px] ${isUrgent ? "text-red-400" : "text-amber-400"}`}
    >
      <Clock size={10} />
      {timeLeft}
    </span>
  );
}

function CreateListingModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    plantName: "",
    description: "",
    price: "",
    image: "",
    listingType: "sale" as "sale" | "auction",
    condition: "good" as "excellent" | "good" | "fair",
    shippingCost: "",
    freeShipping: false,
    category: "plants",
    auctionEndDate: "",
    minimumBid: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.plantName || !form.price) {
      toast.error("Plant name and price are required");
      return;
    }

    setLoading(true);
    const result = await createMarketplaceListing({
      plantName: form.plantName,
      description: form.description,
      price: parseFloat(form.price),
      image: form.image || "/fallback.png",
      listingType: form.listingType,
      condition: form.condition,
      shippingCost: form.freeShipping
        ? 0
        : parseFloat(form.shippingCost || "0"),
      freeShipping: form.freeShipping,
      category: form.category,
      auctionEndDate:
        form.listingType === "auction" ? form.auctionEndDate : undefined,
      minimumBid:
        form.listingType === "auction" && form.minimumBid
          ? parseFloat(form.minimumBid)
          : undefined,
    });

    setLoading(false);

    if (result.success) {
      toast.success("Listing created successfully!");
      onCreated();
      onClose();
      setForm({
        plantName: "",
        description: "",
        price: "",
        image: "",
        listingType: "sale",
        condition: "good",
        shippingCost: "",
        freeShipping: false,
        category: "plants",
        auctionEndDate: "",
        minimumBid: "",
      });
    } else {
      toast.error(result.message || "Failed to create listing");
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#81a308]/50 transition";

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-5 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-100">
              Create Listing
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-zinc-800 transition"
            >
              <X size={18} className="text-zinc-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Plant Name *
              </label>
              <input
                type="text"
                value={form.plantName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, plantName: e.target.value }))
                }
                placeholder="e.g. Monstera Deliciosa"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe your plant..."
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Listing Type
                </label>
                <select
                  value={form.listingType}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      listingType: e.target.value as "sale" | "auction",
                    }))
                  }
                  className={inputClass}
                >
                  <option value="sale">Sale</option>
                  <option value="auction">Auction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Condition
                </label>
                <select
                  value={form.condition}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      condition: e.target.value as
                        | "excellent"
                        | "good"
                        | "fair",
                    }))
                  }
                  className={inputClass}
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="0.00"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Shipping Cost ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.freeShipping ? "" : form.shippingCost}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      shippingCost: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                  className={inputClass}
                  disabled={form.freeShipping}
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.freeShipping}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    freeShipping: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-[#81a308] bg-zinc-900 border-zinc-700 rounded focus:ring-[#81a308]"
              />
              <span className="text-sm text-zinc-300">Free shipping</span>
            </label>

            {form.listingType === "auction" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Auction End Date
                  </label>
                  <input
                    type="datetime-local"
                    value={form.auctionEndDate}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        auctionEndDate: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Minimum Bid ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.minimumBid}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        minimumBid: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Image URL
              </label>
              <input
                type="url"
                value={form.image}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="https://..."
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-medium text-white transition bg-[#81a308] hover:bg-[#6c8a0a] hover:shadow-lg hover:shadow-[#81a308]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Listing"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const sortLabels: Record<SortOption, string> = {
  newest: "Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  rating: "Top Rated",
  ending_soon: "Ending Soon",
};

const uniquePrices = [
  { label: "Under $15", min: 0, max: 15 },
  { label: "$15 - $25", min: 15, max: 25 },
  { label: "$25 - $35", min: 25, max: 35 },
  { label: "Over $35", min: 35, max: Infinity },
];

const MarketplacePage = () => {
  const { user } = useAuth();
  const isPremium =
    user?.subscriptionTier === "premium" || user?.plan === "premium";

  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<ListingTab>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMarketplaceListings({
        search: search || undefined,
        listingType: activeTab === "all" ? undefined : activeTab,
        sort,
        freeShipping: freeShippingOnly || undefined,
      });

      if (response.listings.length > 0) {
        setListings(response.listings);
        setUsingMockData(false);
      } else {
        setListings(marketplacePlants.map(adaptMockToListing));
        setUsingMockData(true);
      }
    } catch {
      setListings(marketplacePlants.map(adaptMockToListing));
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  }, [search, activeTab, sort, freeShippingOnly]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const filteredListings = listings.filter((listing) => {
    if (usingMockData) {
      const matchesSearch = (listing.plantName + " " + listing.sellerUsername)
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesTab =
        activeTab === "all" ? true : listing.listingType === activeTab;

      const matchesPrice = selectedPrice
        ? (() => {
            const range = uniquePrices.find((p) => p.label === selectedPrice);
            if (!range) return true;
            return listing.price >= range.min && listing.price < range.max;
          })()
        : true;

      const matchesShipping = freeShippingOnly ? listing.freeShipping : true;
      const matchesSale = onSaleOnly ? listing.price < 20 : true;

      return (
        matchesSearch &&
        matchesTab &&
        matchesPrice &&
        matchesShipping &&
        matchesSale
      );
    }
    const matchesPrice = selectedPrice
      ? (() => {
          const range = uniquePrices.find((p) => p.label === selectedPrice);
          if (!range) return true;
          return listing.price >= range.min && listing.price < range.max;
        })()
      : true;

    const matchesSale = onSaleOnly ? listing.price < 20 : true;
    return matchesPrice && matchesSale;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (usingMockData) {
      switch (sort) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "ending_soon":
          if (a.auctionEndDate && b.auctionEndDate) {
            return (
              new Date(a.auctionEndDate).getTime() -
              new Date(b.auctionEndDate).getTime()
            );
          }
          return a.auctionEndDate ? -1 : 1;
        default:
          return 0;
      }
    }
    return 0;
  });

  const clearFilters = () => {
    setSelectedPrice(null);
    setFreeShippingOnly(false);
    setOnSaleOnly(false);
  };

  const handleBid = async (listingId: string, currentPrice: number) => {
    if (!user) {
      toast.error("Please log in to place a bid");
      return;
    }

    const bidAmount = currentPrice + 1;
    const result = await placeBid(listingId, bidAmount);
    if (result.success) {
      toast.success("Bid of $" + bidAmount.toFixed(2) + " placed!");
      fetchListings();
    } else {
      toast.error(result.message || "Failed to place bid");
    }
  };

  const tabs: { key: ListingTab; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All Listings", icon: <Tag size={14} /> },
    { key: "sale", label: "Buy Now", icon: <ShoppingCart size={14} /> },
    { key: "auction", label: "Auctions", icon: <Gavel size={14} /> },
  ];

  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-900 dark:text-white">
      {showFilters && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <aside className="fixed top-0 left-0 z-50 h-full w-80 bg-white dark:bg-zinc-950 shadow-2xl flex flex-col rounded-r-2xl border-r border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between p-6">
              <h2 className="text-xl font-bold text-white">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X size={20} className="text-zinc-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3 border-b border-zinc-800 pb-2">
                  Special Offers
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={freeShippingOnly}
                      onChange={() => setFreeShippingOnly(!freeShippingOnly)}
                      className="w-4 h-4 text-[#81a308] bg-zinc-900 border-zinc-700 rounded focus:ring-[#81a308]"
                    />
                    <span className="text-zinc-300 text-sm">
                      Free Shipping
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onSaleOnly}
                      onChange={() => setOnSaleOnly(!onSaleOnly)}
                      className="w-4 h-4 text-[#81a308] bg-zinc-900 border-zinc-700 rounded focus:ring-[#81a308]"
                    />
                    <span className="text-zinc-300 text-sm">On Sale</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3 border-b border-zinc-800 pb-2">
                  Price Range
                </h3>
                <select
                  value={selectedPrice || ""}
                  onChange={(e) => setSelectedPrice(e.target.value || null)}
                  className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl px-3 py-2.5 border border-gray-300 dark:border-zinc-800 focus:outline-none focus:border-[#81a308]/50 text-sm"
                >
                  <option value="">Any Price</option>
                  {uniquePrices.map((price) => (
                    <option key={price.label} value={price.label}>
                      {price.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800">
              <div className="flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2.5 border border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-800 transition-colors text-sm"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-4 py-2.5 bg-[#81a308] hover:bg-[#6c8a0a] text-white rounded-xl transition-all text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      <CreateListingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={fetchListings}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
              Plant <span className="text-[#81a308]">Marketplace</span>
            </h1>
            <p className="text-zinc-500 text-sm">
              Discover beautiful plants from trusted sellers
            </p>
          </div>

          {user && isPremium && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#81a308] hover:bg-[#6c8a0a] text-white rounded-xl transition-all text-sm font-medium hover:shadow-lg hover:shadow-[#81a308]/20"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Create Listing</span>
            </button>
          )}

          {user && !isPremium && (
            <div className="text-xs text-zinc-500 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-2">
              Upgrade to{" "}
              <span className="text-[#81a308] font-medium">Premium</span> to
              sell
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-5 p-3 bg-zinc-900/40 border border-zinc-800/30 rounded-xl">
          <Shield size={16} className="text-[#81a308] flex-shrink-0" />
          <p className="text-xs text-zinc-400">
            Shop and sell with confidence.{" "}
            <Link href="/buyer-protection" className="text-[#81a308] hover:underline">
              Buyer Protection
            </Link>
            {" and "}
            <Link href="/seller-protection" className="text-[#81a308] hover:underline">
              Seller Protection
            </Link>
            {" "}programs keep your transactions safe.
          </p>
        </div>

        <div className="flex items-center gap-1.5 mb-5 border-b border-zinc-800/50">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "text-[#81a308] border-[#81a308]"
                  : "text-zinc-500 border-transparent hover:text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Search marketplace..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-zinc-900/60 text-zinc-900 dark:text-white text-sm rounded-full border border-gray-200 dark:border-zinc-800/50 focus:outline-none focus:border-[#81a308]/30 transition-all placeholder-zinc-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 rounded-full text-sm hover:bg-[#81a308]/10 hover:text-[#81a308] transition-all border border-gray-200 dark:border-zinc-800/50"
          >
            <Filter size={14} />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-300 text-sm rounded-full px-3 py-2 border border-gray-300 dark:border-zinc-800/50 focus:outline-none cursor-pointer hidden sm:block"
          >
            {Object.entries(sortLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-zinc-500">
            {sortedListings.length}{" "}
            {sortedListings.length === 1 ? "result" : "results"} found
            {usingMockData && (
              <span className="ml-2 text-amber-500/70">(sample data)</span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#81a308]" />
          </div>
        ) : sortedListings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {sortedListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white dark:bg-zinc-900/40 rounded-2xl overflow-hidden transition-all duration-200 group border border-gray-200 dark:border-zinc-800/30 hover:border-[#81a308]/20 hover:shadow-lg hover:shadow-[#81a308]/5"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={listing.image || "/fallback.png"}
                    alt={listing.plantName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/fallback.png";
                    }}
                  />

                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {listing.listingType === "auction" && (
                      <span className="bg-amber-600/90 backdrop-blur text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Gavel size={10} />
                        Auction
                      </span>
                    )}
                    {listing.freeShipping && (
                      <span className="bg-blue-500/90 backdrop-blur text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                        Free Ship
                      </span>
                    )}
                  </div>

                  {listing.auctionEndDate &&
                    listing.listingType === "auction" && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur rounded-full px-2 py-1">
                        <AuctionCountdown endDate={listing.auctionEndDate} />
                      </div>
                    )}
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-zinc-900 dark:text-white text-sm mb-1.5 line-clamp-1 group-hover:text-[#81a308] transition-colors cursor-pointer">
                    {listing.plantName}
                  </h3>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="text-yellow-400 fill-current"
                      />
                      <span className="text-xs text-white">
                        {listing.rating}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      ({listing.reviews})
                    </span>
                    {listing.bidCount !== undefined &&
                      listing.bidCount > 0 && (
                        <span className="text-[10px] text-amber-400 ml-auto">
                          {listing.bidCount} bids
                        </span>
                      )}
                  </div>

                  <p className="text-xs text-zinc-500 mb-3 hover:text-[#81a308] cursor-pointer transition-colors">
                    by {listing.sellerUsername}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      {listing.listingType === "auction" &&
                      listing.currentBid ? (
                        <div>
                          <span className="text-[10px] text-zinc-500 block">
                            Current bid
                          </span>
                          <span className="text-sm sm:text-base font-bold text-white">
                            ${listing.currentBid.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm sm:text-base font-bold text-white">
                          ${listing.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {listing.listingType === "sale" && (
                        <button className="flex items-center gap-1 px-2.5 py-1.5 text-white text-[11px] rounded-full bg-[#81a308] hover:bg-[#6c8a0a] transition-all font-medium">
                          <ShoppingCart size={12} />
                          <span className="hidden sm:inline">Add to Cart</span>
                          <span className="sm:hidden">Cart</span>
                        </button>
                      )}
                      {listing.listingType === "auction" && (
                        <button
                          onClick={() =>
                            handleBid(
                              listing.id,
                              listing.currentBid || listing.price
                            )
                          }
                          className="flex items-center gap-1 px-2.5 py-1.5 text-white text-[11px] rounded-full bg-amber-600 hover:bg-amber-700 transition-all font-medium"
                        >
                          <Gavel size={12} />
                          Bid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#81a308]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-[#81a308]" />
            </div>
            <h3 className="text-lg font-medium text-zinc-300 mb-2">
              No plants found
            </h3>
            <p className="text-zinc-500 text-sm mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearch("");
                clearFilters();
                setActiveTab("all");
              }}
              className="px-5 py-2 bg-[#81a308]/15 text-[#81a308] rounded-xl hover:bg-[#81a308]/25 transition-all border border-[#81a308]/30 text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
