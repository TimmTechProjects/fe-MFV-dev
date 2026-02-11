"use client";

import { useEffect, useState, useRef } from "react";
import { Leaf, Microscope, Users, MessageCircle } from "lucide-react";
import { getHomepageStats, getAllPlants } from "@/lib/utils";

interface Stats {
  totalPlants: number;
  totalSpecies: number;
  totalUsers: number;
  totalForumPosts: number;
}

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || target === 0) return;

    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [started, target, duration]);

  const formatted =
    count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k` : count.toLocaleString();

  return <span ref={ref}>{formatted}</span>;
}

export default function QuickStatsBanner() {
  const [stats, setStats] = useState<Stats>({
    totalPlants: 0,
    totalSpecies: 0,
    totalUsers: 0,
    totalForumPosts: 0,
  });

  useEffect(() => {
    getHomepageStats()
      .then((data) => {
        if (data.totalPlants > 0) {
          setStats(data);
        } else {
          return getAllPlants().then((allData) => {
            const types = new Set(allData.plants.map((p) => p.type).filter(Boolean));
            setStats({
              totalPlants: allData.total || allData.plants.length,
              totalSpecies: types.size,
              totalUsers: 0,
              totalForumPosts: 0,
            });
          });
        }
      })
      .catch(() => {});
  }, []);

  const hasAnyStats = stats.totalPlants > 0 || stats.totalSpecies > 0;

  if (!hasAnyStats) return null;

  const statItems = [
    {
      icon: Leaf,
      value: stats.totalPlants,
      label: "Plants in Vault",
      color: "text-[#81a308]",
    },
    ...(stats.totalSpecies > 0
      ? [
          {
            icon: Microscope,
            value: stats.totalSpecies,
            label: "Species Identified",
            color: "text-emerald-400",
          },
        ]
      : []),
    ...(stats.totalUsers > 0
      ? [
          {
            icon: Users,
            value: stats.totalUsers,
            label: "Plant Lovers",
            color: "text-blue-400",
          },
        ]
      : []),
    ...(stats.totalForumPosts > 0
      ? [
          {
            icon: MessageCircle,
            value: stats.totalForumPosts,
            label: "Forum Posts",
            color: "text-amber-400",
          },
        ]
      : []),
  ];

  return (
    <section className="w-full py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-r from-[#81a308]/10 via-emerald-500/10 to-[#81a308]/10 dark:from-[#81a308]/5 dark:via-emerald-500/5 dark:to-[#81a308]/5 border border-[#81a308]/20 p-6 sm:p-8">
          <div
            className={`grid gap-6 sm:gap-8 ${
              statItems.length === 1
                ? "grid-cols-1"
                : statItems.length === 2
                  ? "grid-cols-2"
                  : statItems.length === 3
                    ? "grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-4"
            }`}
          >
            {statItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="text-center">
                  <Icon
                    className={`w-6 h-6 sm:w-8 sm:h-8 ${item.color} mx-auto mb-2`}
                  />
                  <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                    <AnimatedCounter target={item.value} />
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
