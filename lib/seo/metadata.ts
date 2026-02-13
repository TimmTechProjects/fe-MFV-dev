import { Metadata } from "next";
import { seoConfig } from "./config";

/**
 * Interface for generating page-specific metadata
 */
export interface PageSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  type?: "website" | "article" | "profile" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
}

/**
 * Generate comprehensive metadata for a page
 */
export function generateMetadata(pageSEO: PageSEO = {}): Metadata {
  const {
    title = seoConfig.defaultTitle,
    description = seoConfig.defaultDescription,
    keywords = seoConfig.defaultKeywords,
    image = seoConfig.defaultOgImage,
    canonical,
    noindex = false,
    nofollow = false,
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
    section,
  } = pageSEO;

  const canonicalUrl = canonical
    ? `${seoConfig.siteUrl}${canonical}`
    : undefined;

  const ogImage = {
    url: image.url.startsWith("http")
      ? image.url
      : `${seoConfig.siteUrl}${image.url}`,
    width: image.width || 1200,
    height: image.height || 630,
    alt: image.alt || title,
  };

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.join(", "),
    alternates: canonical
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: seoConfig.siteName,
      images: [ogImage],
      locale: seoConfig.locale,
      type,
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors,
        section,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
      creator: seoConfig.social.twitter,
      site: seoConfig.social.twitter,
    },
  };

  return metadata;
}

/**
 * Page-specific metadata generators
 */

export const homePageMetadata = (): Metadata =>
  generateMetadata({
    title: "My Floral Vault - Discover, Collect & Trade Rare Plants",
    description:
      "The ultimate platform for plant enthusiasts. Discover rare and exotic plants, build your digital collection, trade with collectors worldwide, and access expert care guides. Join our thriving community today!",
    keywords: [
      "my floral vault",
      "rare plants",
      "exotic plants",
      "plant marketplace",
      "plant trading",
      "plant collection",
      "botanical database",
      "houseplant community",
      "plant care guides",
      "digital herbarium",
    ],
    canonical: "/",
  });

export const marketplaceMetadata = (): Metadata =>
  generateMetadata({
    title: "Marketplace - Buy & Sell Rare Plants | My Floral Vault",
    description:
      "Browse and trade rare, exotic, and hard-to-find plants. Connect with trusted sellers, discover unique varieties, and grow your collection. Secure transactions with buyer protection.",
    keywords: [
      "plant marketplace",
      "buy rare plants",
      "sell exotic plants",
      "plant auctions",
      "rare plant sales",
      "plant trading platform",
      "buy houseplants online",
      "exotic plant sellers",
    ],
    canonical: "/marketplace",
  });

export const vaultBrowseMetadata = (): Metadata =>
  generateMetadata({
    title: "The Vault - Browse Plant Database | My Floral Vault",
    description:
      "Explore our comprehensive database of rare and exotic plants. Filter by species, care level, and rarity. Discover detailed plant profiles with care guides, photos, and community insights.",
    keywords: [
      "plant database",
      "rare plant species",
      "botanical encyclopedia",
      "plant identification",
      "plant care database",
      "houseplant catalog",
      "exotic plant guide",
    ],
    canonical: "/the-vault",
  });

export const forumMetadata = (): Metadata =>
  generateMetadata({
    title: "Community Forum - Plant Care & Discussions | My Floral Vault",
    description:
      "Join discussions with fellow plant enthusiasts. Share tips, ask questions, showcase your plants, and learn from experienced collectors. Your plant community awaits!",
    keywords: [
      "plant forum",
      "plant community",
      "plant care tips",
      "houseplant discussions",
      "plant help",
      "gardening community",
      "plant advice",
    ],
    canonical: "/forum",
    type: "website",
  });

export const profileMetadata = (username: string, bio?: string): Metadata =>
  generateMetadata({
    title: `${username}'s Collection | My Floral Vault`,
    description:
      bio ||
      `View ${username}'s plant collection on My Floral Vault. Discover their rare plants, trading history, and connect with fellow plant enthusiasts.`,
    keywords: [
      "plant collector",
      "plant collection",
      username,
      "rare plants",
      "plant profile",
    ],
    canonical: `/profiles/${username}`,
    type: "profile",
  });

export const plantPageMetadata = (
  plantName: string,
  scientificName?: string,
  description?: string
): Metadata =>
  generateMetadata({
    title: `${plantName} - Plant Care Guide | My Floral Vault`,
    description:
      description ||
      `Complete care guide for ${plantName}${scientificName ? ` (${scientificName})` : ""}. Learn about watering, light requirements, propagation, and common issues. Expert tips from our community.`,
    keywords: [
      plantName,
      scientificName || "",
      "plant care",
      "care guide",
      "growing tips",
      "plant information",
      "houseplant care",
    ].filter(Boolean),
    canonical: `/plants/${plantName.toLowerCase().replace(/\s+/g, "-")}`,
    type: "article",
  });
