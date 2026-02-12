"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface VoteButtonProps {
  challengeId: string;
  submissionId: string;
  onVoteUpdate: () => void;
}

export default function VoteButton({
  challengeId,
  submissionId,
  onVoteUpdate,
}: VoteButtonProps) {
  const { user } = useAuth();
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Check if user has already voted for this submission
    // For now, we'll rely on backend to reject duplicate votes
  }, [submissionId]);

  const handleVote = async () => {
    if (!user) {
      alert("Please log in to vote");
      return;
    }

    setLoading(true);

    try {
      const token = await user.getIdToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/challenges/${challengeId}/vote/${submissionId}`;

      const response = await fetch(url, {
        method: hasVoted ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setHasVoted(!hasVoted);
        onVoteUpdate();
      } else {
        const error = await response.json();
        if (error.error === "You have already voted for this submission") {
          setHasVoted(true);
        } else {
          alert(error.error || "Failed to vote");
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
        hasVoted
          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
          : "bg-gray-700 text-gray-300 hover:bg-red-500/20 hover:text-red-400"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Heart
        className={`w-4 h-4 ${hasVoted ? "fill-current" : ""}`}
        aria-hidden="true"
      />
      <span>{hasVoted ? "Voted" : "Vote"}</span>
    </button>
  );
}
