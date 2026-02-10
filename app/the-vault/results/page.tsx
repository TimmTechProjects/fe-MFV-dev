"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ResultsCard from "@/components/cards/ResultsCard";
import GoBackButton from "@/components/ui/GoBackButton";
import { searchEverything } from "@/lib/utils";
import { Plant } from "@/types/plants";
import { UserResult } from "@/types/users";
import { Collection } from "@/types/collections";

const ResultsPageContent = () => {
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag");
  const query = searchParams.get("query");

  const router = useRouter();

  const [plants, setPlants] = useState<Plant[]>([]);
  const [users, setUsers] = useState<UserResult[]>([]);
  const [albums, setAlbums] = useState<Collection[]>([]);
  const [filter, setFilter] = useState<
    "all" | "albums" | "plants" | "accounts"
  >("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!tag && !query) {
        router.push("/");
        return;
      }

      setLoading(true);

      const { plants, users, collections } = await searchEverything(
        tag || query || ""
      );
      setPlants(plants);
      setUsers(users);
      setAlbums(collections || []);

      setLoading(false);
    };

    fetchResults();
  }, [tag, query, router]);

  const totalResults = plants.length + users.length + albums.length;

  return (
    <div className="flex flex-col text-white py-5 px-4 md:px-10">
      {/* Page Heading */}
      <div className="flex py-5 items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Searching for:{" "}
            <span className="italic text-[#81a308]">
              {tag?.toUpperCase() || query?.toUpperCase()}
            </span>
          </h1>
          {!loading && (
            <p className="text-sm text-gray-400 mt-1 font-normal">
              {totalResults} {totalResults === 1 ? 'result' : 'results'} found
            </p>
          )}
        </div>
        <GoBackButton />
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-6 text-[1rem]">
        {["all", "plants", "albums", "accounts"].map((key) => (
          <button
            key={key}
            className={`capitalize px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              filter === key
                ? "bg-[#81a308] text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setFilter(key as typeof filter)}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex h-[50vh] items-center justify-center text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#81a308] mx-auto mb-4"></div>
            <p className="text-gray-400">Searching...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full justify-center items-center gap-8">
          {/* Plants section */}
          {(filter === "all" || filter === "plants") && plants.length > 0 && (
            <div className="flex flex-col w-full max-w-5xl">
              <h2 className="text-lg mb-3 text-[#81a308] font-semibold flex items-center gap-2">
                <span>Plants</span>
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full font-normal">{plants.length}</span>
              </h2>
              <div className="space-y-3">
                {plants.map((plant) => (
                  <ResultsCard key={plant.id} plant={plant} />
                ))}
              </div>
            </div>
          )}

          {/* Albums section */}
          {(filter === "all" || filter === "albums") && albums.length > 0 && (
            <div className="flex flex-col w-full max-w-5xl">
              <h2 className="text-lg mb-3 text-[#81a308] font-semibold flex items-center gap-2">
                <span>Albums</span>
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full font-normal">{albums.length}</span>
              </h2>
              <div className="space-y-3">
                {albums.map((album) => (
                  <ResultsCard key={album.id} album={album} />
                ))}
              </div>
            </div>
          )}

          {/* Accounts section */}
          {(filter === "all" || filter === "accounts") && users.length > 0 && (
            <div className="flex flex-col w-full max-w-5xl">
              <h2 className="text-lg mb-3 text-[#81a308] font-semibold flex items-center gap-2">
                <span>Users</span>
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full font-normal">{users.length}</span>
              </h2>
              <div className="space-y-3">
                {users
                  .slice(0, filter === "all" ? 4 : users.length)
                  .map((user) => (
                    <ResultsCard key={user.id} user={user} />
                  ))}
              </div>
            </div>
          )}

          {/* No results */}
          {plants.length === 0 && users.length === 0 && albums.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-10 space-y-2">
              <p className="text-3xl">🌱</p>
              <p className="text-base">No results matched your search.</p>
              <p className="text-sm text-muted">Try a different tag or name.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ResultsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsPageContent />
    </Suspense>
  );
};

export default ResultsPage;
