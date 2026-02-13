# SEO Implementation Guide - My Floral Vault

## ✅ Completed Implementation

### 1. Meta Tags (All Pages) ✓
- ✅ Dynamic page titles using Next.js metadata API
- ✅ Meta descriptions (150-160 chars, keyword-rich)
- ✅ Open Graph tags (og:title, og:description, og:image, og:url, og:type)
- ✅ Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- ✅ Canonical URLs via `metadataBase`
- ✅ Mobile viewport meta tag
- ✅ Enhanced robots directives

### 2. Structured Data (JSON-LD) ✓
- ✅ Organization schema (homepage) - `<OrganizationSchema />`
- ✅ WebSite schema with search action - `<WebSiteSchema />`
- ✅ BreadcrumbList schema (navigation) - `<BreadcrumbSchema />`
- ✅ Product schema (marketplace listings) - `<ProductSchema />`
- ✅ Article schema (plant pages/guides) - `<ArticleSchema />`
- ✅ Profile schema (user profiles) - `<ProfileSchema />`

### 3. Sitemap & Robots ✓
- ✅ XML sitemap generation via `next-sitemap`
- ✅ Dynamic sitemap with all public routes
- ✅ Priority and changefreq configuration
- ✅ Custom robots.txt
- ✅ Automatic sitemap generation on build

### 4. Configuration Files ✓
- ✅ `lib/seo/config.ts` - Centralized SEO configuration
- ✅ `lib/seo/metadata.ts` - Metadata generators for all page types
- ✅ `components/seo/JsonLd.tsx` - Structured data components
- ✅ `next-sitemap.config.js` - Sitemap generation config
- ✅ `public/robots.txt` - Search engine crawler rules
- ✅ `public/manifest.json` - PWA manifest

## 📋 Usage Guide

### Adding SEO to a New Page

#### Server Component (Recommended)
```tsx
// app/your-page/page.tsx
import { generateMetadata } from "@/lib/seo/metadata";

export const metadata = generateMetadata({
  title: "Your Page Title",
  description: "Your page description (150-160 chars)",
  keywords: ["keyword1", "keyword2"],
  canonical: "/your-page",
});

export default function YourPage() {
  return <div>Your content</div>;
}
```

#### Client Component (Use Layout)
```tsx
// app/your-page/layout.tsx
import { generateMetadata } from "@/lib/seo/metadata";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata = generateMetadata({
  title: "Your Page Title",
  description: "Your description",
  canonical: "/your-page",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Your Page", url: "/your-page" },
        ]}
      />
      {children}
    </>
  );
}
```

### Adding Structured Data

#### Product Listing (Marketplace)
```tsx
import { ProductSchema } from "@/components/seo/JsonLd";

<ProductSchema
  name="Monstera Deliciosa Variegata"
  description="Rare variegated Monstera"
  image="/path/to/image.jpg"
  price={299.99}
  currency="USD"
  availability="InStock"
  seller="PlantSeller123"
  sku="MONS-VAR-001"
/>
```

#### Article/Plant Guide
```tsx
import { ArticleSchema } from "@/components/seo/JsonLd";

<ArticleSchema
  title="Complete Monstera Care Guide"
  description="Everything you need to know"
  image="/path/to/image.jpg"
  datePublished="2026-02-13T00:00:00Z"
  author="Expert Grower"
  section="Plant Care"
/>
```

#### User Profile
```tsx
import { ProfileSchema } from "@/components/seo/JsonLd";

<ProfileSchema
  username="plantlover123"
  name="Jane Doe"
  bio="Plant enthusiast and collector"
  image="/avatars/user.jpg"
/>
```

## 🎨 Open Graph Images

### Default Images
Place default OG images in `public/og-images/`:
- `default.png` (1200x630px) - Default fallback
- `marketplace.png` - Marketplace page
- `vault.png` - The Vault page
- `forum.png` - Forum page

### Dynamic OG Images (Future Enhancement)
For dynamic OG image generation for user profiles and plant pages:

