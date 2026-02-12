import React from "react";
import Link from "next/link";
import { Trophy, Calendar, Users, Clock } from "lucide-react";
import ChallengeTimer from "./ChallengeTimer";

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

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const statusColors = {
    upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    active: "bg-green-500/10 text-green-400 border-green-500/30",
    voting: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    ended: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  };

  const statusColor = statusColors[challenge.status as keyof typeof statusColors] || statusColors.upcoming;

  return (
    <Link href={`/challenges/${challenge.id}`}>
      <div className="bg-[#1a1d2d] border border-[#2c2f38] rounded-lg overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 cursor-pointer h-full flex flex-col">
        {/* Header */}
        <div className="p-6 flex-grow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className={`text-xs font-medium px-2 py-1 rounded-full border ${statusColor}`}>
                {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
            {challenge.title}
          </h3>

          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {challenge.description}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
              {challenge.category}
            </span>
          </div>

          {/* Timer */}
          {(challenge.status === "active" || challenge.status === "voting") && (
            <div className="mb-4">
              <ChallengeTimer endDate={challenge.endDate} status={challenge.status} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0f1419] border-t border-[#2c2f38]">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-400">
                <Users className="w-4 h-4" />
                <span>{challenge._count.submissions} entries</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date(challenge.startDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          {challenge.prizes && (
            <div className="mt-3 text-xs text-yellow-400 flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              <span>Prizes available</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
