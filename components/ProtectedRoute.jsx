"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
// import { useRouter } from 'nextjs-toploader/app';
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?from=${encodeURIComponent(currentPath)}`);
    }
  }, [isLoggedIn, router]);

  // If not logged in, don't render the children
  if (!isLoggedIn) {
    toast.error("You are not authorized or not logged in yet.");
    return null;
  }
  return children;
} 