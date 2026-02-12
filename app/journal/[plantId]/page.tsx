"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Calendar, TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JournalEntryCard } from "@/components/journal/JournalEntryCard";
import { GrowthChart } from "@/components/journal/GrowthChart";

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

export default function JournalPage() {
  const params = useParams();
  const router = useRouter();
  const plantId = params.plantId as string;

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [plant, setPlant] = useState<Plant | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchJournalData();
  }, [plantId]);

  const fetchJournalData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      // Fetch plant details
      const plantRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plants/${plantId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (plantRes.ok) {
        const plantData = await plantRes.json();
        setPlant(plantData);
        
        // Check ownership
        const userId = localStorage.getItem("userId");
        setIsOwner(plantData.userId === userId);
      }

      // Fetch journal entries
      const entriesRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journal/entries/${plantId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (entriesRes.ok) {
        const entriesData = await entriesRes.json();
        setEntries(entriesData);
      }

      // Fetch growth stats
      const statsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journal/stats/${plantId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load journal");
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/plants/${plantId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Plant
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {plant?.commonName || "Plant"} Journal
            </h1>
            {plant?.botanicalName && (
              <p className="text-muted-foreground italic">{plant.botanicalName}</p>
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

      {/* Tabs */}
      <Tabs defaultValue="entries" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="entries" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Entries ({entries.length})
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="growth" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Growth Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="mt-6">
          {entries.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Journal Entries Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start documenting your plant's growth journey!
              </p>
              {isOwner && (
                <Link href={`/journal/${plantId}/new`}>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Entry
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <JournalEntryCard
                  key={entry.id}
                  entry={entry}
                  onDelete={isOwner ? handleDeleteEntry : undefined}
                  isOwner={isOwner}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Link href={`/journal/${plantId}/timeline`}>
            <Button variant="outline" className="mb-4">
              View Full Timeline
            </Button>
          </Link>
          <p className="text-muted-foreground text-sm">
            Timeline view shows your entries organized by month with a visual timeline.
          </p>
        </TabsContent>

        <TabsContent value="growth" className="mt-6">
          <GrowthChart measurements={stats?.measurements || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
