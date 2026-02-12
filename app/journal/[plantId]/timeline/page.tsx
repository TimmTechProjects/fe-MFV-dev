"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JournalTimeline } from "@/components/journal/JournalTimeline";

interface JournalEntry {
  id: string;
  date: string;
  title?: string;
  notes?: string;
  photos: string[];
  measurements?: any;
  conditions?: any;
  activities: string[];
  user?: {
    username: string;
    avatarUrl?: string;
  };
}

interface Plant {
  id: string;
  commonName: string;
  botanicalName: string;
}

export default function TimelinePage() {
  const params = useParams();
  const router = useRouter();
  const plantId = params.plantId as string;

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchData();
  }, [plantId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      // Fetch plant
      const plantRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plants/${plantId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (plantRes.ok) {
        const plantData = await plantRes.json();
        setPlant(plantData);
        
        const userId = localStorage.getItem("userId");
        setIsOwner(plantData.userId === userId);
      }

      // Fetch timeline
      const timelineRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journal/timeline/${plantId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (timelineRes.ok) {
        const timelineData = await timelineRes.json();
        // Flatten the grouped timeline into a single array
        const allEntries = Object.values(timelineData).flat() as JournalEntry[];
        setEntries(allEntries);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load timeline");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journal/entries/${entryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== entryId));
      } else {
        alert("Failed to delete entry");
      }
    } catch (err) {
      console.error("Error deleting entry:", err);
      alert("Failed to delete entry");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/journal/${plantId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Journal
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Growth Timeline</h1>
            {plant && (
              <p className="text-muted-foreground">
                {plant.commonName}
                {plant.botanicalName && (
                  <span className="italic ml-2">({plant.botanicalName})</span>
                )}
              </p>
            )}
          </div>

          {isOwner && (
            <Link href={`/journal/${plantId}/new`}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Timeline */}
      <JournalTimeline
        entries={entries}
        onDelete={isOwner ? handleDeleteEntry : undefined}
        isOwner={isOwner}
      />
    </div>
  );
}
