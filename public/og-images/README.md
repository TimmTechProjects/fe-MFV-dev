# Open Graph Images

This directory contains Open Graph (OG) images for social media sharing previews.

## Required Images

### 1. default.png (1200x630px)
**Purpose:** Default OG image for all pages without specific images  
**Content:** My Floral Vault branding, tagline, hero imagery  
**Format:** PNG or JPG  
**Max size:** 8MB (recommended: under 300KB)

**Suggested design:**
- Background: Brand gradient or botanical imagery
- Logo: My Floral Vault logo
- Tagline: "Discover, Collect & Trade Rare Plants"
- Visual: Showcase of beautiful rare plants

### 2. marketplace.png (1200x630px)
**Purpose:** Marketplace page sharing  
**Content:** Marketplace-specific imagery  
**Design:** Plants with price tags, trading theme

### 3. vault.png (1200x630px)
**Purpose:** The Vault browse page  
**Content:** Database/collection theme  
**Design:** Grid of diverse plant thumbnails

### 4. forum.png (1200x630px)
**Purpose:** Community forum  
**Content:** Community/discussion theme  
**Design:** People connecting, speech bubbles, plant care tips

## Dynamic OG Images

For user profiles and plant pages, implement dynamic OG image generation using:
- [@vercel/og](https://vercel.com/docs/functions/og-image-generation) (recommended)
- Or a custom endpoint with canvas/sharp

## Testing Tools

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Open Graph Check](https://www.opengraph.xyz/)

## Image Optimization

All images should be:
- Optimized for web (compressed)
- Properly sized (1200x630px)
- High quality but reasonable file size
- Branded consistently
