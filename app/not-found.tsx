"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] px-6 text-white text-center">
      <h1 className="text-5xl font-bold text-[#81a308] mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black hover:text-black hover:bg-fuchsia-300 transition ease-in-out"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>

        <Button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 bg-[#81a308] hover:bg-[#7fa148] text-white transition"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Button>
      </div>
    </div>
  );
}
