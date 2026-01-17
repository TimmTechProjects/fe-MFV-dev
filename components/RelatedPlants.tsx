"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface RelatedPlant {
  id: string;
  commonName: string;
  botanicalName: string;
  slug: string;
  origin?: string;
  family?: string;
  type?: string;
  views: number;
  images: Array<{
    id: string;
    url: string;
    isMain: boolean;
  }>;
  tags: Array<{
    id: string;
    name: string;
  }>;
  user: {
    username: string;
  };
  collection: {
    slug: string;
  };
}

interface RelatedPlantsProps {
  plantId: string;
  currentPlantName: string;
}

export default function RelatedPlants({ plantId, currentPlantName }: RelatedPlantsProps) {
  const [relatedPlants, setRelatedPlants] = useState<RelatedPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl =
    process.env.NEXT_PUBLIC_FLORAL_VAULT_API_URL ||
    process.env.NEXT_PUBLIC_FLORAL_VAULT_DEV_API_URL

  useEffect(() => {
    const fetchRelatedPlants = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${baseUrl}/api/plants/related/${plantId}?limit=6`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch related plants');
        }
        
        const data = await response.json();
        setRelatedPlants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (plantId) {
      fetchRelatedPlants();
    }
  }, [plantId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-gray-900/30 rounded-3xl p-8 border border-gray-800">
          <h3 className="text-2xl font-bold mb-6 text-white">Related Plants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 h-48 rounded-lg mb-3"></div>
                <div className="bg-gray-800 h-4 rounded mb-2"></div>
                <div className="bg-gray-800 h-3 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || relatedPlants.length === 0) {
    return null; // Don't show anything if there's an error or no related plants
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      <div className="bg-gray-900/30 rounded-3xl p-8 border border-gray-800">
        <h3 className="text-2xl font-bold mb-6 text-white">
          Related Plants
        </h3>
        <p className="text-gray-400 mb-8">
          Discover similar plants and other contributions from our community
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPlants.map((plant) => (
            <Link
              key={plant.id}
              href={`/profiles/${plant.user.username}/collections/${plant.collection.slug}/${plant.slug}`}
              className="group"
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-200 hover:bg-gray-800/70 overflow-hidden">
                <CardContent className="p-0">
                  {/* Plant Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={plant.images[0]?.url || "/fallback.png"}
                      alt={plant.commonName || plant.botanicalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-200" />
                  </div>
                  
                  {/* Plant Info */}
                  <div className="p-4">
                    <h4 className="font-semibold text-white mb-1 truncate">
                      {plant.commonName || plant.botanicalName}
                    </h4>
                    {plant.commonName && plant.botanicalName && (
                      <p className="text-sm text-gray-400 italic mb-2 truncate">
                        {plant.botanicalName}
                      </p>
                    )}
                    
                    {/* Plant Details */}
                    <div className="space-y-1 mb-3">
                      {plant.family && (
                        <p className="text-xs text-gray-500">
                          Family: {plant.family}
                        </p>
                      )}
                      {plant.origin && (
                        <p className="text-xs text-gray-500">
                          Origin: {plant.origin}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Views: {plant.views.toLocaleString()}
                      </p>
                    </div>
                    
                    {/* Tags */}
                    {plant.tags && plant.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {plant.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag.id}
                            className="px-2 py-1 bg-gray-700 text-gray-300 border border-gray-600 text-xs"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                        {plant.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{plant.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Contributor */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                      <div className="w-6 h-6 bg-[#81a308] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {plant.user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        @{plant.user.username}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-8">
          <Link
            href="/the-vault"
            className="inline-block px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors font-medium"
          >
            Explore All Plants
          </Link>
        </div>
      </div>
    </div>
  );
}
