import { homePageMetadata } from "@/lib/seo/metadata";
import Hero from "@/components/sections/Hero";
import NewlyAddedCollections from "@/components/sections/NewlyAddedCollections";
import PublicAlbumsShowcase from "@/components/sections/PublicAlbumsShowcase";
import FeaturedPlantsOfTheWeek from "@/components/sections/FeaturedPlantsOfTheWeek";
import MarketplaceFeaturedListings from "@/components/sections/MarketplaceFeaturedListings";
import CommunityHighlights from "@/components/sections/CommunityHighlights";
import TrendingPlants from "@/components/sections/TrendingPlants";
import PlantCareTipsCarousel from "@/components/sections/PlantCareTipsCarousel";
import QuickStatsBanner from "@/components/sections/QuickStatsBanner";
import React from "react";

// Enhanced SEO for homepage
export const metadata = homePageMetadata();

export default function Home() {
  return (
    <div>
      <Hero />
      <NewlyAddedCollections />
      <PublicAlbumsShowcase />
      <FeaturedPlantsOfTheWeek />
      <MarketplaceFeaturedListings />
      <CommunityHighlights />
      <TrendingPlants />
      <PlantCareTipsCarousel />
      <QuickStatsBanner />
    </div>
  );
}
