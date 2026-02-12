"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Calendar, Users, Plus } from "lucide-react";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import ChallengeTimer from "@/components/challenges/ChallengeTimer";
import Link from "next/link";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  status: string;
  prizes?: any;
  _count: {
    submissions: number;
  };
  creator: {
    username: string;
    avatarUrl?: string;
  };
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, [filter]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const query = filter !== "all" ? `?status=${filter}` : "";
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/challenges${query}`);
      
      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
      }
    } catch (error) {
      console.error("Error fetching challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterButtons = [
    { value: "all", label: "All Challenges" },
    { value: "upcoming", label: "Upcoming" },
    { value: "active", label: "Active" },
    { value: "voting", label: "Voting" },
    { value: "ended", label: "Ended" },
  ];

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      {/* Header */}
      <div className="bg-[#1a1d2d] border-b border-[#2c2f38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <h1 className="text-3xl font-bold text-white">
                  Plant Challenges
                </h1>
              </div>
              <p className="text-gray-400">
                Compete with fellow growers, showcase your plants, and win prizes!
              </p>
            </div>
            {/* TODO: Add admin check */}
            {/* <Link
              href="/challenges/create"
              className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Challenge
            </Link> */}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1d2d] border-b border-[#2c2f38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-3">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === btn.value
                    ? "bg-green-600 text-white"
                    : "bg-[#2c2f38] text-gray-400 hover:bg-[#363942]"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">
              No challenges found
            </h2>
            <p className="text-gray-500">
              Check back later for new challenges!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-[#1a1d2d] border-t border-[#2c2f38] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-1">
                {challenges.length}
              </div>
              <div className="text-sm text-gray-400">Total Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-1">
                {challenges.filter((c) => c.status === "active").length}
              </div>
              <div className="text-sm text-gray-400">Active Now</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-1">
                {challenges.reduce((sum, c) => sum + c._count.submissions, 0)}
              </div>
              <div className="text-sm text-gray-400">Total Submissions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-1">
                {challenges.filter((c) => c.status === "voting").length}
              </div>
              <div className="text-sm text-gray-400">Voting Now</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
