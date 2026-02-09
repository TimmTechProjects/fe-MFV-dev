"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] px-6 text-white text-center">
      <h1 className="text-7xl font-bold text-[#81a308] mb-2">404</h1>
      <p className="text-xl font-semibold mb-1">Page not found</p>
      <p className="text-sm text-gray-400 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2 border-gray-700 text-white hover:bg-gray-800 transition rounded-full px-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>

        <Button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 bg-[#81a308] hover:bg-[#7fa148] text-white transition rounded-full px-6"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Button>
      </div>
    </div>
  );
}
