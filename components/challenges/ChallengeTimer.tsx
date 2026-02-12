"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface ChallengeTimerProps {
  endDate: string;
  status: string;
}

export default function ChallengeTimer({ endDate, status }: ChallengeTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    return (
      <div className="flex items-center gap-2 text-red-400 text-sm">
        <Clock className="w-4 h-4" />
        <span>Ended</span>
      </div>
    );
  }

  const label = status === "active" ? "Ends in" : "Voting ends in";

  return (
    <div className="bg-[#0f1419] border border-[#2c2f38] rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-green-400" />
        <span className="text-xs text-gray-400 font-medium">{label}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="text-lg font-bold text-white">{timeLeft.days}</div>
          <div className="text-xs text-gray-500">Days</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">{timeLeft.hours}</div>
          <div className="text-xs text-gray-500">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">{timeLeft.minutes}</div>
          <div className="text-xs text-gray-500">Mins</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">{timeLeft.seconds}</div>
          <div className="text-xs text-gray-500">Secs</div>
        </div>
      </div>
    </div>
  );
}
