"use client";

import React, { useState } from "react";
import { Filter, X, Search, Star } from "lucide-react";

import { marketplacePlants } from "@/mock/marketplaceData";

const plants = marketplacePlants;

const uniqueShops = Array.from(new Set(plants.map((p) => p.shop)));
const uniquePrices = [
  { label: "Under $15", min: 0, max: 15 },
  { label: "$15 - $25", min: 15, max: 25 },
  { label: "$25 - $35", min: 25, max: 35 },
  { label: "Over $35", min: 35, max: Infinity },
];

const MarketplacePage = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Relevancy");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  // Filtering logic
  let filteredPlants = plants.filter((plant) => {
    const matchesSearch = (plant.name + " " + plant.shop + " " + plant.price)
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesShop = selectedShop ? plant.shop === selectedShop : true;

    const matchesPrice = selectedPrice
      ? (() => {
          const priceNum = parseFloat(plant.price.replace("$", ""));
          const priceRange = uniquePrices.find(
            (p) => p.label === selectedPrice
          );
          if (!priceRange) return true;
          return priceNum >= priceRange.min && priceNum < priceRange.max;
        })()
      : true;

    const matchesShipping = freeShippingOnly ? plant.freeShipping : true;
    const matchesSale = onSaleOnly ? !!plant.sale : true;

    return (
      matchesSearch &&
      matchesShop &&
      matchesPrice &&
      matchesShipping &&
      matchesSale
    );
  });

  // Sort logic
  if (sort === "Price: Low to High") {
    filteredPlants = [...filteredPlants].sort(
      (a, b) =>
        parseFloat(a.price.replace("$", "")) -
        parseFloat(b.price.replace("$", ""))
    );
  } else if (sort === "Price: High to Low") {
    filteredPlants = [...filteredPlants].sort(
      (a, b) =>
        parseFloat(b.price.replace("$", "")) -
        parseFloat(a.price.replace("$", ""))
    );
  } else if (sort === "Top Rated") {
    filteredPlants = [...filteredPlants].sort((a, b) => b.rating - a.rating);
  }

  // Reset filters
  const clearFilters = () => {
    setSelectedShop(null);
    setSelectedPrice(null);
    setFreeShippingOnly(false);
    setOnSaleOnly(false);
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Filter Sidebar Overlay */}
      {showFilters && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <aside className="fixed top-0 left-0 z-50 h-full w-80 bg-[#111] shadow-2xl flex flex-col rounded-r-2xl border-r border-gray-800/30">
            {/* Filter Header */}
            <div className="flex items-center justify-between p-6">
              <h2 className="text-xl font-bold text-white">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Special Offers */}
              <div>
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 border-b border-gray-800/50 pb-2">
                  Special Offers
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={freeShippingOnly}
                      onChange={() => setFreeShippingOnly(!freeShippingOnly)}
                      className="w-4 h-4 text-[#81a308] bg-black border-[#81a308] rounded focus:ring-[#81a308]"
                    />
                    <span className="text-white">Free Shipping</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onSaleOnly}
                      onChange={() => setOnSaleOnly(!onSaleOnly)}
                      className="w-4 h-4 text-[#81a308] bg-black border-[#81a308] rounded focus:ring-[#81a308]"
                    />
                    <span className="text-white">On Sale</span>
                  </label>
                </div>
              </div>

              {/* Shop Filter */}
              <div>
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 border-b border-gray-800/50 pb-2">
                  Shop
                </h3>
                <select
                  value={selectedShop || ""}
                  onChange={(e) => setSelectedShop(e.target.value || null)}
                  className="w-full bg-gray-900 text-white rounded-xl px-3 py-2.5 border border-gray-800/50 focus:outline-none focus:border-purple-500/30"
                >
                  <option value="">All Shops</option>
                  {uniqueShops.map((shop) => (
                    <option key={shop} value={shop}>
                      {shop}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 border-b border-gray-800/50 pb-2">
                  Price Range
                </h3>
                <select
                  value={selectedPrice || ""}
                  onChange={(e) => setSelectedPrice(e.target.value || null)}
                  className="w-full bg-gray-900 text-white rounded-xl px-3 py-2.5 border border-gray-800/50 focus:outline-none focus:border-purple-500/30"
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

            {/* Filter Actions */}
            <div className="p-6 border-t border-gray-800/50">
              <div className="flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2.5 border border-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-4 py-2.5 bg-[#81a308] hover:bg-[#6c8a0a] text-white rounded-xl hover:shadow-lg hover:shadow-[#81a308]/20 transition-all"
                >
                  Apply
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">
            Plant <span className="text-[#81a308]">Marketplace</span>
          </h1>
          <p className="text-gray-400">
            Discover beautiful plants from trusted sellers
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search marketplace..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-900/60 text-white text-sm rounded-full border border-gray-800/50 focus:outline-none focus:border-[#81a308]/30 transition-all placeholder-gray-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-900/60 text-gray-300 rounded-full text-sm hover:bg-[#81a308]/10 hover:text-[#81a308] transition-all border border-gray-800/50"
          >
            <Filter size={14} />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-900/60 text-gray-300 text-sm rounded-full px-3 py-2 border border-gray-800/50 focus:outline-none cursor-pointer hidden sm:block"
          >
            <option>Relevancy</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Top Rated</option>
          </select>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          {filteredPlants.length}{" "}
          {filteredPlants.length === 1 ? "result" : "results"} found
        </p>

        {/* Plant Grid */}
        {filteredPlants.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredPlants.map((plant) => (
              <div
                key={plant.id}
                className="bg-gray-900/40 rounded-2xl overflow-hidden transition-all duration-200 group border border-gray-800/30 hover:border-[#81a308]/20 hover:shadow-lg hover:shadow-[#81a308]/5"
              >
                {/* Plant Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={plant.image || "/fallback.png"}
                    alt={plant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/fallback.png"; }}
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {plant.sale && (
                      <span className="bg-red-500/90 backdrop-blur text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                        {plant.sale}
                      </span>
                    )}
                    {plant.freeShipping && (
                      <span className="bg-blue-500/90 backdrop-blur text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                        Free Ship
                      </span>
                    )}
                  </div>
                </div>

                {/* Plant Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-white text-sm mb-1.5 line-clamp-1 group-hover:text-[#81a308] transition-colors cursor-pointer">
                    {plant.name}
                  </h3>

                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="text-yellow-400 fill-current"
                      />
                      <span className="text-xs text-white">{plant.rating}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">
                      ({plant.reviews})
                    </span>
                  </div>

                  {/* Shop Name */}
                  <p className="text-xs text-gray-500 mb-3 hover:text-[#81a308] cursor-pointer transition-colors">
                    by {plant.shop}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-white">
                      {plant.price}
                    </span>
                    <button className="px-3 py-1.5 text-white text-xs rounded-lg bg-[#81a308] hover:bg-[#6c8a0a] hover:shadow-lg hover:shadow-[#81a308]/20 transition-all font-medium">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div            className="w-16 h-16 bg-[#81a308]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search size={24} className="text-[#81a308]"/>
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              No plants found
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearch("");
                clearFilters();
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
