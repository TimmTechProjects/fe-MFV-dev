import { notFound, redirect } from "next/navigation";
import { getPlantBySlug, decodeHtmlEntities } from "@/lib/utils";
import PlantImageGallery from "@/components/PlantImageGallery";
import Link from "next/link";
import PlantActions from "@/components/PlantActions";
import RelatedPlants from "@/components/RelatedPlants";
import CollapsibleSection from "@/components/CollapsibleSection";
import {
  Leaf,
  Calendar,
  Eye,
  MapPin,
  Tag,
  Users,
  TreeDeciduous,
  Sun,
  Wheat,
  Droplets,
  Flower2,
  Sprout,
} from "lucide-react";

const PLANT_TYPE_ICONS: Record<string, React.ReactNode> = {
  tree: <TreeDeciduous className="w-4 h-4" />,
  TREE: <TreeDeciduous className="w-4 h-4" />,
  shrub: <TreeDeciduous className="w-4 h-4" />,
  SHRUB: <TreeDeciduous className="w-4 h-4" />,
  herb: <Leaf className="w-4 h-4" />,
  HERBACEOUS: <Leaf className="w-4 h-4" />,
  flower: <Flower2 className="w-4 h-4" />,
  succulent: <Sun className="w-4 h-4" />,
  SUCCULENT: <Sun className="w-4 h-4" />,
  cactus: <Sun className="w-4 h-4" />,
  fern: <Leaf className="w-4 h-4" />,
  FERN: <Leaf className="w-4 h-4" />,
  bamboo: <Sprout className="w-4 h-4" />,
  grass: <Wheat className="w-4 h-4" />,
  GRASS: <Wheat className="w-4 h-4" />,
  vine: <Sprout className="w-4 h-4" />,
  VINE_CLIMBER: <Sprout className="w-4 h-4" />,
  bulb: <Flower2 className="w-4 h-4" />,
  aquatic: <Droplets className="w-4 h-4" />,
  AQUATIC: <Droplets className="w-4 h-4" />,
  mushroom: <Sprout className="w-4 h-4" />,
  FUNGUS: <Sprout className="w-4 h-4" />,
};

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

  const typeLabel = plant.primaryType
    ? plant.primaryType.replace("_", " / ")
    : plant.type
      ? plant.type.charAt(0).toUpperCase() + plant.type.slice(1)
      : null;

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-zinc-950 pointer-events-none" />
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-2 8-8 14-16 16 8 2 14 8 16 16 2-8 8-14 16-16-8-2-14-8-16-16z' fill='%2310b981' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link
              href={`/profiles/${username}`}
              className="text-zinc-400 hover:text-emerald-400 transition"
            >
              @{username}
            </Link>
            <span className="text-zinc-600">/</span>
            <Link
              href={`/profiles/${username}/collections`}
              className="text-zinc-400 hover:text-emerald-400 transition"
            >
              Albums
            </Link>
            <span className="text-zinc-600">/</span>
            {plant.collection?.slug ? (
              <Link
                href={`/profiles/${username}/collections/${plant.collection.slug}`}
                className="text-zinc-400 hover:text-emerald-400 transition"
              >
                {plant.collection.name ||
                  plant.collection.slug
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
              </Link>
            ) : (
              <span className="text-zinc-500">Collection</span>
            )}
            <span className="text-zinc-600">/</span>
            <span className="text-emerald-400 truncate">
              {plant.commonName || plant.slug}
            </span>
          </nav>

          {/* Plant Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  {plant.commonName || plant.botanicalName}
                </h1>
                {plant.commonName && plant.botanicalName && (
                  <p className="text-base md:text-lg italic text-emerald-400/70 font-light mt-0.5">
                    {plant.botanicalName}
                  </p>
                )}
              </div>
              <Link
                href={`/profiles/${username}`}
                className="flex items-center gap-2 shrink-0 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <span className="text-white font-bold text-sm">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-zinc-400 group-hover:text-emerald-400 transition-colors">
                  by @{username}
                </span>
              </Link>
            </div>

            {typeLabel && (
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/plants?type=${encodeURIComponent(plant.primaryType || plant.type)}`}>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-sm font-semibold px-3 py-1 rounded-full border border-emerald-500/30 hover:bg-emerald-500/30 hover:border-emerald-500/50 transition-all cursor-pointer">
                    {PLANT_TYPE_ICONS[plant.primaryType || plant.type] || (
                      <Leaf className="w-4 h-4" />
                    )}
                    {typeLabel}
                  </span>
                </Link>
              </div>
            )}
          </div>

          <div className="h-px bg-gradient-to-r from-emerald-500/50 via-emerald-500/20 to-transparent mb-8" />

          {/* Photo + Quick Facts */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            <div className="lg:col-span-3">
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-4 border border-zinc-800">
                <PlantImageGallery
                  images={plant.images}
                  alt={plant.commonName || plant.botanicalName}
                />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <CollapsibleSection
                title="Quick Facts"
                icon={<Leaf className="w-5 h-5 text-emerald-400" />}
              >
                <dl className="space-y-3">
                  {plant.botanicalName && (
                    <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                      <dt className="flex items-center gap-2 text-zinc-400 text-sm">
                        <Leaf className="w-4 h-4" />
                        Scientific
                      </dt>
                      <dd className="text-white font-medium text-sm italic">
                        {plant.botanicalName}
                      </dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                    <dt className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Users className="w-4 h-4" />
                      Family
                    </dt>
                    <dd className="text-white font-medium text-sm">
                      {plant.family || "Unknown"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                    <dt className="flex items-center gap-2 text-zinc-400 text-sm">
                      <MapPin className="w-4 h-4" />
                      Origin
                    </dt>
                    <dd className="text-white font-medium text-sm">
                      {plant.origin || "Unknown"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                    <dt className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Tag className="w-4 h-4" />
                      Type
                    </dt>
                    <dd className="text-white font-medium text-sm">
                      {typeLabel || "Unknown"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                    <dt className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Eye className="w-4 h-4" />
                      Views
                    </dt>
                    <dd className="text-emerald-400 font-medium text-sm">
                      {plant.views.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <dt className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      Added
                    </dt>
                    <dd className="text-white font-medium text-sm">
                      {new Date(plant.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </CollapsibleSection>

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

              {/* Traits Card */}
              {plant.plantTraits && plant.plantTraits.length > 0 && (
                <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-400" />
                    Traits
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {plant.plantTraits.map(({ trait }) => (
                      <Link
                        key={trait.id}
                        href={`/plants?trait=${trait.slug}`}
                      >
                        <span className="inline-block bg-emerald-500/10 text-emerald-400 text-sm px-3 py-1.5 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200">
                          {trait.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
                <PlantActions
                  plantId={plant.id}
                  initialIsGarden={plant.isGarden}
                  plantOwnerUsername={plant.user?.username}
                />
              </div>
            </div>
          </div>

          {/* Description / Notes */}
          {plant.description && (
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-zinc-800 mb-8">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                </div>
                About This Plant
              </h3>
              <div className="prose prose-invert prose-lg max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: decodeHtmlEntities(plant.description),
                  }}
                  className="text-zinc-300 leading-relaxed prose-headings:text-white prose-headings:font-semibold prose-headings:mb-3 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:mb-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-li:mb-1 prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-300 prose-strong:text-white prose-em:text-zinc-200"
                />
              </div>
            </div>
          )}
        </div>

        <RelatedPlants
          plantId={plant.id}
          currentPlantName={plant.commonName || plant.botanicalName}
        />
      </div>
    </div>
  );
}
