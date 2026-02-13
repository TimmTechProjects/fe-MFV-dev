/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://myfloralvault.com",
  generateRobotsTxt: false, // We have a custom robots.txt
  generateIndexSitemap: false, // For now, use single sitemap
  exclude: [
    "/admin/*",
    "/settings/*",
    "/messages/*",
    "/notifications/*",
    "/login",
    "/signup",
    "/forgot-password",
    "/example-uploader",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/settings/",
          "/messages/",
          "/notifications/",
          "/login",
          "/signup",
          "/forgot-password",
          "/api/",
        ],
      },
    ],
  },
  // Custom transform for dynamic priority and changefreq
  transform: async (config, path) => {
    // Homepage - highest priority
    if (path === "/") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    // Main sections - high priority
    if (
      ["/marketplace", "/the-vault", "/forum", "/profiles"].some((p) =>
        path.startsWith(p)
      )
    ) {
      return {
        loc: path,
        changefreq: "daily",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }

    // Plant pages and user profiles - medium-high priority
    if (path.startsWith("/plants/") || path.match(/^\/profiles\/[^/]+$/)) {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      };
    }

    // Static pages - medium priority
    return {
      loc: path,
      changefreq: "monthly",
      priority: 0.5,
      lastmod: new Date().toISOString(),
    };
  },
};
