"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function SubmitEntryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [challenge, setChallenge] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    plantId: "",
    photos: [] as string[],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchChallenge();
  }, [user, params.id]);

  const fetchChallenge = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/challenges/${params.id}`
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.status !== "active") {
          setError("This challenge is not currently accepting submissions");
        }
        
        setChallenge(data);
      }
    } catch (error) {
      console.error("Error fetching challenge:", error);
      setError("Failed to load challenge");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (formData.photos.length === 0) {
      setError("Please add at least one photo");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await user.getIdToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/challenges/${params.id}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        router.push(`/challenges/${params.id}`);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to submit entry");
      }
    } catch (error) {
      console.error("Error submitting entry:", error);
      setError("Failed to submit entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUrlAdd = () => {
    const url = prompt("Enter photo URL:");
    if (url) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, url],
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/challenges" className="hover:text-green-400">
            Challenges
          </Link>
          <span>/</span>
          <Link
            href={`/challenges/${params.id}`}
            className="hover:text-green-400"
          >
            {challenge.title}
          </Link>
          <span>/</span>
          <span className="text-white">Submit Entry</span>
        </div>

        {/* Header */}
        <div className="bg-[#1a1d2d] border border-[#2c2f38] rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Submit Your Entry</h1>
          <p className="text-gray-400">
            Showcase your plant for: <span className="text-white font-medium">{challenge.title}</span>
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-[#1a1d2d] border border-[#2c2f38] rounded-lg p-6">
            <label className="block text-sm font-medium mb-2">
              Entry Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Give your entry a catchy title"
              className="w-full bg-[#0f1419] border border-[#2c2f38] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              required
            />
          </div>

          {/* Description */}
          <div className="bg-[#1a1d2d] border border-[#2c2f38] rounded-lg p-6">
            <label className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Tell us about your plant, care routine, or why it's special..."
              rows={4}
              className="w-full bg-[#0f1419] border border-[#2c2f38] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none"
            />
          </div>

          {/* Photos */}
          <div className="bg-[#1a1d2d] border border-[#2c2f38] rounded-lg p-6">
            <label className="block text-sm font-medium mb-2">
              Photos * (At least 1 required)
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {formData.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-[#0f1419] rounded-lg overflow-hidden border border-[#2c2f38]"
                >
                  <img
                    src={photo}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handlePhotoUrlAdd}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0f1419] border-2 border-dashed border-[#2c2f38] rounded-lg hover:border-green-500 transition-colors text-gray-400 hover:text-white"
            >
              <ImageIcon className="w-5 h-5" />
              Add Photo URL
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Tip: Upload your images to imgur.com or similar, then paste the URL here
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Link
              href={`/challenges/${params.id}`}
              className="flex-1 px-6 py-3 bg-[#2c2f38] text-white rounded-lg hover:bg-[#363942] transition-colors font-medium text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Submit Entry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
