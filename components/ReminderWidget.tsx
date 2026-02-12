"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDueCareReminders, completeCareReminder, type CareReminder } from "@/lib/utils";
import { Droplets, Sun, Scissors, Leaf, Loader2, Check, Bell, AlertCircle } from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  water: <Droplets className="w-4 h-4 text-blue-400" />,
  sunlight: <Sun className="w-4 h-4 text-yellow-400" />,
  pruning: <Scissors className="w-4 h-4 text-orange-400" />,
  fertilize: <Leaf className="w-4 h-4 text-emerald-400" />,
};

const typeLabels: Record<string, string> = {
  water: "Water",
  sunlight: "Sunlight",
  pruning: "Pruning",
  fertilize: "Fertilize",
};

interface ReminderWidgetProps {
  userId: string;
}

const ReminderWidget: React.FC<ReminderWidgetProps> = ({ userId }) => {
  const router = useRouter();
  const [reminders, setReminders] = useState<CareReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDueReminders();
  }, [userId]);

  const fetchDueReminders = async () => {
    setLoading(true);
    const data = await getDueCareReminders(userId);
    setReminders(data);
    setLoading(false);
  };

  const handleComplete = async (id: string) => {
    setCompletingId(id);
    const result = await completeCareReminder(id);
    if (result) {
      setReminders((prev) => prev.filter((r) => r.id !== id));
    }
    setCompletingId(null);
  };

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold">Care Reminders</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#81a308] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${reminders.length > 0 ? 'bg-amber-500/10' : 'bg-zinc-800'}`}>
            <Bell className={`w-5 h-5 ${reminders.length > 0 ? 'text-amber-400' : 'text-zinc-400'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Care Reminders</h3>
            {reminders.length > 0 && (
              <p className="text-xs text-amber-300">
                {reminders.length} {reminders.length === 1 ? "plant needs" : "plants need"} attention
              </p>
            )}
          </div>
        </div>
        <Link
          href="/care-reminders"
          className="text-sm text-[#81a308] hover:text-[#6c8a0a] transition-colors"
        >
          View All
        </Link>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-zinc-500" />
          </div>
          <p className="text-sm text-zinc-400">All caught up!</p>
          <p className="text-xs text-zinc-500 mt-1">Your plants are all taken care of</p>
        </div>
      ) : (
        <div className="space-y-2">
          {reminders.slice(0, 5).map((reminder) => (
            <div
              key={reminder.id}
              className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-center gap-3"
            >
              <div className="p-1.5 rounded-lg bg-amber-500/10 flex-shrink-0">
                {typeIcons[reminder.type] || <Leaf className="w-4 h-4 text-zinc-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {reminder.plant?.commonName || reminder.plant?.botanicalName || "Unknown Plant"}
                </p>
                <p className="text-xs text-amber-300">
                  {typeLabels[reminder.type] || reminder.type} needed
                </p>
              </div>

              <button
                onClick={() => handleComplete(reminder.id)}
                disabled={completingId === reminder.id}
                className="p-2 rounded-lg bg-[#81a308] hover:bg-[#6c8a0a] text-white transition-all flex-shrink-0"
                title="Mark as done"
              >
                {completingId === reminder.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}

          {reminders.length > 5 && (
            <Link
              href="/care-reminders"
              className="block text-center py-2 text-sm text-zinc-400 hover:text-[#81a308] transition-colors"
            >
              +{reminders.length - 5} more reminders
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ReminderWidget;
