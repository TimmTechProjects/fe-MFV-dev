import { Plant } from "./plants";

export type Collection = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  thumbnailImage?: { url: string } | null;
  coverImageUrl?: string | null;
  coverImageKey?: string | null;
  plants?: Plant[];
  _count?: {
    plants: number;
  };
  user: { username: string };
  coverImage?: string;
  slug: string;
};
