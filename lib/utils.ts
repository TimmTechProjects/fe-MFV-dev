import { PlantSchema } from "@/schemas/plantSchema";
import { Collection } from "@/types/collections";
import {
  MarketplaceListing,
  CreateListingInput,
  MarketplaceFilters,
  MarketplaceResponse,
} from "@/types/marketplace";
import { Plant } from "@/types/plants";
import { RegisterUser, User, UserCredentials, UserResult } from "@/types/users";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { decode } from "html-entities";

const resolveApiBaseUrl = () => {
  const publicUrl = process.env.NEXT_PUBLIC_FLORAL_VAULT_API_URL;
  const devUrl = process.env.NEXT_PUBLIC_FLORAL_VAULT_DEV_API_URL;

  if (publicUrl) {
    return publicUrl.replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV !== "production" && devUrl) {
    return devUrl.replace(/\/+$/, "");
  }

  if (devUrl) {
    return devUrl.replace(/\/+$/, "");
  }

  const fallbackUrl = "https://floral-vault-api.onrender.com";
  console.warn(
    "Missing API base URL. Falling back to live API. Set NEXT_PUBLIC_FLORAL_VAULT_API_URL (and optionally NEXT_PUBLIC_FLORAL_VAULT_DEV_API_URL)."
  );
  return fallbackUrl;
};

const baseUrl = resolveApiBaseUrl();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decodeHtmlEntities(html: string | undefined | null): string {
  if (!html) return "";
  let result = html;
  let prev = "";
  while (result !== prev) {
    prev = result;
    result = decode(result);
  }
  return result;
}

export async function loginUser({
  username,
  password,
}: UserCredentials): Promise<User | null> {
  try {
    const response = await fetch(baseUrl + "/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Login failed:", data.message || "Unknown error");
      return null;
    }

    const { token, user } = data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
}

export async function registerUser(input: RegisterUser): Promise<{
  user?: User;
  token?: string;
  error?: string;
  errors?: { field: string; message: string }[];
} | null> {
  try {
    const response = await fetch(baseUrl + "/api/auth/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Registration failed:", data.message || "Unknown error");
      return {
        error: data.message || "Registration failed",
        errors: data.errors || [],
      };
    }

    return { user: data.user, token: data.token };
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "Unexpected error occurred during registration" };
  }
}

export async function createNewCollection(
  username: string,
  data: { name: string; description?: string }
) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    console.error("No token found. User must be logged in to create collections.");
    return new Response(JSON.stringify({ message: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  const response = await fetch(
    `${baseUrl}/api/collections/${username}/collections`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
        name: data.name,
        description: data.description,
      }),
    }
  );

  return response;
}

export async function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  try {
    const response = await fetch(`${baseUrl}/api/users/${username}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch user:", response.statusText);
      return null;
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getSuggestedTags(debouncedQuery: string) {
  // Don't call API for queries shorter than 2 characters
  if (!debouncedQuery || debouncedQuery.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      baseUrl + `/api/tags/suggest?query=${encodeURIComponent(debouncedQuery)}`
    );

    // Handle non-2xx responses gracefully (400 = too short, 404 = no matches)
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error getting suggested tags:", error);
    return [];
  }
}

export async function submitPlant(
  formData: PlantSchema,
  collectionId: string
): Promise<Plant | null> {
  if (typeof window === "undefined") {
    console.error("submitPlant called during SSR — aborting.");
    return null;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found. User must be logged in.");
    return null;
  }

  try {
    const response = await fetch(baseUrl + "/api/plants/new", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...formData, collectionId }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Plant Submission failed:",
        data.message || "Unknown error"
      );
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unknown error:", error);
    return null;
  }
}

export async function updatePlant(
  id: string,
  values: PlantSchema
): Promise<Plant | null> {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Cannot update plant.");
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/api/plants/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Update failed:", err.message || "Unknown error");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating plant:", error);
    return null;
  }
}
export async function getPlantBySlug(
  slug: string,
  username: string
): Promise<Plant | null> {
  try {
    const res = await fetch(`${baseUrl}/api/plants/${username}/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching plant by slug:", error);
    return null;
  }
}

