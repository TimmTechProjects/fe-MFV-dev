import { marketplaceMetadata } from "@/lib/seo/metadata";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";

// Enhanced SEO for marketplace
export const metadata = marketplaceMetadata();

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Marketplace", url: "/marketplace" },
        ]}
      />
      {children}
    </>
  );
}
