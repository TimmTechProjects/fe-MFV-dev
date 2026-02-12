"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, User, Calendar } from "lucide-react";
import VoteButton from "./VoteButton";

interface Submission {
  id: string;
  title: string;
  description?: string;
  photos: string[];
  voteCount: number;
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  plant?: {
    commonName: string;
    botanicalName: string;
  };
  createdAt: string;
}

interface SubmissionGridProps {
  challengeId: string;
  submissions: Submission[];
  canVote: boolean;
  onVoteUpdate: () => void;
}

export default function SubmissionGrid({
  challengeId,
  submissions,
  canVote,
  onVoteUpdate,
}: SubmissionGridProps) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">🌱</div>
        <h2 className="text-xl font-semibold text-gray-400 mb-2">
          No submissions yet
        </h2>
        <p className="text-gray-500">
          Be the first to submit your entry!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className="bg-[#1a1d2d] border border-[#2c2f38] rounded-lg overflow-hidden hover:border-green-500/50 transition-all duration-300"
        >
          {/* Image */}
          <div className="relative aspect-square bg-[#0f1419]">
            {submission.photos.length > 0 ? (
              <Image
                src={submission.photos[0]}
                alt={submission.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                <span className="text-6xl">🌿</span>
              </div>
            )}
            
            {/* Vote Count Badge */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-white">
                {submission.voteCount}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
              {submission.title}
            </h3>

            {submission.description && (
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {submission.description}
              </p>
            )}

            {submission.plant && (
              <div className="mb-3 text-sm">
                <div className="text-green-400 font-medium">
                  {submission.plant.commonName}
                </div>
                <div className="text-gray-500 italic">
                  {submission.plant.botanicalName}
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="flex items-center justify-between pt-3 border-t border-[#2c2f38]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                  {submission.user.avatarUrl ? (
                    <Image
                      src={submission.user.avatarUrl}
                      alt={submission.user.username}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="text-sm">
                  <div className="text-white font-medium">
                    {submission.user.username}
                  </div>
                  <div className="text-gray-500 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {canVote && (
                <VoteButton
                  challengeId={challengeId}
                  submissionId={submission.id}
                  onVoteUpdate={onVoteUpdate}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
