"use client";

import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, Droplet, Scissors, Sun, Thermometer } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JournalEntry {
  id: string;
  date: string;
  title?: string;
  notes?: string;
  photos: string[];
  measurements?: {
    height?: number;
    width?: number;
    healthScore?: number;
  };
  conditions?: {
    temperature?: number;
    humidity?: number;
    lightLevel?: string;
  };
  activities: string[];
  user?: {
    username: string;
    avatarUrl?: string;
  };
}

interface JournalEntryCardProps {
  entry: JournalEntry;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isOwner?: boolean;
}

const activityIcons: Record<string, any> = {
  watered: Droplet,
  pruned: Scissors,
  fertilized: Sun,
};

export function JournalEntryCard({
  entry,
  onEdit,
  onDelete,
  isOwner = false,
}: JournalEntryCardProps) {
  return (
    <Card className="w-full mb-4 overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="bg-emerald-50 dark:bg-emerald-950/20 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-semibold text-lg">
                {entry.title || "Journal Entry"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(entry.date), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(entry.id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(entry.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Photos */}
        {entry.photos && entry.photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {entry.photos.slice(0, 6).map((photo, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={photo}
                  alt={`Photo ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {entry.photos.length > 6 && (
              <div className="aspect-square rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                <span className="text-sm font-medium">
                  +{entry.photos.length - 6} more
                </span>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {entry.notes && (
          <p className="text-sm mb-4 whitespace-pre-wrap">{entry.notes}</p>
        )}

        {/* Measurements */}
        {entry.measurements && Object.keys(entry.measurements).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {entry.measurements.height && (
              <Badge variant="secondary">
                Height: {entry.measurements.height}" 
              </Badge>
            )}
            {entry.measurements.width && (
              <Badge variant="secondary">
                Width: {entry.measurements.width}"
              </Badge>
            )}
            {entry.measurements.healthScore && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Health: {entry.measurements.healthScore}/10
              </Badge>
            )}
          </div>
        )}

        {/* Conditions */}
        {entry.conditions && Object.keys(entry.conditions).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 text-sm text-muted-foreground">
            {entry.conditions.temperature && (
              <span className="flex items-center gap-1">
                <Thermometer className="w-4 h-4" />
                {entry.conditions.temperature}°F
              </span>
            )}
            {entry.conditions.humidity && (
              <span className="flex items-center gap-1">
                <Droplet className="w-4 h-4" />
                {entry.conditions.humidity}%
              </span>
            )}
            {entry.conditions.lightLevel && (
              <span className="flex items-center gap-1">
                <Sun className="w-4 h-4" />
                {entry.conditions.lightLevel}
              </span>
            )}
          </div>
        )}

        {/* Activities */}
        {entry.activities && entry.activities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {entry.activities.map((activity, idx) => {
              const Icon = activityIcons[activity.toLowerCase()];
              return (
                <Badge key={idx} className="flex items-center gap-1">
                  {Icon && <Icon className="w-3 h-3" />}
                  {activity}
                </Badge>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
