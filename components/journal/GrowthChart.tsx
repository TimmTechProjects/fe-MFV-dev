"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, Heart } from "lucide-react";

interface Measurement {
  date: string;
  height?: number;
  width?: number;
  healthScore?: number;
}

interface GrowthChartProps {
  measurements: Measurement[];
}

export function GrowthChart({ measurements }: GrowthChartProps) {
  if (!measurements || measurements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Growth Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No measurements recorded yet. Start adding measurements to see growth charts!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate growth stats
  const heightData = measurements.filter((m) => m.height).map((m) => m.height!);
  const widthData = measurements.filter((m) => m.width).map((m) => m.width!);
  const healthData = measurements.filter((m) => m.healthScore).map((m) => m.healthScore!);

  const avgHeight = heightData.length > 0
    ? (heightData.reduce((a, b) => a + b, 0) / heightData.length).toFixed(1)
    : "N/A";
  const avgWidth = widthData.length > 0
    ? (widthData.reduce((a, b) => a + b, 0) / widthData.length).toFixed(1)
    : "N/A";
  const avgHealth = healthData.length > 0
    ? (healthData.reduce((a, b) => a + b, 0) / healthData.length).toFixed(1)
    : "N/A";

  const latestHeight = heightData.length > 0 ? heightData[heightData.length - 1] : "N/A";
  const latestWidth = widthData.length > 0 ? widthData[widthData.length - 1] : "N/A";
  const latestHealth = healthData.length > 0 ? healthData[healthData.length - 1] : "N/A";

  // Calculate growth rate (if we have at least 2 measurements)
  const growthRate = heightData.length >= 2
    ? ((heightData[heightData.length - 1] - heightData[0]) / heightData.length).toFixed(2)
    : "N/A";

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Growth Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Height */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Height</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{latestHeight}"</p>
                <p className="text-xs text-muted-foreground">
                  Average: {avgHeight}"
                </p>
              </div>
            </div>

            {/* Width */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Width</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{latestWidth}"</p>
                <p className="text-xs text-muted-foreground">
                  Average: {avgWidth}"
                </p>
              </div>
            </div>

            {/* Health Score */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">Health</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{latestHealth}/10</p>
                <p className="text-xs text-muted-foreground">
                  Average: {avgHealth}/10
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Growth Rate</span>
              <span className="text-lg font-bold text-emerald-600">
                {growthRate !== "N/A" ? `+${growthRate}" per entry` : "N/A"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {measurements.length} recorded measurements
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Simple visual representation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Height Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {heightData.slice(-5).map((height, idx) => {
              const maxHeight = Math.max(...heightData);
              const percentage = (height / maxHeight) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Entry {measurements.length - 4 + idx}</span>
                    <span className="font-medium">{height}"</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
