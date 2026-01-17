import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import ReduxProvider from "@/redux/Provider";
import ClientLayout from "../app/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Floral Vault",
    template: "%s | Floral Vault",
  },
  description:
    "Floral Vault is a living library of plants, herbs, and natural remedies curated by the community.",
  keywords: [
    "Floral Vault",
    "plants",
    "herbs",
    "healing",
    "natural remedies",
    "medicinal plants",
    "botanical knowledge",
  ],
  metadataBase: new URL("https://flora-vault.vercel.app/"),
  openGraph: {
    title: "Floral Vault",
    description:
      "Discover and contribute to a growing library of plants and remedies from around the world.",
    url: "https://flora-vault.vercel.app/",
    siteName: "Floral Vault",
    images: [
      {
        url: "FloralVault-thumbnail.png", // You can host this in public/
        width: 1200,
        height: 630,
        alt: "Floral Vault OG Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Floral Vault",
    description:
      "Explore plants, herbs, and remedies with community-powered insights.",
    images: ["FloralVault-thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-center" />
        <ReduxProvider>
          <ClientLayout>{children}</ClientLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
