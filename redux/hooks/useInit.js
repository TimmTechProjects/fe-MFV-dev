"use client";
import { useEffect, useState } from "react";
import { setUser, setIsLoggedIn } from "../slices/authSlice";
import { useRouter } from "next/navigation";
import { apiget } from "../api";
import { useDispatch } from "react-redux";

export default function useAppInit() {
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const __init = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      if (!token) {
        setInitialized(true);
        return;
      }

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        dispatch(setUser(parsedUser));
        dispatch(setIsLoggedIn(true));
      } else {
        console.warn("Token found but no user stored locally.");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      if (error?.code === 401) {
        // localStorage.removeItem("token");
        // document.cookie = "token=; path=/; max-age=0; sameSite=lax";
        // router.push("/login");
      }
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };
  useEffect(() => {
    if (!initialized) {
      __init();
    }
  }, [initialized]);

  return { loading, initialized, __init };
}
