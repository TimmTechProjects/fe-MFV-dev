"use client";

import { getPaginatedPlants } from "@/lib/utils";
import ResultsCard from "@/components/cards/ResultsCard";
import React, { useState, useEffect } from "react";
import { Plant } from "@/types/plants";
import Loading from "../loading";

const VaultPage = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 20;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchPlants = async () => {
      const { plants, total } = await getPaginatedPlants(currentPage, limit);
      if (isMounted) {
        setPlants(plants);
        setTotal(total);
        setLoading(false);
      }
    };

    fetchPlants();
    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-[#2b2a2a] rounded-2xl p-6 border border-gray-800 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-white">Filters</h2>

              {/* Categories Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-500 pb-2">
                  Categories
                </h3>
                <div className="space-y-3">
                  {[
                    "Medicinal Plants",
                    "Edible Plants",
                    "Herbs",
                    "Flowers",
                  ].map((category) => (
                    <button
                      key={category}
                      className="w-full text-left px-4 py-3 rounded-xl bg-none hover:bg-[#81a308] transition-all duration-200 text-gray-300 hover:text-white border border-gray-500"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-500 pb-2">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Anti-inflammatory",
                    "Indoor",
                    "Fast-Growing",
                    "Perennial",
                    "Drought-Tolerant",
                    "Shade-Loving",
                  ].map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-2 bg-[#81a308]  rounded-full text-sm text-white transition-all duration-200  "
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2  ">Latest Uploads</h1>
              <p className="text-gray-400 text-lg">
                Discover the newest additions to our plant collection
              </p>
              {!loading && (
                <div className="mt-4 text-sm text-gray-500">
                  Showing {(currentPage - 1) * limit + 1} -{" "}
                  {Math.min(currentPage * limit, total)} of {total} plants
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className=" ">
              {loading ? (
                <div>
                  <Loading />
                </div>
              ) : plants.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 text-center">
                  <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-12 h-12 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No Plants Found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your filters or check back later for new
                    uploads.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3   gap-6">
                  {plants.map((plant) => (
                    <div key={plant.id} className="h-full">
                      <ResultsCard plant={plant} compact />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && !loading && (
              <div className="mt-8 flex justify-center">
                <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 shadow-xl">
                  <div className="flex items-center gap-4">
                    <button
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        currentPage === 1
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                          : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Page Numbers */}
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageNum =
                            Math.max(
                              1,
                              Math.min(totalPages - 4, currentPage - 2)
                            ) + i;
                          if (pageNum > totalPages) return null;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-12 h-12 rounded-xl font-medium transition-all duration-200 ${
                                currentPage === pageNum
                                  ? "bg-gray-700 text-white border-2 border-gray-600"
                                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        currentPage === totalPages
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                          : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      Next
                    </button>
                  </div>

                  <div className="text-center mt-3 text-sm text-gray-400">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default VaultPage;
