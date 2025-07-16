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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] px-6 text-white text-center">
      <AlertTriangle className="text-yellow-400 w-12 h-12 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-sm text-muted-foreground mb-6">
        An unexpected error occurred. Please try again or return home.
      </p>

      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white transition"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>

        <Button
          onClick={() => router.push("/")}
          className="bg-[#81a308] hover:bg-[#6ca148] text-white"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
