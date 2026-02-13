import { forumMetadata } from "@/lib/seo/metadata";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";

// Enhanced SEO for Forum/Community
export const metadata = forumMetadata();

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Forum", url: "/forum" },
        ]}
      />
      {children}
    </>
  );
}
