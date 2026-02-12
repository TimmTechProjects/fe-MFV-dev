"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/redux/hooks/useAuth";
import { toast } from "sonner";
import { Bell, Loader2, Check, X } from "lucide-react";

interface NotificationPreferences {
  id: string;
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  quietStart: string | null;
  quietEnd: string | null;
  enabledTypes: string[];
  createdAt: string;
  updatedAt: string;
}

const REMINDER_TYPES = [
  { id: "water", label: "Watering reminders", icon: "💧" },
  { id: "fertilize", label: "Fertilizing reminders", icon: "🌱" },
  { id: "pruning", label: "Pruning reminders", icon: "✂️" },
  { id: "repot", label: "Repotting reminders", icon: "🪴" },
];

const NotificationSettingsPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to access this page.");
      router.push("/login");
      return;
    }

    // Check if push notifications are supported
    if ("Notification" in window && "serviceWorker" in navigator) {
      setPushSupported(true);
      setPushPermission(Notification.permission);
    }

    fetchPreferences();
  }, [user, router]);

  const fetchPreferences = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/preferences/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      } else {
        toast.error("Failed to load notification preferences");
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      toast.error("Failed to load notification preferences");
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    if (!user?.id) return;
    setSaving(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/preferences/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
        toast.success("Preferences updated");
      } else {
        toast.error("Failed to update preferences");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  const handlePushToggle = async () => {
    if (!pushSupported) {
      toast.error("Push notifications are not supported in your browser");
      return;
    }

    if (pushPermission === "denied") {
      toast.error("Push notifications are blocked. Please enable them in your browser settings.");
      return;
    }

    if (!preferences?.pushEnabled) {
      // Enable push notifications
      try {
        const permission = await Notification.requestPermission();
        setPushPermission(permission);

        if (permission === "granted") {
          // Register service worker and subscribe to push
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          });

          // Send subscription to backend
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/push/subscribe`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              userId: user?.id,
              subscription: subscription.toJSON(),
            }),
          });

          await updatePreferences({ pushEnabled: true });
          toast.success("Push notifications enabled!");
        } else {
          toast.error("Push notification permission denied");
        }
      } catch (error) {
        console.error("Error enabling push notifications:", error);
        toast.error("Failed to enable push notifications");
      }
    } else {
      // Disable push notifications
      await updatePreferences({ pushEnabled: false });
      toast.success("Push notifications disabled");
    }
  };

  const handleTypeToggle = (typeId: string) => {
    if (!preferences) return;

    const enabledTypes = preferences.enabledTypes.includes(typeId)
      ? preferences.enabledTypes.filter((t) => t !== typeId)
      : [...preferences.enabledTypes, typeId];

    updatePreferences({ enabledTypes });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Bell className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Notification Settings</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Manage how you receive care reminders
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#81a308] animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Push Notifications */}
            <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Push Notifications</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Get instant alerts when your plants need care
                  </p>
                  {!pushSupported && (
                    <p className="text-xs text-amber-400 mt-1">
                      Not supported in your browser
                    </p>
                  )}
                  {pushPermission === "denied" && (
                    <p className="text-xs text-red-400 mt-1">
                      Blocked - please enable in browser settings
                    </p>
                  )}
                </div>
                <button
                  onClick={handlePushToggle}
                  disabled={!pushSupported || saving}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    preferences?.pushEnabled ? "bg-[#81a308]" : "bg-zinc-700"
                  } ${!pushSupported ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      preferences?.pushEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Email Notifications */}
            <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Email Notifications</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Receive daily digest of care reminders via email
                  </p>
                </div>
                <button
                  onClick={() => updatePreferences({ emailEnabled: !preferences?.emailEnabled })}
                  disabled={saving}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    preferences?.emailEnabled ? "bg-[#81a308]" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      preferences?.emailEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Reminder Types */}
            <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4">Reminder Types</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Choose which types of reminders you want to receive
              </p>
              <div className="space-y-3">
                {REMINDER_TYPES.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <span className="text-sm">{type.label}</span>
                    </div>
                    <button
                      onClick={() => handleTypeToggle(type.id)}
                      disabled={saving}
                      className={`p-1.5 rounded-lg transition-colors ${
                        preferences?.enabledTypes.includes(type.id)
                          ? "bg-[#81a308] text-white"
                          : "bg-zinc-700 text-zinc-400"
                      }`}
                    >
                      {preferences?.enabledTypes.includes(type.id) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4">Quiet Hours</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Don't send notifications during these hours
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start</label>
                  <input
                    type="time"
                    value={preferences?.quietStart || ""}
                    onChange={(e) => updatePreferences({ quietStart: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-[#81a308] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End</label>
                  <input
                    type="time"
                    value={preferences?.quietEnd || ""}
                    onChange={(e) => updatePreferences({ quietEnd: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-[#81a308] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
