"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import dynamic from "next/dynamic";
import { plantSchema, PlantSchema } from "@/schemas/plantSchema";
import ImageUploadField, { UploadedImage } from "@/components/forms/ImageUploadField";
import { Tag } from "@/types/tags";
import { getCollectionBySlug, getSuggestedTags, submitPlant } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { uploadFiles } from "@/lib/uploadthingClient";
import useAuth from "@/redux/hooks/useAuth";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  Sprout,
  Sun,
  MapPin,
  Tag as TagIcon,
  FileText,
  ImageIcon,
  Eye,
  EyeOff,
  Check,
  X,
  Flower2,
  TreeDeciduous,
  Info,
  Globe,
  Lock,
} from "lucide-react";
import {
  BotanicalCard,
  BotanicalButton,
  BotanicalTag,
  BotanicalSteps,
  LeafIcon,
  LeafDecoration,
  BotanicalEmptyState,
} from "@/components/ui/botanical";

const PlantEditor = dynamic(() => import("@/components/editor/PlantEditor"), {
  ssr: false,
});

// Plant type icons mapping
const PLANT_TYPE_ICONS: Record<string, React.ReactNode> = {
  herb: <Leaf className="w-4 h-4" />,
  shrub: <TreeDeciduous className="w-4 h-4" />,
  flower: <Flower2 className="w-4 h-4" />,
  tree: <TreeDeciduous className="w-4 h-4" />,
  vine: <Sprout className="w-4 h-4" />,
  succulent: <Sun className="w-4 h-4" />,
  fungus: <Sprout className="w-4 h-4" />,
};

const WIZARD_STEPS = [
  { id: "images", label: "Photos" },
  { id: "basics", label: "Basic Info" },
  { id: "details", label: "Details" },
  { id: "tags", label: "Tags & Visibility" },
];

const NewPlantPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { username, collectionSlug } = useParams();

  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [collectionName, setCollectionName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tag management
  const [tagInput, setTagInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const isFreeUser = user?.plan === "free";

  const form = useForm<PlantSchema>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      commonName: "",
      botanicalName: "",
      type: "",
      origin: "",
      family: "",
      description: "",
      tags: [],
      images: [],
      isPublic: true,
    },
  });

  // Fetch collection on mount
  useEffect(() => {
    const fetchCollection = async () => {
      if (typeof username !== "string" || typeof collectionSlug !== "string") {
        setLoading(false);
        return;
      }

      try {
        const collection = await getCollectionBySlug(username, collectionSlug);

        if (collection) {
          setCollectionId(collection.id);
          setCollectionName(collection.name);
        } else {
          console.error("Collection not found");
          router.replace("/404");
        }
      } catch (err) {
        console.error("Failed to fetch collection", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [username, collectionSlug, router]);

  // Auth check
  useEffect(() => {
    if (!user) {
      router.replace(
        `/login?redirect=/profiles/${username}/collections/${collectionSlug}/new`
      );
      return;
    }

    if (user.username !== username) {
      router.replace("/");
    }
  }, [user, username, collectionSlug, router]);

  // Debounce tag input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(tagInput.trim().toLowerCase());
    }, 250);

    return () => clearTimeout(timer);
  }, [tagInput]);

  // Fetch tag suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery) {
        setSuggestions([]);
        setIsPopoverOpen(false);
        return;
      }

      try {
        const filteredTags = await getSuggestedTags(debouncedQuery);

        if (!filteredTags || filteredTags.length === 0) {
          setSuggestions([]);
          setIsPopoverOpen(false);
        } else {
          setSuggestions(filteredTags);
          setIsPopoverOpen(true);
        }
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        setSuggestions([]);
        setIsPopoverOpen(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleAddTag = (tag?: string) => {
    const trimmed = (tag ?? tagInput).trim();
    const currentTags = form.watch("tags") || [];

    if (!trimmed) return;

    if (currentTags.length >= 10) {
      toast.warning("You can only add up to 10 tags.");
      setTagInput("");
      return;
    }

    if (!currentTags.includes(trimmed)) {
      form.setValue("tags", [...currentTags, trimmed]);
    }

    setTagInput("");
    setSuggestions([]);
    setIsPopoverOpen(false);
    setSelectedIndex(-1);
  };

  const handleRemoveTag = (index: number) => {
    const currentTags = form.watch("tags") || [];
    const tagToRemove = currentTags[index];
    form.setValue("tags", currentTags.filter((_, i) => i !== index));
    toast.info(`Tag "${tagToRemove}" removed`);
  };

  const onSubmit = async (values: PlantSchema) => {
    setIsSubmitting(true);

    try {
      const filesToUpload = values.images
        .filter((img): img is UploadedImage => !!img.file)
        .map((img) => img.file as File);

      if (filesToUpload.length > 10) {
        toast.error("You can only upload up to 10 images.");
        return;
      }

      const uploaded = await uploadFiles("imageUploader", {
        files: filesToUpload,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!uploaded.length) {
        toast.error("Image upload failed.");
        return;
      }

      const uploadedImages: UploadedImage[] = uploaded.map((file, idx) => ({
        url: file.ufsUrl,
        previewUrl: file.ufsUrl,
        isMain: idx === 0,
      }));

      const existingImages = values.images.filter(
        (img) => !(img as UploadedImage).file
      );

      const finalImages = [...uploadedImages, ...existingImages];

      const result = await submitPlant(
        { ...values, images: finalImages },
        collectionId!
      );

      if (result?.slug) {
        toast.success("Plant added successfully!");
        router.push(
          `/profiles/${result.user.username}/collections/${result.collection?.slug}/${result.slug}`
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Plant submission error:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceed = () => {
    const values = form.getValues();
    switch (currentStep) {
      case 0:
        return values.images.length > 0;
      case 1:
        return values.commonName.trim() !== "";
      case 2:
        return true; // Optional fields
      case 3:
        return true; // Optional fields
      default:
        return true;
    }
  };

  if (!user || user.username !== username || loading) {
    return (
      <div className="min-h-screen botanical-gradient botanical-pattern flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <Sprout className="w-8 h-8 text-[var(--botanical-sage)] animate-bounce" />
          <span className="text-[var(--botanical-sage)]">Loading greenhouse...</span>
        </div>
      </div>
    );
  }

  if (!collectionId) {
    return (
      <div className="min-h-screen botanical-gradient botanical-pattern flex items-center justify-center">
        <BotanicalEmptyState
          icon={<TreeDeciduous className="w-10 h-10 text-[var(--botanical-sage)]" />}
          title="Collection not found"
          description="This garden bed doesn't exist or you don't have access to it."
          action={
            <BotanicalButton onClick={() => router.push(`/profiles/${username}`)}>
              Return to Profile
            </BotanicalButton>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen botanical-gradient botanical-pattern">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/profiles/${username}/collections/${collectionSlug}`}
            className="p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-500" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <Sprout className="w-6 h-6 text-emerald-500" />
              Add New Plant
            </h1>
            <p className="text-sm text-zinc-400">
              Adding to <span className="text-emerald-500">{collectionName}</span>
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <BotanicalSteps steps={WIZARD_STEPS} currentStep={currentStep} />
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <BotanicalCard className="p-6 relative overflow-hidden">
              <LeafDecoration position="top-right" size="lg" />
              
              {/* Step 1: Images */}
              {currentStep === 0 && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <ImageIcon className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-zinc-100">
                        Plant Photos
                      </h2>
                      <p className="text-sm text-zinc-400">
                        Upload up to 10 photos of your plant
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUploadField
                            value={field.value || []}
                            onChange={(images) =>
                              form.setValue("images", images, { shouldDirty: true })
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                    <Info className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-zinc-400">
                      <p className="font-medium text-emerald-500 mb-1">Photo tips:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>The first photo will be used as the cover image</li>
                        <li>Include close-ups of leaves, flowers, and stems</li>
                        <li>Good lighting helps with plant identification</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <Leaf className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-zinc-100">
                        Basic Information
                      </h2>
                      <p className="text-sm text-zinc-400">
                        Tell us about your plant
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="commonName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-emerald-500">
                            Common Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Lavender, Snake Plant, Monstera"
                              className="botanical-input"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="botanicalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-emerald-500">
                            Botanical Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Lavandula angustifolia"
                              className="botanical-input italic"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-500">
                          Description
                        </FormLabel>
                        <FormControl>
                          <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 overflow-hidden">
                            <PlantEditor
                              content={field.value}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Details */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <FileText className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-zinc-100">
                        Plant Details
                      </h2>
                      <p className="text-sm text-zinc-400">
                        Optional botanical classification
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-emerald-500">
                            Plant Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="botanical-input">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700">
                              {Object.entries(PLANT_TYPE_ICONS).map(([type, icon]) => (
                                <SelectItem
                                  key={type}
                                  value={type}
                                  className="text-zinc-100 focus:bg-emerald-500/15 focus:text-emerald-500"
                                >
                                  <span className="flex items-center gap-2 capitalize">
                                    {icon} {type}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-emerald-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Origin
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Mediterranean"
                              className="botanical-input"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="family"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-emerald-500">
                            Plant Family
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Lamiaceae"
                              className="botanical-input"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Selected Type Preview */}
                  {form.watch("type") && (
                    <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-500">
                          {(form.watch("type") && PLANT_TYPE_ICONS[form.watch("type") as string]) || <Leaf className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-sm text-emerald-500 capitalize font-medium">
                            {form.watch("type")}
                          </p>
                          <p className="text-xs text-zinc-500">
                            Plant type selected
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Tags & Visibility */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <TagIcon className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-zinc-100">
                        Tags & Visibility
                      </h2>
                      <p className="text-sm text-zinc-400">
                        Help others discover your plant
                      </p>
                    </div>
                  </div>

                  {/* Tags Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-emerald-500">
                      Tags (up to 10)
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="Type and press Enter to add tags..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                              handleAddTag(suggestions[selectedIndex].name);
                            } else {
                              handleAddTag();
                            }
                          } else if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setSelectedIndex((prev) =>
                              Math.min(prev + 1, suggestions.length - 1)
                            );
                          } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setSelectedIndex((prev) => Math.max(prev - 1, 0));
                          }
                        }}
                        className="botanical-input"
                      />
                      {isPopoverOpen && suggestions.length > 0 && (
                        <div className="absolute top-full mt-2 z-50 w-full bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                          {suggestions.map((tag, idx) => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => handleAddTag(tag.name)}
                              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                selectedIndex === idx
                                  ? "bg-emerald-500/15 text-emerald-500"
                                  : "text-zinc-100 hover:bg-zinc-800"
                              }`}
                            >
                              {tag.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tags Display */}
                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                      {(form.watch("tags") || []).map((tag, index) => (
                        <BotanicalTag key={index} onRemove={() => handleRemoveTag(index)}>
                          {tag}
                        </BotanicalTag>
                      ))}
                      {(form.watch("tags") || []).length === 0 && (
                        <p className="text-sm text-zinc-500">
                          No tags added yet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Visibility Toggle */}
                  <div className="pt-6 border-t border-zinc-700/50">
                    <FormField
                      control={form.control}
                      name="isPublic"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg transition-colors ${
                                field.value
                                  ? "bg-emerald-500/15"
                                  : "bg-zinc-800/50"
                              }`}>
                                {field.value ? (
                                  <Globe className="w-5 h-5 text-emerald-500" />
                                ) : (
                                  <Lock className="w-5 h-5 text-zinc-500" />
                                )}
                              </div>
                              <div>
                                <FormLabel className="text-zinc-100 font-medium cursor-pointer">
                                  {field.value ? "Public" : "Private"}
                                  {isFreeUser && (
                                    <span className="ml-2 text-xs text-amber-500">
                                      🔒 Upgrade to unlock
                                    </span>
                                  )}
                                </FormLabel>
                                <p className="text-sm text-zinc-500">
                                  {field.value
                                    ? "Anyone can discover this plant"
                                    : "Only you can see this plant"}
                                </p>
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isFreeUser}
                                className="data-[state=checked]:bg-emerald-600"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-700/50">
                <BotanicalButton
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={currentStep === 0 ? "opacity-0 pointer-events-none" : ""}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </BotanicalButton>

                <div className="flex items-center gap-2">
                  {WIZARD_STEPS.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentStep(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentStep
                          ? "w-6 bg-emerald-500"
                          : index < currentStep
                          ? "bg-emerald-600"
                          : "bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>

                {currentStep < WIZARD_STEPS.length - 1 ? (
                  <BotanicalButton
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed()}
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </BotanicalButton>
                ) : (
                  <BotanicalButton
                    type="submit"
                    disabled={isSubmitting || !canProceed()}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Add Plant
                      </>
                    )}
                  </BotanicalButton>
                )}
              </div>
            </BotanicalCard>
          </form>
        </Form>

        {/* Preview Summary */}
        {form.watch("images").length > 0 && (
          <BotanicalCard className="mt-6 p-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800/50">
                {form.watch("images")[0]?.previewUrl ? (
                  <img
                    src={form.watch("images")[0].previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-zinc-700" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-zinc-100 truncate">
                  {form.watch("commonName") || "Untitled Plant"}
                </h3>
                {form.watch("botanicalName") && (
                  <p className="text-sm text-zinc-400 italic truncate">
                    {form.watch("botanicalName")}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-500">
                    {form.watch("images").length} photo{form.watch("images").length !== 1 ? "s" : ""}
                  </span>
                  {form.watch("type") && (
                    <>
                      <span className="text-zinc-700">•</span>
                      <span className="text-xs text-zinc-500 capitalize">
                        {form.watch("type")}
                      </span>
                    </>
                  )}
                  {(form.watch("tags") || []).length > 0 && (
                    <>
                      <span className="text-zinc-700">•</span>
                      <span className="text-xs text-zinc-500">
                        {form.watch("tags")?.length} tag{form.watch("tags")?.length !== 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-zinc-500">
                {form.watch("isPublic") ? (
                  <>
                    <Globe className="w-4 h-4" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Private
                  </>
                )}
              </div>
            </div>
          </BotanicalCard>
        )}
      </div>
    </div>
  );
};

export default NewPlantPage;
