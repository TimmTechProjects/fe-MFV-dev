"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/redux/hooks/useAuth";
import { toast } from "sonner";
import {
  getCareReminders,
  completeCareReminder,
  deleteCareReminder,
  type CareReminder,
} from "@/lib/utils";
import {
  Droplets,
  Sun,
  Scissors,
  Leaf,
  Loader2,
  Check,
  Trash2,
  Clock,
  AlertCircle,
} from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  water: <Droplets className="w-5 h-5 text-blue-400" />,
  sunlight: <Sun className="w-5 h-5 text-yellow-400" />,
  pruning: <Scissors className="w-5 h-5 text-orange-400" />,
  fertilize: <Leaf className="w-5 h-5 text-emerald-400" />,
};

const typeLabels: Record<string, string> = {
  water: "Water",
  sunlight: "Sunlight",
  pruning: "Pruning",
  fertilize: "Fertilize",
};

function isDue(nextDue: string): boolean {
  return new Date(nextDue) <= new Date();
}

function formatDueDate(nextDue: string): string {
  const date = new Date(nextDue);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / 86400000);

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays < 7) return `Due in ${diffDays}d`;
  return `Due ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

const CareRemindersPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [reminders, setReminders] = useState<CareReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "due" | "upcoming">("all");

  const fetchReminders = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const data = await getCareReminders(user.id);
    setReminders(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to access this page.");
      setTimeout(() => {
        router.push(`/login?unauthorized=true&redirect=${encodeURIComponent(pathname)}`);
      }, 100);
      return;
    }
    fetchReminders();
  }, [user, router, pathname, fetchReminders]);

  const handleComplete = async (id: string) => {
    setCompletingId(id);
    const result = await completeCareReminder(id);
    if (result) {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? result : r))
      );
      toast.success("Marked as done!");
    } else {
      toast.error("Failed to complete reminder.");
    }
    setCompletingId(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const ok = await deleteCareReminder(id);
    if (ok) {
      setReminders((prev) => prev.filter((r) => r.id !== id));
      toast.success("Reminder deleted.");
    } else {
      toast.error("Failed to delete reminder.");
    }
    setDeletingId(null);
  };

  const filtered = reminders.filter((r) => {
    if (filter === "due") return isDue(r.nextDue);
    if (filter === "upcoming") return !isDue(r.nextDue);
    return true;
  });

  const dueCount = reminders.filter((r) => isDue(r.nextDue)).length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Care Reminders</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Track watering, pruning, and care schedules for your plants
            </p>
          </div>
        </div>

        {dueCount > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-200">
              You have <span className="font-semibold">{dueCount}</span>{" "}
              {dueCount === 1 ? "reminder" : "reminders"} that need attention
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 mt-6 mb-6">
          {(["all", "due", "upcoming"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? "bg-[#81a308] text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {f === "all" ? "All" : f === "due" ? "Needs Care" : "Upcoming"}
              {f === "due" && dueCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-white/20">
                  {dueCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#81a308] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium text-zinc-300 mb-2">
              {filter === "due"
                ? "All caught up!"
                : reminders.length === 0
                ? "No reminders yet"
                : "No upcoming reminders"}
            </h3>
            <p className="text-zinc-500 text-sm">
              {reminders.length === 0
                ? "Care reminders will appear here when you set them up for your plants."
                : filter === "due"
                ? "Your plants are all taken care of."
                : "Check back soon."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((reminder) => {
              const due = isDue(reminder.nextDue);
              return (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-xl border transition-all ${
                    due
                      ? "bg-amber-500/5 border-amber-500/20"
                      : "bg-zinc-900/60 border-zinc-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        due ? "bg-amber-500/10" : "bg-zinc-800"
                      }`}
                    >
                      {typeIcons[reminder.type] || (
                        <Leaf className="w-5 h-5 text-zinc-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white truncate">
                          {reminder.plant?.commonName ||
                            reminder.plant?.botanicalName ||
                            "Unknown Plant"}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                            due
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-zinc-700 text-zinc-300"
                          }`}
                        >
                          {typeLabels[reminder.type] || reminder.type}
                        </span>
                      </div>

                      <p
                        className={`text-sm mt-0.5 ${
                          due ? "text-amber-300" : "text-zinc-400"
                        }`}
                      >
                        {formatDueDate(reminder.nextDue)}
                      </p>

                      <p className="text-xs text-zinc-500 mt-1">
                        Every {reminder.frequency} {reminder.frequencyUnit}
                        {reminder.notes && ` \u00B7 ${reminder.notes}`}
                      </p>

                      {reminder.lastCompleted && (
                        <p className="text-xs text-zinc-600 mt-0.5">
                          Last done:{" "}
                          {new Date(reminder.lastCompleted).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleComplete(reminder.id)}
                        disabled={completingId === reminder.id}
                        className={`p-2 rounded-lg transition-all ${
                          due
                            ? "bg-[#81a308] hover:bg-[#6c8a0a] text-white"
                            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                        }`}
                        title="Mark as done"
                      >
                        {completingId === reminder.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        disabled={deletingId === reminder.id}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-all"
                        title="Delete reminder"
                      >
                        {deletingId === reminder.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareRemindersPage;