```tsx
// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #22c55e, #16a34a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1 style={{ fontSize: 72, color: 'white' }}>{title}</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

## 🔍 Testing & Validation

### Pre-Launch Checklist
- [ ] Test all metadata with [Meta Tags](https://metatags.io/)
- [ ] Validate Open Graph with [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test Twitter Cards with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Validate structured data with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Check sitemap accessibility: `https://myfloralvault.com/sitemap.xml`
- [ ] Verify robots.txt: `https://myfloralvault.com/robots.txt`
- [ ] Submit sitemap to [Google Search Console](https://search.google.com/search-console)
- [ ] Submit sitemap to [Bing Webmaster Tools](https://www.bing.com/webmasters)

### Performance Testing
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Check [Lighthouse](https://developers.google.com/web/tools/lighthouse) scores
- [ ] Test mobile responsiveness
- [ ] Verify image optimization
- [ ] Check Core Web Vitals

## 🚀 Post-Launch Actions

1. **Google Search Console Setup**
   - Add and verify property
   - Submit sitemap.xml
   - Monitor crawl errors
   - Track search performance

2. **Bing Webmaster Tools**
   - Add and verify site
   - Submit sitemap
   - Monitor indexing

3. **Social Media Meta Tag Testing**
   - Share on Facebook and check preview
   - Share on Twitter and check card
   - Share on LinkedIn and check preview

4. **Monitor Rankings**
   - Set up rank tracking for target keywords
   - Monitor organic traffic in Google Analytics
   - Track conversions from organic search

## 📊 SEO Priorities by Page Type

### Homepage (Priority: Critical)
- Focus: Brand awareness, main value proposition
- Keywords: "rare plants", "plant marketplace", "plant collection"
- Call-to-action: Sign up, browse marketplace

### Marketplace (Priority: High)
- Focus: E-commerce SEO
- Keywords: "buy rare plants", "plant marketplace", "exotic plants for sale"
- Schema: Product listings
- Images: High-quality plant photos

### The Vault (Priority: High)
- Focus: Information/database
- Keywords: "plant database", "plant care guides", "plant species"
- Schema: Article/Guide
- Long-tail keywords for specific plants

### User Profiles (Priority: Medium)
- Focus: Community, social proof
- Keywords: User-specific + "plant collection"
- Schema: Profile, BreadcrumbList
- Dynamic OG images

### Individual Plant Pages (Priority: High)
- Focus: Long-tail plant-specific queries
- Keywords: "[Plant name] care", "[Plant name] for sale"
- Schema: Article + Product (if for sale)
- Rich plant photos

## 🎯 Target Keywords by Priority

### Primary Keywords (High Volume)
- rare plants
- exotic plants
- plant marketplace
- buy plants online
- plant collection

### Secondary Keywords (Medium Volume)
- rare houseplants
- unusual plants
- plant trading
- plant database
- plant care guide

### Long-tail Keywords (Specific)
- [specific plant name] care guide
- how to care for [plant name]
- [plant name] for sale
- rare [plant type] plants
- where to buy [plant name]

## 🔧 Configuration Files Reference

### SEO Config (`lib/seo/config.ts`)
- Site name, URL, default metadata
- Social media handles
- Default OG image
- Organization data

### Metadata Generators (`lib/seo/metadata.ts`)
- `generateMetadata()` - Universal metadata generator
- `homePageMetadata()` - Homepage SEO
- `marketplaceMetadata()` - Marketplace SEO
- `vaultBrowseMetadata()` - Vault SEO
- `forumMetadata()` - Forum SEO
- `profileMetadata()` - User profile SEO
- `plantPageMetadata()` - Plant page SEO

### Structured Data (`components/seo/JsonLd.tsx`)
- `<OrganizationSchema />` - Organization info
- `<WebSiteSchema />` - Site with search
- `<BreadcrumbSchema />` - Navigation breadcrumbs
- `<ProductSchema />` - E-commerce products
- `<ArticleSchema />` - Articles/guides
- `<ProfileSchema />` - User profiles

## 📚 Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search/docs)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [next-sitemap](https://github.com/iamvishnusankar/next-sitemap)

## 🐛 Troubleshooting

### Metadata Not Updating
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Check that metadata is exported from Server Component
- Verify `metadataBase` in root layout

### Sitemap Not Generating
- Run `npm run build` to trigger postbuild script
- Check `next-sitemap.config.js` configuration
- Verify output in `.next/static/sitemap.xml`

### OG Images Not Showing
- Test with Facebook Debugger to clear cache
- Verify image path is correct and accessible
- Ensure images are 1200x630px
- Check Content-Security-Policy headers

### Structured Data Errors
- Validate with [Google Rich Results Test](https://search.google.com/test/rich-results)
- Check JSON-LD syntax in browser DevTools
- Verify required fields are present

## ✏️ Future Enhancements

- [ ] Dynamic OG image generation API route
- [ ] Advanced schema markup for plant taxonomy
- [ ] International SEO (hreflang tags)
- [ ] AMP pages for plant guides
- [ ] Rich snippets for reviews/ratings
- [ ] FAQ schema for common questions
- [ ] Video schema for plant care tutorials
- [ ] Local SEO if physical presence exists