export async function getAllPlants(): Promise<{
  plants: Plant[];
  total: number;
}> {
  const res = await fetch(`${baseUrl}/api/plants`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch plants");
  return res.json();
}

export async function searchEverything(query: string): Promise<{
  plants: Plant[];
  users: UserResult[];
  collections: Collection[];
}> {
  try {
    const res = await fetch(
      `${baseUrl}/api/search?q=${encodeURIComponent(query)}`
    );

    if (!res.ok) {
      console.error("Search failed");
      return { plants: [], users: [], collections: [] };
    }

    return await res.json();
  } catch (err) {
    console.error("Error searching plants:", err);
    return { plants: [], users: [], collections: [] };
  }
}

export async function getUserCollections(username: string) {
  const res = await fetch(`${baseUrl}/api/collections/${username}`);
  if (!res.ok) throw new Error("Failed to fetch users collections");
  return res.json();
}

export async function getCollectionWithPlants(
  username: string,
  collectionSlug: string,
  page = 1,
  limit = 10
) {
  const res = await fetch(
    `${baseUrl}/api/collections/${username}/collections/${collectionSlug}?page=${page}&limit=${limit}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user's plant data from collection");
  }

  return res.json();
}

export async function getCollectionBySlug(
  username: string,
  collectionSlug: string
) {
  try {
    const res = await fetch(
      `${baseUrl}/api/collections/${username}/collections/${collectionSlug}`
    );
    if (!res.ok) {
      console.error("Failed to fetch collection");
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch collection:", err);
    return null;
  }
}

export async function getPaginatedPlants(
  page = 1,
  limit = 20
): Promise<{
  plants: Plant[];
  total: number;
}> {
  try {
    const res = await fetch(
      `${baseUrl}/api/plants?page=${page}&limit=${limit}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      console.error("Failed to fetch paginated plants");
      return { plants: [], total: 0 };
    }
    return res.json();
  } catch (err) {
    console.error("Error fetching paginated plants:", err);
    return { plants: [], total: 0 };
  }
}

export async function getUserCollectionsWithAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("User not authenticated");
    return [];
  }

  try {
    const res = await fetch(`${baseUrl}/api/collections/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch collections");
      return [];
    }

    return res.json();
  } catch (err) {
    console.error("Error fetching collections:", err);
    return [];
  }
}

export async function savePlantToAlbum(
  collectionId: string,
  plantId: string
): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, message: "No token found" };

  try {
    const res = await fetch(
      `${baseUrl}/api/collections/${collectionId}/add-plant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plantId }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to add plant" };
    }

    return { success: true, message: "Plant saved to album successfully." };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unexpected error" };
  }
}

