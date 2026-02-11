"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import dynamic from "next/dynamic";
import { plantSchema, PlantSchema } from "@/schemas/plantSchema";
import ImageUploadField, { UploadedImage } from "./ImageUploadField";
import { Tag } from "@/types/tags";
import { getSuggestedTags, submitPlant } from "@/lib/utils";
import { COUNTRIES } from "@/lib/countries";
import { Switch } from "../ui/switch";
import { uploadFiles } from "@/lib/uploadthingClient";
import useAuth from "@/redux/hooks/useAuth";

const PlantEditor = dynamic(() => import("@/components/editor/PlantEditor"), {
  ssr: false,
});

interface PlantSubmissionFormProps {
  collectionId: string;
}

const PlantSubmissionForm = ({ collectionId }: PlantSubmissionFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Country autocomplete
  const [countryInput, setCountryInput] = useState("");
  const [debouncedCountry, setDebouncedCountry] = useState("");
  const [countrySuggestions, setCountrySuggestions] = useState<string[]>([]);
  const [isCountryPopoverOpen, setIsCountryPopoverOpen] = useState(false);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(-1);

  const router = useRouter();
  const { user } = useAuth();
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
      isGarden: false,
    },
  });

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(tagInput.trim().toLowerCase());
    }, 250);

    return () => clearTimeout(timer);
  }, [tagInput]);

  // Fetch suggestions
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

  // Debounce country input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCountry(countryInput.trim().toLowerCase());
    }, 250);

    return () => clearTimeout(timer);
  }, [countryInput]);

  // Filter country suggestions
  useEffect(() => {
    if (!debouncedCountry) {
      setCountrySuggestions([]);
      setIsCountryPopoverOpen(false);
      return;
    }

    const filtered = COUNTRIES.filter((c) =>
      c.toLowerCase().includes(debouncedCountry)
    ).slice(0, 8);

    if (filtered.length > 0) {
      setCountrySuggestions(filtered);
      setIsCountryPopoverOpen(true);
    } else {
      setCountrySuggestions([]);
      setIsCountryPopoverOpen(false);
    }
  }, [debouncedCountry]);

  const handleSelectCountry = (country: string) => {
    form.setValue("origin", country);
    setCountryInput(country);
    setCountrySuggestions([]);
    setIsCountryPopoverOpen(false);
    setSelectedCountryIndex(-1);
  };

  const handleAddTag= (tag?: string) => {
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

  const onSubmit = async (values: PlantSchema) => {
    setIsLoading(true);

    try {
      const filesToUpload = values.images
        .filter((img): img is UploadedImage => !!img.file)
        .map((img) => img.file as File);

      if (filesToUpload.length > 10) {
        toast.error("You can only upload up to 10 images.");
        return;
      }

      const MAX_SIZE = 32 * 1024 * 1024;
      const tooBig = filesToUpload.filter((f) => f.size > MAX_SIZE);
      if (tooBig.length > 0) {
        toast.error(
          `${tooBig.length} file(s) exceed the 32MB limit: ${tooBig.map((f) => f.name).join(", ")}. Please remove them and try again.`
        );
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
        collectionId
      );

      if (result?.slug) {
        toast.success("Plant submitted successfully!");
        router.push(
          `/profiles/${result.user.username}/collections/${result.collection?.slug}/${result.slug}`
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Plant submission error:", err);
      const message =
        err instanceof Error ? err.message : String(err);
      if (message.includes("FileSizeMismatch")) {
        toast.error(
          "One or more images exceed the server's size limit. The backend may need to be redeployed. Please try a smaller image or contact support."
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-white p-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
              e.preventDefault();
            }
          }}
          className="space-y-6 border-hidden"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUploadField
                    value={field.value || []}
                    onChange={(images) =>
                      form.setValue("images", images, { shouldDirty: true })
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="commonName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Common Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lavender" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="botanicalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Botanical Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lavandula angustifolia" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <div className="rounded-lg border-hidden bg-transparent shadow-sm p-4">
                    <PlantEditor
                      content={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type <span className="text-zinc-500 opacity-70 font-normal">(Optional)</span></FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[300px] sm:w-full bg-transparent border text-white rounded-md">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2b2a2a] text-white">
                      <SelectItem value="herb">Herb</SelectItem>
                      <SelectItem value="shrub">Shrub</SelectItem>
                      <SelectItem value="flower">Flower</SelectItem>
                      <SelectItem value="tree">Tree</SelectItem>
                      <SelectItem value="vine">Vine</SelectItem>
                      <SelectItem value="succulent">Succulent</SelectItem>
                      <SelectItem value="fungus">Fungus</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country of Origin <span className="text-zinc-500 opacity-70 font-normal">(Optional)</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Search for a country..."
                        value={countryInput}
                        onChange={(e) => {
                          setCountryInput(e.target.value);
                          field.onChange(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setSelectedCountryIndex((prev) =>
                              Math.min(prev + 1, countrySuggestions.length - 1)
                            );
                          } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setSelectedCountryIndex((prev) => Math.max(prev - 1, 0));
                          } else if (e.key === "Enter" && selectedCountryIndex >= 0) {
                            e.preventDefault();
                            handleSelectCountry(countrySuggestions[selectedCountryIndex]);
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => setIsCountryPopoverOpen(false), 150);
                        }}
                      />
                      {isCountryPopoverOpen && countrySuggestions.length > 0 && (
                        <div className="absolute top-full mt-2 z-50 w-full bg-[#2b2a2a] border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {countrySuggestions.map((country, idx) => (
                            <button
                              key={country}
                              type="button"
                              onClick={() => handleSelectCountry(country)}
                              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                                selectedCountryIndex === idx
                                  ? "bg-[#3a3a3a] text-emerald-500"
                                  : "text-white hover:bg-[#3a3a3a]"
                              }`}
                            >
                              {country}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="family"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant Family <span className="text-zinc-500 opacity-70 font-normal">(Optional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Lamiaceae" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags (Limit up to 10 tags) <span className="text-zinc-500 opacity-70 font-normal">(Optional)</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Press Enter to add"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (
                              selectedIndex >= 0 &&
                              selectedIndex < suggestions.length
                            ) {
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
                      />
                      {isPopoverOpen && suggestions.length > 0 && (
                        <div className="absolute top-full mt-2 z-50 w-full bg-[#2b2a2a] border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {suggestions.map((tag, idx) => (
                            <div
                              key={tag.id}
                              onClick={() => handleAddTag(tag.name)}
                              className={`cursor-pointer px-3 py-2 text-sm hover:bg-[#3a3a3a] ${
                                selectedIndex === idx ? "bg-[#3a3a3a]" : ""
                              }`}
                            >
                              {tag.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>

                  {/* Tags list */}
                  <FormControl>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch("tags")?.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-green-700 text-white px-2 py-1 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            className="ml-1 text-white hover:text-red-300"
                            onClick={() => {
                              const updated = form
                                .watch("tags")
                                ?.filter((_, i) => i !== index);
                              form.setValue("tags", updated);

                              toast.info(`Tag ${tag} removed`);
                            }}
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 justify-end">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isFreeUser}
                      aria-readonly
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                    Public Post
                    {isFreeUser && (
                      <span
                        className="ml-2 text-xs text-yellow-400"
                        title="Upgrade plan to enable private saves"
                      >
                        🔒
                      </span>
                    )}
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isGarden"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 justify-end">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                    Add to My Garden
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className="w-24 rounded-2xl disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save →"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PlantSubmissionForm;
