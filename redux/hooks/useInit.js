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
      const result = await apiget("api/auth/authenticate");

      if (result?.data?.user) {
        dispatch(setUser(result.data.user));
        dispatch(setIsLoggedIn(true));

        // if (
        //   window.location.pathname.includes("login") ||
        //   window.location.pathname.includes("signup")
        // ) {
        //   router.push("/");
        // }
      } else {
        console.error("Authentication error");
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
