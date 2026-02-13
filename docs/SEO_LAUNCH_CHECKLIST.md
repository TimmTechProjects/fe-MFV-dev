# SEO Launch Day Checklist

## 🚀 Pre-Launch (Do BEFORE going live)

### Content & Assets
- [ ] **Create OG Images** (1200x630px each):
  - [ ] `/public/og-images/default.png`
  - [ ] `/public/og-images/marketplace.png`
  - [ ] `/public/og-images/vault.png`
  - [ ] `/public/og-images/forum.png`
- [ ] **Create Favicon & Icons**:
  - [ ] `/public/favicon.ico` (32x32px)
  - [ ] `/public/icon.png` (32x32px)
  - [ ] `/public/apple-icon.png` (180x180px)
  - [ ] `/public/icon-192.png` (192x192px for PWA)
  - [ ] `/public/icon-512.png` (512x512px for PWA)

### Environment Configuration
- [ ] Set `NEXT_PUBLIC_SITE_URL` to production URL in Vercel
- [ ] Verify all environment variables are set
- [ ] Test build: `npm run build`
- [ ] Verify sitemap generates: check `.next/static/sitemap.xml`

### Testing
- [ ] Test all meta tags on staging:
  - [ ] Homepage
  - [ ] Marketplace
  - [ ] The Vault
  - [ ] Forum
  - [ ] User profile example
  - [ ] Plant page example
