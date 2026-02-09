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
    <div className="bg-gray-950 min-h-screen">
      {/* Filter Sidebar Overlay */}
      {showFilters && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <aside className="fixed top-0 left-0 z-50 h-full w-80 bg-[#1a1a1a] shadow-2xl flex flex-col   ">
            {/* Filter Header */}
            <div className="flex items-center justify-between p-6  ">
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
                <h3 className="text-sm font-semibold text-white mb-3 border-b border-[#81a308] pb-2">
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
                <h3 className="text-sm font-semibold text-white mb-3 border-b border-[#81a308] pb-2">
                  Shop
                </h3>
                <select
                  value={selectedShop || ""}
                  onChange={(e) => setSelectedShop(e.target.value || null)}
                  className="w-full bg-black   text-white rounded-lg px-3 py-2  "
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
                <h3 className="text-sm font-semibold text-white mb-3 border-b border-[#81a308] pb-2">
                  Price Range
                </h3>
                <select
                  value={selectedPrice || ""}
                  onChange={(e) => setSelectedPrice(e.target.value || null)}
                  className="w-full bg-black text-white rounded-lg px-3 py-2 "
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
            <div className="p-6 border-t border-[#81a308]">
              <div className="flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2 border border-[#81a308] text-white rounded-lg hover:bg-[#81a308] transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-4 py-2 bg-[#81a308] text-white rounded-lg hover:bg-[#6e8c07] transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Plant Marketplace
          </h1>
          <p className="text-white text-lg">
            Discover beautiful plants from trusted sellers
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 mb-8  ">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Left Side - Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-[#81a308] transition-colors  "
              >
                <Filter size={18} />
                Filters
              </button>

              <div className="relative flex-1 max-w-md">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                />
                <input
                  type="text"
                  placeholder="Search plants, shops..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black  text-white rounded-lg  focus:outline-none"
                />
              </div>
            </div>

            {/* Right Side - Sort */}
            <div className="flex items-center gap-3">
              <span className="text-white text-sm whitespace-nowrap">
                Sort by:
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-black  text-white rounded-lg px-3 py-2  focus:border-transparent"
              >
                <option>Relevancy</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-[#81a308]">
            <p className="text-sm text-white">
              {filteredPlants.length}{" "}
              {filteredPlants.length === 1 ? "result" : "results"} found
            </p>
          </div>
        </div>

        {/* Plant Grid */}
        {filteredPlants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlants.map((plant) => (
              <div
                key={plant.id}
                className="bg-[#1a1a1a] rounded-xl overflow-hidden  transition-all duration-200 group"
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
                      <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                        {plant.sale}
                      </span>
                    )}
                    {plant.freeShipping && (
                      <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                        Free Ship
                      </span>
                    )}
                  </div>
                </div>

                {/* Plant Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2 line-clamp-1 group-hover:text-[#81a308] transition-colors cursor-pointer">
                    {plant.name}
                  </h3>

                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="text-yellow-400 fill-current"
                      />
                      <span className="text-sm text-white">{plant.rating}</span>
                    </div>
                    <span className="text-xs text-white">
                      ({plant.reviews} reviews)
                    </span>
                  </div>

                  {/* Shop Name */}
                  <p className="text-sm text-white mb-3 hover:text-[#81a308] cursor-pointer transition-colors">
                    by {plant.shop}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      {plant.price}
                    </span>
                    <button className="px-3 py-1  text-white text-sm rounded-lg  bg-[#81a308] transition-colors border border-[#81a308]">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#81a308]">
              <Search size={32} className="text-[#81a308]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No plants found
            </h3>
            <p className="text-white mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearch("");
                clearFilters();
              }}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-[#81a308] transition-colors border border-[#81a308]"
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
