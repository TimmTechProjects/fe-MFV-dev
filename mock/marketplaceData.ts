export interface MarketplacePlant {
  id: number;
  name: string;
  price: string;
  image: string;
  shop: string;
  rating: number;
  reviews: number;
  sale: string;
  freeShipping: boolean;
  listingType: "buy" | "auction" | "both";
}

export const marketplacePlants: MarketplacePlant[] = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    price: "$25",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=80",
    shop: "PlantShop",
    rating: 4.8,
    reviews: 120,
    sale: "20% off",
    freeShipping: true,
    listingType: "buy",
  },
  {
    id: 2,
    name: "Fiddle Leaf Fig",
    price: "$30",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    shop: "LeafyGreens",
    rating: 4.7,
    reviews: 98,
    sale: "10% off",
    freeShipping: false,
    listingType: "auction",
  },
  {
    id: 3,
    name: "Snake Plant",
    price: "$20",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    shop: "UrbanJungle",
    rating: 4.9,
    reviews: 150,
    sale: "15% off",
    freeShipping: true,
    listingType: "buy",
  },
  {
    id: 4,
    name: "Pothos",
    price: "$15",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    shop: "GreenRoots",
    rating: 4.6,
    reviews: 80,
    sale: "",
    freeShipping: false,
    listingType: "both",
  },
  {
    id: 5,
    name: "ZZ Plant",
    price: "$22",
    image:
      "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80",
    shop: "ZenBotanics",
    rating: 4.8,
    reviews: 110,
    sale: "5% off",
    freeShipping: true,
    listingType: "buy",
  },
  {
    id: 6,
    name: "Peace Lily",
    price: "$18",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    shop: "PeacefulPlants",
    rating: 4.7,
    reviews: 95,
    sale: "",
    freeShipping: false,
    listingType: "auction",
  },
  {
    id: 7,
    name: "Aloe Vera",
    price: "$12",
    image:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80",
    shop: "SucculentWorld",
    rating: 4.9,
    reviews: 140,
    sale: "10% off",
    freeShipping: true,
    listingType: "buy",
  },
  {
    id: 8,
    name: "Spider Plant",
    price: "$14",
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=400&q=80",
    shop: "UrbanJungle",
    rating: 4.8,
    reviews: 105,
    sale: "",
    freeShipping: false,
    listingType: "both",
  },
  {
    id: 9,
    name: "Rubber Plant",
    price: "$28",
    image:
      "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=400&q=80",
    shop: "LeafyGreens",
    rating: 4.7,
    reviews: 90,
    sale: "12% off",
    freeShipping: true,
    listingType: "buy",
  },
  {
    id: 10,
    name: "Calathea Orbifolia",
    price: "$35",
    image: "/fallback.png",
    shop: "PlantShop",
    rating: 4.9,
    reviews: 130,
    sale: "",
    freeShipping: false,
    listingType: "auction",
  },
  {
    id: 11,
    name: "Bird of Paradise",
    price: "$40",
    image:
      "https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=400&q=80",
    shop: "ExoticPlants",
    rating: 4.8,
    reviews: 115,
    sale: "10% off",
    freeShipping: true,
    listingType: "buy",
  },
  {
    id: 12,
    name: "Chinese Evergreen",
    price: "$19",
    image: "/fallback.png",
    shop: "GreenRoots",
    rating: 4.6,
    reviews: 85,
    sale: "",
    freeShipping: false,
    listingType: "buy",
  },
];