- [ ] Validate with [metatags.io](https://metatags.io/)
- [ ] Test Open Graph with [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test Twitter Cards with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Validate JSON-LD with [Google Rich Results Test](https://search.google.com/test/rich-results)

### Performance
- [ ] Run Lighthouse audit (target: 90+ SEO score)
- [ ] Check PageSpeed Insights scores
- [ ] Verify Core Web Vitals
- [ ] Test mobile responsiveness on real devices

## 🎯 Launch Day (After deployment)

### Immediate Actions (Within 1 hour)
- [ ] **Verify live site accessibility**
  - [ ] `https://myfloralvault.com` loads correctly
  - [ ] SSL certificate is valid
  - [ ] `https://myfloralvault.com/robots.txt` is accessible
  - [ ] `https://myfloralvault.com/sitemap.xml` is accessible

- [ ] **Google Search Console**
  - [ ] Add property for `https://myfloralvault.com`
  - [ ] Verify ownership (HTML tag method recommended)
  - [ ] Submit sitemap.xml
  - [ ] Request indexing for homepage

- [ ] **Bing Webmaster Tools**
  - [ ] Add site
  - [ ] Verify ownership
  - [ ] Submit sitemap.xml

### Social Media Testing (Within 2 hours)
- [ ] **Test sharing on platforms**:
  - [ ] Facebook - Share homepage, check preview
  - [ ] Twitter/X - Share homepage, check card
  - [ ] LinkedIn - Share homepage, check preview
  - [ ] WhatsApp - Check preview (if applicable)

- [ ] **Clear social media caches** (if previews don't show):
  - [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) - Scrape again
  - [ ] [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
  - [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Analytics Setup (Day 1)
- [ ] **Google Analytics 4**
  - [ ] Verify GA4 tracking is working
  - [ ] Check real-time reports
  - [ ] Set up conversion goals

- [ ] **Google Tag Manager** (if using)
  - [ ] Verify container is published
  - [ ] Test all tags fire correctly

- [ ] **Search Console Initial Check**
  - [ ] Check coverage report (may take 24-48hrs)
  - [ ] Review any crawl errors
  - [ ] Monitor index status

## 📅 First Week Actions

### Monitoring (Daily)
- [ ] Check Google Search Console for:
  - [ ] Crawl errors
  - [ ] Index coverage
  - [ ] Manual actions (none expected)
  - [ ] Mobile usability issues
- [ ] Monitor Vercel Analytics/Google Analytics
- [ ] Check for broken links

### Content Optimization (First 3 days)
- [ ] Add FAQ schema to relevant pages
- [ ] Optimize most important plant pages
- [ ] Review and improve meta descriptions based on character count
- [ ] Add ALT tags to all hero images

### Technical (First 3 days)
- [ ] Set up Google Analytics alerts
- [ ] Configure Search Console email notifications
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Review server response times

### Social Proof (First week)
- [ ] Encourage early users to share profiles
- [ ] Share featured plants on social media
- [ ] Create shareable content for community

## 📊 First Month Goals

### Search Console Milestones
- [ ] Homepage indexed within 24-48 hours
- [ ] Major pages (marketplace, vault, forum) indexed within 1 week
- [ ] 50+ pages indexed by end of month
- [ ] Zero critical errors
- [ ] Mobile-friendly validation passed

### Performance Targets
- [ ] Lighthouse SEO score: 95+
- [ ] Core Web Vitals: All green
- [ ] Average page load time: <3 seconds
- [ ] Mobile score: 90+

### Ranking Goals (Realistic for Month 1)
- [ ] Homepage ranking for brand name "My Floral Vault"
- [ ] Long-tail rankings for specific plant names
- [ ] Local awareness (social media mentions)

## 🔧 Ongoing Optimization

### Weekly Tasks
- [ ] Review Search Console performance report
- [ ] Check for new crawl errors
- [ ] Monitor keyword rankings
- [ ] Review Google Analytics organic traffic
- [ ] Respond to user-generated content (forum posts)

### Monthly Tasks
- [ ] Comprehensive SEO audit
- [ ] Update high-traffic pages with fresh content
- [ ] Build new backlinks (outreach, guest posts)
- [ ] Review and optimize low-performing pages
- [ ] Add new structured data where applicable
- [ ] Check competitor rankings
- [ ] Generate monthly SEO report

### Quarterly Tasks
- [ ] Major content refresh
- [ ] Technical SEO audit
- [ ] Backlink profile analysis
- [ ] Keyword research update
- [ ] UX/SEO improvements based on data
- [ ] Review and update meta descriptions

## 🎁 Quick Wins (Do These First!)

1. **Claim social media profiles early**
   - Twitter: @MyFloralVault
   - Instagram: @myfloralvault
   - Facebook: /MyFloralVault
   - TikTok: @myfloralvault

2. **Create Google Business Profile** (if applicable)
   - Improves local SEO
   - Shows in Google Maps
   - Builds trust

3. **Build initial backlinks**
   - Submit to plant directories
   - Post in plant forums
   - Reach out to plant bloggers
   - Share on Reddit (r/houseplants, r/PlantIdentification)

4. **Start building email list**
   - Pre-launch signups
   - Newsletter for new plants
   - SEO benefit: return visitors

5. **Create shareable content**
   - "10 Rarest Plants You Can Own"
   - "Complete Plant Care Guide"
   - Infographics about plant taxonomy

## ⚠️ Common Pitfalls to Avoid

- ❌ Don't change URLs after indexing without redirects
- ❌ Don't block important pages in robots.txt
- ❌ Don't use duplicate content across pages
- ❌ Don't neglect mobile optimization
- ❌ Don't ignore Search Console warnings
- ❌ Don't keyword stuff meta descriptions
- ❌ Don't use generic "Home" as page title

## 📞 Emergency Contacts & Resources

### Tools Needed
- Google Search Console access
- Google Analytics access
- Vercel dashboard access
- Domain registrar access (for DNS verification)

### Support Resources
- [Google Search Central Help](https://support.google.com/webmasters)
- [Next.js Discord](https://nextjs.org/discord)
- [Vercel Support](https://vercel.com/support)

### Team Contacts
- SEO Lead: [Contact info]
- Developer: [Contact info]
- Content Manager: [Contact info]

---

**Remember:** SEO is a marathon, not a sprint. Focus on quality content, technical excellence, and user experience. Rankings will follow! 🌱
