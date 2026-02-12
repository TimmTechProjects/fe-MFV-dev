"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Upload } from "lucide-react";

interface EntryFormData {
  title?: string;
  notes?: string;
  photos?: string[];
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
  activities?: string[];
  date?: Date;
}

interface EntryFormProps {
  initialData?: EntryFormData;
  onSubmit: (data: EntryFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const commonActivities = [
  "Watered",
  "Fertilized",
  "Pruned",
  "Repotted",
  "Transplanted",
  "Pest Treatment",
  "Disease Treatment",
];

export function EntryForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: EntryFormProps) {
  const [formData, setFormData] = useState<EntryFormData>(
    initialData || {
      title: "",
      notes: "",
      photos: [],
      measurements: {},
      conditions: {},
      activities: [],
    }
  );
  const [customActivity, setCustomActivity] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const updateMeasurement = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [key]: value ? parseFloat(value) : undefined,
      },
    }));
  };

  const updateCondition = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [key]: value || undefined,
      },
    }));
  };

  const toggleActivity = (activity: string) => {
    setFormData((prev) => {
      const activities = prev.activities || [];
      const exists = activities.includes(activity);
      return {
        ...prev,
        activities: exists
          ? activities.filter((a) => a !== activity)
          : [...activities, activity],
      };
    });
  };

  const addCustomActivity = () => {
    if (customActivity.trim()) {
      toggleActivity(customActivity.trim());
      setCustomActivity("");
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Entry Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., First signs of flowering"
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="datetime-local"
              value={
                formData.date
                  ? new Date(formData.date).toISOString().slice(0, 16)
                  : new Date().toISOString().slice(0, 16)
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  date: new Date(e.target.value),
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={5}
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Describe what you observed today..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {formData.photos && formData.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {formData.photos.map((photo, idx) => (
                  <div key={idx} className="relative aspect-square">
                    <img
                      src={photo}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Button type="button" variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Upload Photos
            </Button>
            <p className="text-xs text-muted-foreground">
              Photo upload integration needed (UploadThing)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Measurements */}
      <Card>
        <CardHeader>
          <CardTitle>Measurements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="height">Height (inches)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={formData.measurements?.height || ""}
                onChange={(e) => updateMeasurement("height", e.target.value)}
                placeholder="12.5"
              />
            </div>
            <div>
              <Label htmlFor="width">Width (inches)</Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                value={formData.measurements?.width || ""}
                onChange={(e) => updateMeasurement("width", e.target.value)}
                placeholder="8.0"
              />
            </div>
            <div>
              <Label htmlFor="healthScore">Health (1-10)</Label>
              <Input
                id="healthScore"
                type="number"
                min="1"
                max="10"
                value={formData.measurements?.healthScore || ""}
                onChange={(e) => updateMeasurement("healthScore", e.target.value)}
                placeholder="8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Growing Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="temperature">Temperature (°F)</Label>
              <Input
                id="temperature"
                type="number"
                value={formData.conditions?.temperature || ""}
                onChange={(e) => updateCondition("temperature", e.target.value)}
                placeholder="72"
              />
            </div>
            <div>
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input
                id="humidity"
                type="number"
                min="0"
                max="100"
                value={formData.conditions?.humidity || ""}
                onChange={(e) => updateCondition("humidity", e.target.value)}
                placeholder="60"
              />
            </div>
            <div>
              <Label htmlFor="lightLevel">Light Level</Label>
              <select
                id="lightLevel"
                value={formData.conditions?.lightLevel || ""}
                onChange={(e) => updateCondition("lightLevel", e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">Select...</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Full Sun">Full Sun</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {commonActivities.map((activity) => (
              <Button
                key={activity}
                type="button"
                variant={
                  formData.activities?.includes(activity) ? "default" : "outline"
                }
                size="sm"
                onClick={() => toggleActivity(activity)}
              >
                {activity}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={customActivity}
              onChange={(e) => setCustomActivity(e.target.value)}
              placeholder="Add custom activity..."
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomActivity())}
            />
            <Button type="button" onClick={addCustomActivity} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {formData.activities && formData.activities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.activities
                .filter((a) => !commonActivities.includes(a))
                .map((activity, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleActivity(activity)}
                  >
                    {activity}
                    <X className="w-3 h-3 ml-1" />
                  </Button>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Entry"}
        </Button>
      </div>
    </form>
  );
}
