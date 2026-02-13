import { vaultBrowseMetadata } from "@/lib/seo/metadata";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";

// Enhanced SEO for The Vault browse page
export const metadata = vaultBrowseMetadata();

export default function VaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "The Vault", url: "/the-vault" },
        ]}
      />
      {children}
    </>
  );
}
