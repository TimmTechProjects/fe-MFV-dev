/**
 * SEO Configuration for My Floral Vault
 * Centralized SEO settings for metadata, Open Graph, Twitter Cards, etc.
 */

export const seoConfig = {
  // Base site configuration
  siteName: "My Floral Vault",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://myfloralvault.com",
  defaultTitle: "My Floral Vault - Discover, Collect & Trade Rare Plants",
  defaultDescription:
    "Join the community of plant enthusiasts. Discover rare plants, build your digital collection, trade with collectors worldwide, and access expert care guides.",
  defaultKeywords: [
    "rare plants",
    "plant collection",
    "plant marketplace",
    "botanical database",
    "plant trading",
    "houseplants",
    "exotic plants",
    "plant care",
    "plant community",
    "digital herbarium",
  ],

  // Social media handles
  social: {
    twitter: "@MyFloralVault",
    facebook: "MyFloralVault",
    instagram: "@myfloralvault",
  },

  // Default Open Graph image
  defaultOgImage: {
    url: "/og-images/default.png",
    width: 1200,
    height: 630,
    alt: "My Floral Vault - Discover, Collect & Trade Rare Plants",
  },

  // Organization structured data
  organization: {
    name: "My Floral Vault",
    url: "https://myfloralvault.com",
    logo: "https://myfloralvault.com/logo.png",
    description:
      "The premier platform for plant enthusiasts to discover, collect, and trade rare and exotic plants.",
    sameAs: [
      "https://twitter.com/MyFloralVault",
      "https://facebook.com/MyFloralVault",
      "https://instagram.com/myfloralvault",
    ],
  },

  // Locale and language
  locale: "en_US",
  language: "en",
} as const;

export type SeoConfig = typeof seoConfig;