export async function removePlantFromAlbum(
  collectionId: string,
  plantId: string
): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, message: "No token found" };

  try {
    const res = await fetch(
      `${baseUrl}/api/collections/${collectionId}/remove-plant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plantId }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to remove plant" };
    }

    return { success: true, message: "Plant removed from album." };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unexpected error" };
  }
}

export async function setCollectionThumbnail(
  collectionId: string,
  plantImageId: string
): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, message: "No token found" };

  try {
    const res = await fetch(
      `${baseUrl}/api/collections/${collectionId}/set-thumbnail`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageId: plantImageId }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to update thumbnail",
      };
    }

    return { success: true, message: "Thumbnail updated successfully" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unexpected error" };
  }
}

export async function updateCollectionThumbnail(
  collectionId: string,
  imageUrl: string
): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, message: "No token found" };

  try {
    const res = await fetch(
      `${baseUrl}/api/collections/${collectionId}/set-thumbnail`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageId: imageUrl }),
      }
    );

    const data = await res.json();

    if (!res.ok)
      return {
        success: false,
        message: data.message || "Failed to update thumbnail",
      };
    return { success: true, message: "Thumbnail updated successfully" };
  } catch (err) {
    console.error("Unexpected error", err);
    return { success: false, message: "Unexpected error" };
  }
}

export async function uploadCollectionCover(
  collectionId: string,
  imageUrl: string,
  imageKey: string
): Promise<{ success: boolean; message: string; coverImageUrl?: string }> {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, message: "No token found" };

  try {
    const res = await fetch(
      `${baseUrl}/api/collections/${collectionId}/upload-cover`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl, imageKey }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to upload cover image",
      };
    }

    return {
      success: true,
      message: "Cover image uploaded successfully",
      coverImageUrl: data.coverImageUrl,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unexpected error" };
  }
}

export async function deleteCollectionCover(
  collectionId: string
): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, message: "No token found" };

  try {
    const res = await fetch(
      `${baseUrl}/api/collections/${collectionId}/set-thumbnail`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageId: null }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to remove cover image",
      };
    }

    return { success: true, message: "Cover image removed successfully" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unexpected error" };
  }
}

export interface CareReminder {
  id: string;
  userId: string;
  plantId: string;
  type: string;
  frequency: number;
  frequencyUnit: string;
  nextDue: string;
  lastCompleted: string | null;
  enabled: boolean;
  notes: string | null;
  plant: {
    commonName: string | null;
    botanicalName: string;
  };
}

export async function getCareReminders(userId: string): Promise<CareReminder[]> {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const res = await fetch(`${baseUrl}/api/care-reminders/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getDueCareReminders(userId: string): Promise<CareReminder[]> {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const res = await fetch(`${baseUrl}/api/care-reminders/${userId}/due`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function createCareReminder(data: {
  userId: string;
  plantId: string;
  type: string;
  frequency: number;
  frequencyUnit?: string;
  nextDue: string;
  notes?: string;
}): Promise<CareReminder | null> {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch(`${baseUrl}/api/care-reminders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function completeCareReminder(id: string): Promise<CareReminder | null> {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch(`${baseUrl}/api/care-reminders/${id}/complete`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function deleteCareReminder(id: string): Promise<boolean> {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await fetch(`${baseUrl}/api/care-reminders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok || res.status === 204;
  } catch {
    return false;
  }
}

export async function togglePlantLike(
  plantId: string
): Promise<{ liked: boolean } | null> {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch(`${baseUrl}/api/likes/${plantId}/toggle`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error toggling plant like:", error);
    return null;
  }
}

export async function getPlantLikeStatus(
  plantId: string
): Promise<{ liked: boolean } | null> {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch(`${baseUrl}/api/likes/${plantId}/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error getting plant like status:", error);
    return null;
  }
}

export function formatRelativeTime(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffHr < 12) {
    if (diffHr >= 1) return `${diffHr}h`;
    if (diffMin >= 1) return `${diffMin}m`;
    return "Just now";
  }
  if (diffDay < 7) {
    return `${diffDay}d`;
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export async function getMarketplaceListings(
  filters?: MarketplaceFilters
): Promise<MarketplaceResponse> {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.listingType && filters.listingType !== "all")
      params.set("listingType", filters.listingType);
    if (filters?.category) params.set("category", filters.category);
    if (filters?.minPrice !== undefined)
      params.set("minPrice", String(filters.minPrice));
    if (filters?.maxPrice !== undefined)
      params.set("maxPrice", String(filters.maxPrice));
    if (filters?.freeShipping) params.set("freeShipping", "true");
    if (filters?.condition) params.set("condition", filters.condition);
    if (filters?.sort) params.set("sort", filters.sort);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));

    const query = params.toString();
    const res = await fetch(
      `${baseUrl}/api/marketplace/listings${query ? `?${query}` : ""}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("Failed to fetch marketplace listings");
      return { listings: [], total: 0, page: 1, totalPages: 0 };
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching marketplace listings:", err);
    return { listings: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getMarketplaceListing(
  id: string
): Promise<MarketplaceListing | null> {
  try {
    const res = await fetch(`${baseUrl}/api/marketplace/listings/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching listing:", err);
    return null;
  }
}

export async function createMarketplaceListing(
  input: CreateListingInput
): Promise<{ success: boolean; listing?: MarketplaceListing; message?: string }> {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, message: "Authentication required" };

  try {
    const res = await fetch(`${baseUrl}/api/marketplace/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to create listing",
      };
    }

    return { success: true, listing: data.listing || data };
  } catch (err) {
    console.error("Error creating listing:", err);
    return { success: false, message: "Unexpected error" };
  }
}

export async function placeBid(
  listingId: string,
  amount: number
): Promise<{ success: boolean; message?: string }> {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, message: "Authentication required" };

  try {
    const res = await fetch(
      `${baseUrl}/api/marketplace/listings/${listingId}/bid`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to place bid" };
    }

    return { success: true, message: data.message };
  } catch (err) {
    console.error("Error placing bid:", err);
    return { success: false, message: "Unexpected error" };
  }
}
