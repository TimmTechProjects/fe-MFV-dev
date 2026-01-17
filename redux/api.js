"use client";
import axios from "axios";
import { toast } from "sonner";

const resolveApiBaseUrl = () => {
  const publicUrl = process.env.NEXT_PUBLIC_FLORAL_VAULT_API_URL;
  const devUrl = process.env.NEXT_PUBLIC_FLORAL_VAULT_DEV_API_URL;

  if (publicUrl) {
    return publicUrl.endsWith("/") ? publicUrl : `${publicUrl}/`;
  }

  if (process.env.NODE_ENV !== "production" && devUrl) {
    return devUrl.endsWith("/") ? devUrl : `${devUrl}/`;
  }

  if (devUrl) {
    return devUrl.endsWith("/") ? devUrl : `${devUrl}/`;
  }

  const fallbackUrl = "https://floral-vault-api.onrender.com/";
  console.warn(
    "Missing API base URL. Falling back to live API. Set NEXT_PUBLIC_FLORAL_VAULT_API_URL (and optionally NEXT_PUBLIC_FLORAL_VAULT_DEV_API_URL)."
  );
  return fallbackUrl;
};

export const constant = () => {
  return { baseUrl: resolveApiBaseUrl() };
};

const logoutUser = () => {
  const currentPath = window.location.pathname + window.location.search;
  localStorage.removeItem("token");
  window.location.href = `/login?from=${encodeURIComponent(currentPath)}`;
};

export const api = axios.create();

api.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoggedIn = localStorage.getItem("token");
    if (error.response?.status === 401 && isLoggedIn) {
      // Clear token and redirect to login
      toast.error("Session expired. Please login again.");
      setTimeout(() => {
        logoutUser();
      }, 2000);
    }
    return Promise.reject(error);
  }
);

export const apiget = async (path) => {
  try {
    let response = await api.get(constant().baseUrl + path);
    return response;
  } catch (error) {
    if (error && error.response) {
      console.log(error);
    }
    throw error;
  }
};

export const apipost = async (path, data) => {
  try {
    const response = await api.post(constant().baseUrl + path, data);

    if (response?.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  } catch (error) {
    if (error && error.response) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      }
    }
    throw error;
  }
};

export const apiput = async (path, data) => {
  try {
    const response = await api.put(constant().baseUrl + path, data);
    if (response?.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  } catch (error) {
    if (error && error.response) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      }
    }
    throw error;
  }
};

export const apidelete = async (path) => {
  try {
    const response = await api.delete(constant().baseUrl + path);
    if (response?.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  } catch (error) {
    if (error && error.response) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      }
    }
    throw error;
  }
};
