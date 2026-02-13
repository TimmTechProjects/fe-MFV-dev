"use client";

import axios from "axios";
import { setUser, setIsLoggedIn, resetAuth } from "../slices/authSlice";
import { toast } from "sonner";
import { constant } from "../api";

export const _getLogin = (data, successCallBack, failCallBack) => {
  return async (dispatch, getState) => {
    try {
      const req = await axios.post(constant().baseUrl + "api/auth/login", data);
      if (req.data) {
        successCallBack?.(req?.data);
        localStorage.setItem("token", req?.data?.token);
        localStorage.setItem("user", JSON.stringify(req?.data?.user));
        document.cookie = `token=${req?.data?.token}; path=/; max-age=${
          60 * 60 * 24 * 7
        }; sameSite=lax`;
        dispatch(setUser(req?.data?.user));
        dispatch(setIsLoggedIn(true));
        toast.success("Login Successfully");
      }
    } catch (error) {
      console.log({ error });
      const errData = error?.response?.data || {};
      const msg = errData?.message || "Invalid credentials";
      failCallBack?.(errData);
      toast.error(msg);
    }
  };
};

export const _getSignup = (data, successCallBack, failCallBack) => {
  return async (dispatch, getState) => {
    try {
      const req = await axios.post(
        constant().baseUrl + "api/auth/register",
        data
      );
      if (req.data) {
        successCallBack?.(req?.data);
        localStorage.setItem("token", req?.data?.token);
        localStorage.setItem("user", JSON.stringify(req?.data?.user));
        document.cookie = `token=${req?.data?.token}; path=/; max-age=${
          60 * 60 * 24 * 7
        }; sameSite=lax`;
        dispatch(setUser(req?.data?.user));
        dispatch(setIsLoggedIn(true));
        toast.success(req?.message || "Signup Successfully");
      }
    } catch (error) {
      console.log({ error });
      const errData = error?.response?.data || {};
      const status = error?.response?.status;
      let msg = errData?.message || "Registration failed. Please try again.";
      if (status === 409) {
        msg = errData?.message || "An account with this email or username already exists.";
      }
      failCallBack?.(errData);
      toast.error(msg);
    }
  };
};
