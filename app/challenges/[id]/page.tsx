"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Trophy, Calendar, Users, Upload, Award, Clock } from "lucide-react";
import ChallengeTimer from "@/components/challenges/ChallengeTimer";
import SubmissionGrid from "@/components/challenges/SubmissionGrid";
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
  rules?: string;
  creator: {
    username: string;
    avatarUrl?: string;
  };
  submissions: any[];
}

export default function ChallengeDetailPage() {
  const params = useParams();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("submissions");

  useEffect(() => {
    if (params.id) {
      fetchChallenge();
    }
  }, [params.id]);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/challenges/${params.id}`
      );

      if (response.ok) {
        const data = await response.json();
        setChallenge(data);
      }
    } catch (error) {
      console.error("Error fetching challenge:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-400">
            Challenge not found
          </h2>
        </div>
      </div>
    );
  }

  const statusColors = {
    upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    active: "bg-green-500/10 text-green-400 border-green-500/30",
    voting: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    ended: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  };

  const statusColor =
    statusColors[challenge.status as keyof typeof statusColors] ||
    statusColors.upcoming;

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      {/* Header */}
      <div className="bg-[#1a1d2d] border-b border-[#2c2f38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/challenges" className="hover:text-green-400">
              Challenges
            </Link>
            <span>/</span>
            <span className="text-white">{challenge.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full border ${statusColor}`}
                >
                  {challenge.status.charAt(0).toUpperCase() +
                    challenge.status.slice(1)}
                </span>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  {challenge.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-white mb-3">
                {challenge.title}
              </h1>

              <p className="text-gray-400 mb-4">{challenge.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{challenge.submissions.length} submissions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(challenge.startDate).toLocaleDateString()} -{" "}
                    {new Date(challenge.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>by {challenge.creator.username}</span>
                </div>
              </div>
            </div>

            {(challenge.status === "active" ||
              challenge.status === "voting") && (
              <div className="md:w-80">
                <ChallengeTimer
                  endDate={challenge.endDate}
                  status={challenge.status}
                />
              </div>
            )}
          </div>

          {challenge.status === "active" && (
            <div className="mt-6">
              <Link
                href={`/challenges/${challenge.id}/submit`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Upload className="w-5 h-5" />
                Submit Your Entry
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#1a1d2d] border-b border-[#2c2f38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("submissions")}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === "submissions"
                  ? "border-green-500 text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Submissions ({challenge.submissions.length})
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === "leaderboard"
                  ? "border-green-500 text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Leaderboard
              </div>
            </button>
            {challenge.rules && (
              <button
                onClick={() => setActiveTab("rules")}
                className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === "rules"
                    ? "border-green-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Rules
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "submissions" && (
          <SubmissionGrid
            challengeId={challenge.id}
            submissions={challenge.submissions}
            canVote={challenge.status === "voting"}
            onVoteUpdate={fetchChallenge}
          />
        )}

        {activeTab === "leaderboard" && (
          <div className="bg-[#1a1d2d] border border-[#2c2f38] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Top Submissions</h2>
            {challenge.submissions.length === 0 ? (
              <p className="text-gray-400">No submissions yet</p>
            ) : (
              <div className="space-y-3">
                {[...challenge.submissions]
                  .sort((a, b) => b.voteCount - a.voteCount)
                  .slice(0, 10)
                  .map((submission, index) => (
                    <div
                      key={submission.id}
                      className="flex items-center gap-4 p-4 bg-[#0f1419] rounded-lg border border-[#2c2f38]"
                    >
                      <div
                        className={`text-2xl font-bold ${
                          index === 0
                            ? "text-yellow-500"
                            : index === 1
                            ? "text-gray-300"
                            : index === 2
                            ? "text-orange-400"
                            : "text-gray-500"
                        }`}
                      >
                        #{index + 1}
                      </div>
                      <div className="flex-grow">
                        <div className="font-semibold">{submission.title}</div>
                        <div className="text-sm text-gray-400">
                          by {submission.user.username}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-400">
                          {submission.voteCount}
                        </div>
                        <div className="text-xs text-gray-500">votes</div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "rules" && challenge.rules && (
          <div className="bg-[#1a1d2d] border border-[#2c2f38] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Challenge Rules</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-wrap">
                {challenge.rules}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
