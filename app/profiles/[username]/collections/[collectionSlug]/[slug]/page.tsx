import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getPlantBySlug } from "@/lib/utils";
import PlantImageGallery from "@/components/PlantImageGallery";
import Link from "next/link";
import PlantActions from "@/components/PlantActions";
import RelatedPlants from "@/components/RelatedPlants";
import { Leaf, Calendar, Eye, MapPin, Tag, Users } from "lucide-react";

type PageProps = {
  params: Promise<{
    username: string;
    slug: string;
    collectionSlug: string;
  }>;
};

export default async function PlantDetailPage({ params }: PageProps) {
  const { username, slug, collectionSlug } = await params;

  const plant = await getPlantBySlug(slug, username);
  if (!plant || !plant.slug) return notFound();

  const canonicalUsername = plant.user?.username;
  if (canonicalUsername && canonicalUsername !== username) {
    redirect(
      `/profiles/${canonicalUsername}/collections/${plant.collection?.slug}/${plant.slug}`
    );
  }

  return (
    <div className="min-h-screen">
      {/* Botanical gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-zinc-950 pointer-events-none" />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-2 8-8 14-16 16 8 2 14 8 16 16 2-8 8-14 16-16-8-2-14-8-16-16z' fill='%2310b981' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href={`/profiles/${username}`} className="text-zinc-400 hover:text-emerald-400 transition">
              @{username}
            </Link>
            <span className="text-zinc-600">/</span>
            <Link href={`/profiles/${username}/collections`} className="text-zinc-400 hover:text-emerald-400 transition">
              Albums
            </Link>
            <span className="text-zinc-600">/</span>
            {plant.collection?.slug ? (
              <Link 
                href={`/profiles/${username}/collections/${plant.collection.slug}`} 
                className="text-zinc-400 hover:text-emerald-400 transition"
              >
                {plant.collection.name || plant.collection.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Link>
            ) : (
              <span className="text-zinc-500">Collection</span>
            )}
            <span className="text-zinc-600">/</span>
            <span className="text-emerald-400">{plant.commonName || plant.slug}</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium uppercase tracking-wider">Plant Details</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
              {plant.commonName || plant.botanicalName}
            </h1>
            {plant.commonName && plant.botanicalName && (
              <h2 className="text-xl md:text-2xl italic text-emerald-400/70 font-light">
                {plant.botanicalName}
              </h2>
            )}
            {/* Decorative line */}
            <div className="mt-6 h-px bg-gradient-to-r from-emerald-500/50 via-emerald-500/20 to-transparent max-w-xl" />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Image Gallery - Large Column */}
            <div className="xl:col-span-2">
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-4 border border-zinc-800">
                <PlantImageGallery
                  images={plant.images}
                  alt={plant.commonName || plant.botanicalName}
                />
              </div>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
              {/* Plant Info Card */}
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                  Plant Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                    <span className="flex items-center gap-2 text-zinc-400 text-sm">
                      <MapPin className="w-4 h-4" />
                      Origin
                    </span>
                    <span className="text-white font-medium text-sm">
                      {plant.origin || "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                    <span className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Users className="w-4 h-4" />
                      Family
                    </span>
                    <span className="text-white font-medium text-sm">
                      {plant.family || "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                    <span className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Tag className="w-4 h-4" />
                      Type
                    </span>
                    <span className="text-white font-medium text-sm">
                      {plant.type || "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                    <span className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Eye className="w-4 h-4" />
                      Views
                    </span>
                    <span className="text-emerald-400 font-medium text-sm">
                      {plant.views.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      Added
                    </span>
                    <span className="text-white font-medium text-sm">
                      {new Date(plant.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags Card */}
              {plant.tags && plant.tags.length > 0 && (
                <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-emerald-400" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {plant.tags.map((tag, i) => (
                      <Link
                        href={`/the-vault/results?tag=${encodeURIComponent(tag.name)}`}
                        key={i}
                      >
                        <span className="inline-block bg-emerald-500/10 text-emerald-400 text-sm px-3 py-1.5 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200">
                          {tag.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Contributor Card */}
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Contributor
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <span className="text-white font-bold text-lg">
                      {username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <Link
                      href={`/profiles/${username}`}
                      className="text-white font-semibold hover:text-emerald-400 transition-colors"
                    >
                      @{username}
                    </Link>
                    <p className="text-sm text-zinc-400">
                      Plant Enthusiast
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
                <PlantActions plantId={plant.id} />
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800">
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              About This Plant
            </h3>
            <div className="prose prose-invert prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: plant.description }}
                className="text-zinc-300 leading-relaxed prose-headings:text-white prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-300 prose-strong:text-white"
              />
            </div>
          </div>
        </div>

        {/* Related Plants Section */}
        <RelatedPlants 
          plantId={plant.id} 
          currentPlantName={plant.commonName || plant.botanicalName} 
        />
      </div>
    </div>
  );
}
