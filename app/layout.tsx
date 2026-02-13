import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import ReduxProvider from "@/redux/Provider";
import ClientLayout from "../app/ClientLayout";
import { ThemeProvider } from "@/context/ThemeContext";
import { seoConfig } from "@/lib/seo/config";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Enhanced viewport configuration
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/**
 * Enhanced root metadata with comprehensive SEO
 */
export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  title: {
    default: seoConfig.defaultTitle,
    template: `%s | ${seoConfig.siteName}`,
  },
  description: seoConfig.defaultDescription,
  keywords: seoConfig.defaultKeywords,
  authors: [{ name: "My Floral Vault Team" }],
  creator: "My Floral Vault",
  publisher: "My Floral Vault",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  applicationName: seoConfig.siteName,
  referrer: "origin-when-cross-origin",
  category: "Lifestyle",

  // Open Graph
  openGraph: {
    type: "website",
    locale: seoConfig.locale,
    url: seoConfig.siteUrl,
    siteName: seoConfig.siteName,
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [
      {
        url: seoConfig.defaultOgImage.url,
        width: seoConfig.defaultOgImage.width,
        height: seoConfig.defaultOgImage.height,
        alt: seoConfig.defaultOgImage.alt,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: seoConfig.social.twitter,
    creator: seoConfig.social.twitter,
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [seoConfig.defaultOgImage.url],
  },

  // Verification (add when available)
  // verification: {
  //   google: "google-site-verification-code",
  //   yandex: "yandex-verification-code",
  // },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },

  // Manifest
  manifest: "/manifest.json",

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={seoConfig.language} className="dark" suppressHydrationWarning>
      <head>
        {/* Structured Data - Organization */}
        <OrganizationSchema />
        {/* Structured Data - WebSite with Search */}
        <WebSiteSchema />
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-center" />
        <ThemeProvider>
          <ReduxProvider>
            <ClientLayout>{children}</ClientLayout>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
