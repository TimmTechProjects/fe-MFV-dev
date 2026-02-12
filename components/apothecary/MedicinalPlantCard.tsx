"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, AlertTriangle, Pill, Flask } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MedicinalPlantCardProps {
  plant: {
    id: string;
    plantId: string;
    plant: {
      id: string;
      commonName: string;
      botanicalName: string;
      images: { url: string; isMain: boolean }[];
    };
    properties: string[];
    activeCompounds: string[];
    traditionalUses: string[];
    modernUses: string[];
    safetyWarnings?: string[];
  };
}

export default function MedicinalPlantCard({ plant }: MedicinalPlantCardProps) {
  const [imageError, setImageError] = useState(false);
  const mainImage = plant.plant.images.find((img) => img.isMain) || plant.plant.images[0];
  const hasWarnings = plant.safetyWarnings && plant.safetyWarnings.length > 0;

  return (
    <Link href={`/plants/${plant.plant.id}?tab=medicinal`}>
      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-gray-200 hover:border-emerald-500">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-green-100 overflow-hidden">
          {mainImage && !imageError ? (
            <Image
              src={mainImage.url}
              alt={plant.plant.commonName}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf className="w-16 h-16 text-emerald-300" />
            </div>
          )}
          
          {/* Warning Badge */}
          {hasWarnings && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white p-2 rounded-full shadow-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
        </div>

        <CardContent className="p-5">
          {/* Plant Name */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
              {plant.plant.commonName}
            </h3>
            <p className="text-sm text-gray-500 italic">
              {plant.plant.botanicalName}
            </p>
          </div>

          {/* Properties */}
          {plant.properties.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-gray-700 uppercase">
                  Properties
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {plant.properties.slice(0, 3).map((prop, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  >
                    {prop}
                  </Badge>
                ))}
                {plant.properties.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{plant.properties.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Active Compounds */}
          {plant.activeCompounds.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flask className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-gray-700 uppercase">
                  Key Compounds
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {plant.activeCompounds.slice(0, 2).map((compound, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200"
                  >
                    {compound}
                  </Badge>
                ))}
                {plant.activeCompounds.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{plant.activeCompounds.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* View Details Link */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-emerald-600 font-medium group-hover:underline">
              View Medicinal Info →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
