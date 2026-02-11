"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#121212] px-6 text-zinc-900 dark:text-white text-center">
      <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
        <AlertTriangle className="text-yellow-400 w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        An unexpected error occurred. Please try again or return home.
      </p>
      {error?.message && (
        <p className="text-xs text-gray-600 mb-6 max-w-md font-mono bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded-lg">
          {error.message}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          onClick={() => reset()}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white transition rounded-full px-6"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>

        <Button
          onClick={() => router.push("/")}
          className="bg-[#81a308] hover:bg-[#6ca148] text-white rounded-full px-6"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
