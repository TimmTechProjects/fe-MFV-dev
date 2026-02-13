/**
 * JSON-LD Structured Data Components
 * For Google Rich Results and enhanced search appearance
 */

import { seoConfig } from "@/lib/seo/config";

interface JsonLdProps {
  data: Record<string, any>;
}

/**
 * Base JSON-LD component
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Organization Schema (Homepage)
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoConfig.organization.name,
    url: seoConfig.organization.url,
    logo: seoConfig.organization.logo,
    description: seoConfig.organization.description,
    sameAs: seoConfig.organization.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@myfloralvault.com",
    },
  };

  return <JsonLd data={schema} />;
}

/**
 * WebSite Schema with Search Action
 */
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${seoConfig.siteUrl}/the-vault/results?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={schema} />;
}

/**
 * BreadcrumbList Schema
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${seoConfig.siteUrl}${item.url}`,
    })),
  };

  return <JsonLd data={schema} />;
}

/**
 * Product Schema (for Marketplace listings)
 */
export interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  condition?: "NewCondition" | "UsedCondition";
  seller?: string;
  sku?: string;
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  currency = "USD",
  availability = "InStock",
  condition = "NewCondition",
  seller,
  sku,
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: image.startsWith("http") ? image : `${seoConfig.siteUrl}${image}`,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      itemCondition: `https://schema.org/${condition}`,
      ...(seller && {
        seller: {
          "@type": "Organization",
          name: seller,
        },
      }),
    },
    ...(sku && { sku }),
  };

  return <JsonLd data={schema} />;
}

/**
 * Article Schema (for blog posts, plant care guides)
 */
export interface ArticleSchemaProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  section?: string;
}

export function ArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  section,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image.startsWith("http") ? image : `${seoConfig.siteUrl}${image}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: seoConfig.organization.name,
      logo: {
        "@type": "ImageObject",
        url: seoConfig.organization.logo,
      },
    },
    ...(section && { articleSection: section }),
  };

  return <JsonLd data={schema} />;
}

/**
 * Profile Schema (for user profiles)
 */
export interface ProfileSchemaProps {
  username: string;
  name?: string;
  bio?: string;
  image?: string;
}

export function ProfileSchema({
  username,
  name,
  bio,
  image,
}: ProfileSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: name || username,
      ...(bio && { description: bio }),
      ...(image && {
        image: image.startsWith("http")
          ? image
          : `${seoConfig.siteUrl}${image}`,
      }),
      url: `${seoConfig.siteUrl}/profiles/${username}`,
    },
  };

  return <JsonLd data={schema} />;
}

/**
 * LocalBusiness Schema (if applicable)
 */
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: seoConfig.organization.name,
    image: seoConfig.organization.logo,
    url: seoConfig.organization.url,
    description: seoConfig.organization.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    sameAs: seoConfig.organization.sameAs,
  };

  return <JsonLd data={schema} />;
}
