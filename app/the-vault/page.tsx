import { getPaginatedPlants } from "@/lib/utils";
import ResultsCard from "@/components/cards/ResultsCard";
import { Plant } from "@/types/plants";
import Pagination from "@/components/Pagination";
import Loading from "../loading";

interface Props {
  searchParams?: {
    page?: string;
  };
}

const limit = 5;

export default async function VaultPage({ searchParams }: Props) {
  const currentPage = Number(searchParams?.page || 1);
  const { plants, total } = await getPaginatedPlants(currentPage, limit);
  const totalPages = Math.ceil(total / limit);
  console.log(plants);

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
                      className="px-3 py-2 bg-[#81a308] rounded-full text-sm text-white transition-all duration-200"
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
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Latest Uploads
              </h1>
              <p className="text-gray-400 text-base sm:text-lg">
                Discover the newest additions to our plant collection
              </p>
              <div className="mt-4 text-sm text-gray-500">
                Showing {(currentPage - 1) * limit + 1} -{" "}
                {Math.min(currentPage * limit, total)} of {total} plants
              </div>
            </div>

            {/* Content Area */}
            <div className="relative min-h-[300px]">
              {plants.length === 0 ? (
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
                  <p className="text-gray-500 max-w-md px-4">
                    Try adjusting your filters or check back later for new
                    uploads.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {plants.map((plant) => (
                    <div key={plant.id} className="h-full">
                      <ResultsCard plant={plant} compact />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  maxVisiblePages={5}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
