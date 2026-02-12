"use client";

import React from "react";
import { format } from "date-fns";
import { JournalEntryCard } from "./JournalEntryCard";
import { Calendar } from "lucide-react";

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

interface TimelineGroup {
  [key: string]: JournalEntry[];
}

interface JournalTimelineProps {
  entries: JournalEntry[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isOwner?: boolean;
}

export function JournalTimeline({
  entries,
  onEdit,
  onDelete,
  isOwner = false,
}: JournalTimelineProps) {
  // Group entries by month/year
  const groupedEntries = entries.reduce<TimelineGroup>((acc, entry) => {
    const date = new Date(entry.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(entry);

    return acc;
  }, {});

  // Sort by date descending
  const sortedKeys = Object.keys(groupedEntries).sort().reverse();

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Journal Entries Yet</h3>
        <p className="text-muted-foreground">
          Start documenting your plant's growth journey!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedKeys.map((key) => {
        const [year, month] = key.split("-");
        const monthName = format(new Date(parseInt(year), parseInt(month) - 1), "MMMM yyyy");

        return (
          <div key={key}>
            <div className="sticky top-0 bg-background/95 backdrop-blur z-10 py-2 mb-4 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {monthName}
                <span className="text-sm font-normal text-muted-foreground">
                  ({groupedEntries[key].length} {groupedEntries[key].length === 1 ? "entry" : "entries"})
                </span>
              </h2>
            </div>

            <div className="space-y-4 relative pl-8">
              {/* Timeline Line */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-emerald-200 dark:bg-emerald-800" />

              {groupedEntries[key]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry) => (
                  <div key={entry.id} className="relative">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[1.6rem] top-6 w-3 h-3 rounded-full bg-emerald-500 border-4 border-background" />
                    
                    <JournalEntryCard
                      entry={entry}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isOwner={isOwner}
                    />
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
