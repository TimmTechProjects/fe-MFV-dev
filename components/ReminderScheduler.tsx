"use client";

import React, { useState, useEffect } from "react";
import { createCareReminder, getCareReminders, deleteCareReminder, type CareReminder } from "@/lib/utils";
import useAuth from "@/redux/hooks/useAuth";
import { toast } from "sonner";
import { Bell, Plus, X, Droplets, Sun, Scissors, Leaf, Loader2, Trash2 } from "lucide-react";

interface ReminderSchedulerProps {
  plantId: string;
  plantName: string;
}

const REMINDER_TYPES = [
  { id: "water", label: "Watering", icon: Droplets, color: "text-blue-400" },
  { id: "fertilize", label: "Fertilizing", icon: Leaf, color: "text-emerald-400" },
  { id: "pruning", label: "Pruning", icon: Scissors, color: "text-orange-400" },
  { id: "sunlight", label: "Sunlight", icon: Sun, color: "text-yellow-400" },
];

const FREQUENCY_UNITS = [
  { id: "hours", label: "Hours" },
  { id: "days", label: "Days" },
  { id: "weeks", label: "Weeks" },
  { id: "months", label: "Months" },
];

const ReminderScheduler: React.FC<ReminderSchedulerProps> = ({ plantId, plantName }) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [reminders, setReminders] = useState<CareReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: "water",
    frequency: 7,
    frequencyUnit: "days",
    notes: "",
  });

  useEffect(() => {
    if (user?.id) {
      fetchReminders();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchReminders = async () => {
    if (!user?.id) return;
    setLoading(true);
    const data = await getCareReminders(user.id);
    const plantReminders = data.filter((r) => r.plantId === plantId);
    setReminders(plantReminders);
    setLoading(false);
  };

  const calculateNextDue = () => {
    const now = new Date();
    const msPerUnit: Record<string, number> = {
      hours: 3600000,
      days: 86400000,
      weeks: 604800000,
      months: 2592000000,
    };
    const interval = formData.frequency * (msPerUnit[formData.frequencyUnit] || 86400000);
    return new Date(now.getTime() + interval).toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("You must be logged in to create reminders");
      return;
    }

    setSaving(true);

    const nextDue = calculateNextDue();
    const result = await createCareReminder({
      userId: user.id,
      plantId,
      type: formData.type,
      frequency: formData.frequency,
      frequencyUnit: formData.frequencyUnit,
      nextDue,
      notes: formData.notes || undefined,
    });

    if (result) {
      toast.success("Reminder created!");
      setReminders([...reminders, result]);
      setShowForm(false);
      setFormData({
        type: "water",
        frequency: 7,
        frequencyUnit: "days",
        notes: "",
      });
    } else {
      toast.error("Failed to create reminder");
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const ok = await deleteCareReminder(id);
    if (ok) {
      setReminders(reminders.filter((r) => r.id !== id));
      toast.success("Reminder deleted");
    } else {
      toast.error("Failed to delete reminder");
    }
    setDeletingId(null);
  };

  if (!user) {
    return (
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-5 h-5 text-zinc-400" />
          <h3 className="text-lg font-semibold">Care Reminders</h3>
        </div>
        <p className="text-sm text-zinc-400">
          Log in to set care reminders for this plant
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold">Care Reminders</h3>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-3 py-1.5 rounded-lg bg-[#81a308] hover:bg-[#6c8a0a] text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Reminder
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#81a308] animate-spin" />
        </div>
      ) : (
        <>
          {/* Existing Reminders */}
          {reminders.length > 0 && (
            <div className="space-y-2 mb-4">
              {reminders.map((reminder) => {
                const typeConfig = REMINDER_TYPES.find((t) => t.id === reminder.type);
                const Icon = typeConfig?.icon || Bell;
                return (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${typeConfig?.color || "text-zinc-400"}`} />
                      <div>
                        <p className="text-sm font-medium">
                          {typeConfig?.label || reminder.type}
                        </p>
                        <p className="text-xs text-zinc-400">
                          Every {reminder.frequency} {reminder.frequencyUnit}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(reminder.id)}
                      disabled={deletingId === reminder.id}
                      className="p-1.5 rounded-lg bg-zinc-700 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                    >
                      {deletingId === reminder.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Reminder Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">New Reminder</h4>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {REMINDER_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.id })}
                        className={`p-3 rounded-lg border transition-all ${
                          formData.type === type.id
                            ? "bg-[#81a308] border-[#81a308] text-white"
                            : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600"
                        }`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${formData.type === type.id ? "text-white" : type.color}`} />
                        <span className="text-xs">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Frequency</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.frequency}
                    onChange={(e) =>
                      setFormData({ ...formData, frequency: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-[#81a308] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Unit</label>
                  <select
                    value={formData.frequencyUnit}
                    onChange={(e) => setFormData({ ...formData, frequencyUnit: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-[#81a308] focus:outline-none"
                  >
                    {FREQUENCY_UNITS.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any special instructions..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-[#81a308] focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#81a308] hover:bg-[#6c8a0a] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    "Create Reminder"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {!showForm && reminders.length === 0 && (
            <p className="text-sm text-zinc-400 text-center py-4">
              No reminders set for {plantName}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ReminderScheduler;
