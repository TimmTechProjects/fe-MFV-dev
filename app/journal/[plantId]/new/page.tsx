"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EntryForm } from "@/components/journal/EntryForm";

interface Plant {
  id: string;
  commonName: string;
  botanicalName: string;
}

export default function NewJournalEntryPage() {
  const params = useParams();
  const router = useRouter();
  const plantId = params.plantId as string;

  const [plant, setPlant] = useState<Plant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlant();
  }, [plantId]);

  const fetchPlant = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plants/${plantId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.ok) {
        const data = await res.json();
        setPlant(data);
      } else {
        setError("Failed to load plant");
      }
    } catch (err) {
      console.error("Error fetching plant:", err);
      setError("Failed to load plant");
    }
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journal/entries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plantId,
            ...data,
          }),
        }
      );

      if (res.ok) {
        router.push(`/journal/${plantId}`);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to create entry");
      }
    } catch (err: any) {
      console.error("Error creating entry:", err);
      setError(err.message || "Failed to create entry");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/journal/${plantId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/journal/${plantId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Journal
        </Link>

        <h1 className="text-3xl font-bold mb-2">New Journal Entry</h1>
        {plant && (
          <p className="text-muted-foreground">
            {plant.commonName}
            {plant.botanicalName && (
              <span className="italic ml-2">({plant.botanicalName})</span>
            )}
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Entry Form */}
      <EntryForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
