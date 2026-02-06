"use client";
import { useDispatch, useSelector } from "react-redux";
import { _getLogin, _getSignup } from "../Actions/authAction";
import { setUser, setIsLoggedIn, resetAuth } from "../slices/authSlice";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { apiget, apipost, apiput } from "../api";
import { useRouter } from "next/navigation";

const firebaseConfig = {
  apiKey: "AIzaSyAVuw-y3QBUExrYQVcyOXKPSlpsddqJ_K4",
  authDomain: "potential-641e8.firebaseapp.com",
  projectId: "potential-641e8",
  storageBucket: "potential-641e8.firebasestorage.app",
  messagingSenderId: "241521864207",
  appId: "1:241521864207:web:3f8bfa1b81e8e680d8fd7a",
  measurementId: "G-C7WGHXBZY2",
};

const useAuth = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const getLogin = (data, successCallBack, failCallBack) => {
    dispatch(_getLogin(data, successCallBack, failCallBack));
  };
  const getSignup = (data, successCallBack, failCallBack) => {
    dispatch(_getSignup(data, successCallBack, failCallBack));
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("🚀 ~ signInWithGoogle ~ result:", result);
      if (result?.user) {
        const idToken = await result?.user?.getIdToken();
        const storedUser = await apipost("api/v1/auth/google-login", {
          idToken,
        });
        document.cookie = `token=${storedUser?.data?.token}; path=/; max-age=${
          60 * 60 * 24 * 7
        }; sameSite=lax`;
        localStorage.setItem("token", storedUser?.data?.token);
        localStorage.setItem("user", JSON.stringify(storedUser?.data?.user));
        dispatch(setUser(storedUser?.data?.user));
        dispatch(setIsLoggedIn(true));
        return storedUser;
      }
      return null;
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      return null;
    }
  };

  const LogoutUser = () => {
    dispatch(resetAuth());
    dispatch(setIsLoggedIn(false));
    router.push("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0; sameSite=lax";
  };

  const verifyEmail = async (token, successCallBack, failCallBack) => {
    try {
      const res = await apiget(`api/v1/auth/verify-email/${token}`);
      if (res.data) {
        successCallBack?.(res?.data);
      }
    } catch (error) {
      console.log({ error });
      failCallBack?.(error);
    }
  };

  const EditProfile = async (data) => {
    try {
      const res = await apiput(`api/v1/auth/update-profile`, data);
      return res?.data || null;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  };

  const GetProfile = async (username) => {
    try {
      const res = await apiget(`api/v1/auth/get-profile?username=${username}`);
      return res?.data || null;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  };

  return {
    user,
    getLogin,
    getSignup,
    signInWithGoogle,
    LogoutUser,
    verifyEmail,
    isLoggedIn,
    EditProfile,
    GetProfile,
  };
};

export default useAuth;
