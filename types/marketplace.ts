export interface MarketplaceListing {
  id: string;
  plantName: string;
  description: string;
  price: number;
  image: string;
  sellerId: string;
  sellerUsername: string;
  listingType: "sale" | "auction";
  condition: "excellent" | "good" | "fair";
  shippingCost: number;
  freeShipping: boolean;
  category: string;
  rating: number;
  reviews: number;
  views: number;
  favorites: number;
  status: "active" | "sold" | "expired" | "cancelled";
  auctionEndDate?: string;
  currentBid?: number;
  bidCount?: number;
  minimumBid?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingInput {
  plantName: string;
  description: string;
  price: number;
  image: string;
  listingType: "sale" | "auction";
  condition: "excellent" | "good" | "fair";
  shippingCost: number;
  freeShipping: boolean;
  category: string;
  auctionEndDate?: string;
  minimumBid?: number;
}

export interface MarketplaceFilters {
  search?: string;
  listingType?: "sale" | "auction" | "all";
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  freeShipping?: boolean;
  condition?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "rating" | "ending_soon";
  page?: number;
  limit?: number;
}

export interface MarketplaceResponse {
  listings: MarketplaceListing[];
  total: number;
  page: number;
  totalPages: number;
}
