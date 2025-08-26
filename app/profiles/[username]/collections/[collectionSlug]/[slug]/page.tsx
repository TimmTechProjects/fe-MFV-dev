import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getPlantBySlug } from "@/lib/utils";
import PlantImageGallery from "@/components/PlantImageGallery";
import Link from "next/link";
import PlantActions from "@/components/PlantActions";

type PageProps = {
  params: Promise<{
    username: string;
    slug: string;
  }>;
};

export default async function PlantDetailPage({ params }: PageProps) {
  const { username, slug } = await params;

  const plant = await getPlantBySlug(slug, username);
  if (!plant || !plant.slug) return notFound();

  const canonicalUsername = plant.user?.username;
  if (canonicalUsername && canonicalUsername !== username) {
    redirect(
      `/profiles/${canonicalUsername}/collections/${plant.collection?.slug}/${plant.slug}`
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-black via-black/95 to-black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
              {plant.commonName || plant.botanicalName}
            </h1>
            {plant.commonName && plant.botanicalName && (
              <h2 className="text-xl md:text-2xl italic text-gray-400 font-light">
                {plant.botanicalName}
              </h2>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Image Gallery - Large Column */}
            <div className="xl:col-span-2">
              <div className="bg-gray-900/50 rounded-3xl p-4 border border-gray-800">
                <PlantImageGallery
                  images={plant.images}
                  alt={plant.commonName || plant.botanicalName}
                />
              </div>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
              {/* Combined Info and Contributor Card */}
              <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                  {/* Plant Info Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-white">
                      Plant Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400 text-sm">Origin</span>
                        <span className="text-white font-medium text-sm">
                          {plant.origin || "Unknown"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400 text-sm">Family</span>
                        <span className="text-white font-medium text-sm">
                          {plant.family || "Unknown"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400 text-sm">Type</span>
                        <span className="text-white font-medium text-sm">
                          {plant.type || "Unknown"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400 text-sm">Views</span>
                        <span className="text-white font-medium text-sm">
                          {plant.views.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <span className="text-gray-400 text-sm">Added</span>
                        <span className="text-white font-medium text-sm">
                          {new Date(plant.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {plant.tags && plant.tags.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-white">
                            Tags
                          </h3>
                          <div className="flex flex-wrap gap-x-2 gap-y-1">
                            {plant.tags.map((tag, i) => (
                              <Link
                                href={`/the-vault/results?tag=${encodeURIComponent(
                                  tag.name
                                )}`}
                                key={i}
                              >
                                <Badge className="px-3 py-1 bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white transition-all duration-200 rounded-full text-xs">
                                  {tag.name}
                                </Badge>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contributor Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-white">
                      Contributor
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#81a308] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <Link
                          href={`/profiles/${username}`}
                          className="text-white font-semibold hover:text-green-400 transition-colors text-sm"
                        >
                          @{username}
                        </Link>
                        <p className="text-xs text-gray-400">
                          Plant Enthusiast
                        </p>
                      </div>
                    </div>
                  </div>
                  <PlantActions plantId={plant.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="max-w-7xl mx-auto px-6 pt-0 pb-10">
        <div className="bg-gray-900/30 rounded-3xl p-8 border border-gray-800">
          <h3 className="text-2xl font-bold mb-6 text-white">
            About This Plant
          </h3>
          <div className="prose prose-invert prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: plant.description }}
              className="text-gray-300 leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Related Content - Compact */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-gradient-to-r from-gray-900/20 to-gray-800/20 rounded-3xl p-8 border border-gray-800 text-center">
          <h3 className="text-xl font-bold mb-4 text-white">
            Explore More Plants
          </h3>
          <p className="text-gray-400 mb-6">
            Discover more amazing plants from our community
          </p>
          <Link
            href="/the-vault"
            className="inline-block px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors font-medium"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
