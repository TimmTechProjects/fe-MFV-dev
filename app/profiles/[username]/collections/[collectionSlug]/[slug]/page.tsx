import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getPlantBySlug } from "@/lib/utils";
import PlantImageGallery from "@/components/PlantImageGallery";
import Link from "next/link";
import PlantActions from "@/components/PlantActions";
import RelatedPlants from "@/components/RelatedPlants";
import { LeafIcon } from "@/components/ui/botanical";
import {
  ArrowLeft,
  Globe,
  TreesIcon,
  Sprout,
  Eye,
  Calendar,
} from "lucide-react";

type PageProps = {
  params: Promise<{
    username: string;
    collectionSlug: string;
    slug: string;
  }>;
};

export default async function PlantDetailPage({ params }: PageProps) {
  const { username, collectionSlug, slug } = await params;

  const plant = await getPlantBySlug(slug, username);
  if (!plant || !plant.slug) return notFound();

  const canonicalUsername = plant.user?.username;
  if (canonicalUsername && canonicalUsername !== username) {
    redirect(
      `/profiles/${canonicalUsername}/collections/${plant.collection?.slug}/${plant.slug}`
    );
  }

  const infoItems = [
    { icon: Globe, label: "Origin", value: plant.origin || "Unknown" },
    { icon: TreesIcon, label: "Family", value: plant.family || "Unknown" },
    { icon: Sprout, label: "Type", value: plant.type || "Unknown" },
    { icon: Eye, label: "Views", value: plant.views.toLocaleString() },
    {
      icon: Calendar,
      label: "Added",
      value: new Date(plant.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-zinc-950" />
        <div className="absolute top-20 right-10 opacity-[0.03]">
          <LeafIcon className="w-64 h-64 text-emerald-500 rotate-12" />
        </div>
        <div className="absolute top-96 left-5 opacity-[0.02]">
          <LeafIcon className="w-48 h-48 text-emerald-500 -rotate-45" />
        </div>
        <div className="absolute bottom-40 right-20 opacity-[0.02]">
          <LeafIcon className="w-56 h-56 text-emerald-400 rotate-[135deg]" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
          <Link
            href={`/profiles/${username}/collections/${collectionSlug}`}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Collection
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
              <LeafIcon className="w-3 h-3" />
              Plant Details
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-white via-emerald-50 to-emerald-200 bg-clip-text text-transparent">
              {plant.commonName || plant.botanicalName}
            </h1>
            {plant.commonName && plant.botanicalName && (
              <h2 className="text-lg sm:text-xl md:text-2xl italic text-emerald-400/70 font-light">
                {plant.botanicalName}
              </h2>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            <div className="xl:col-span-2">
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-emerald-500/10 hover:border-emerald-500/20 transition-colors duration-300">
                <PlantImageGallery
                  images={plant.images}
                  alt={plant.commonName || plant.botanicalName}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-emerald-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <LeafIcon className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg font-semibold text-white">
                    Plant Information
                  </h3>
                </div>

                <div className="space-y-1">
                  {infoItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-2.5 border-b border-zinc-800/80 last:border-0 group/item hover:bg-emerald-500/5 rounded-lg px-2 -mx-2 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4 text-emerald-500/70" />
                        <span className="text-zinc-400 text-sm">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-white font-medium text-sm">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {plant.tags && plant.tags.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-zinc-800/80">
                    <h4 className="text-sm font-medium text-zinc-400 mb-3">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {plant.tags.map((tag, i) => (
                        <Link
                          href={`/the-vault/results?tag=${encodeURIComponent(
                            tag.name
                          )}`}
                          key={i}
                        >
                          <Badge className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all duration-200 rounded-full text-xs cursor-pointer">
                            {tag.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-emerald-500/10">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">
                  Contributor
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-emerald-500/20">
                    <span className="text-white font-bold text-sm">
                      {username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <Link
                      href={`/profiles/${username}`}
                      className="text-white font-semibold hover:text-emerald-400 transition-colors duration-200 text-sm"
                    >
                      @{username}
                    </Link>
                    <p className="text-xs text-zinc-500">Plant Enthusiast</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-emerald-500/10">
                <PlantActions plantId={plant.id} />
              </div>
            </div>
          </div>
        </div>

        {plant.description && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-emerald-500/10">
              <div className="flex items-center gap-2 mb-6">
                <LeafIcon className="w-5 h-5 text-emerald-500" />
                <h3 className="text-2xl font-bold text-white">
                  About This Plant
                </h3>
              </div>
              <div className="prose prose-invert prose-lg max-w-none prose-a:text-emerald-400 prose-strong:text-white">
                <div
                  dangerouslySetInnerHTML={{ __html: plant.description }}
                  className="text-zinc-300 leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        <RelatedPlants
          plantId={plant.id}
          currentPlantName={plant.commonName || plant.botanicalName}
        />
      </div>
    </div>
  );
}
