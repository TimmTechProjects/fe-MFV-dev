"use client";

import { useState, useEffect } from 'react';
import { Leaf, Search, BookOpen, Plus } from 'lucide-react';
import MedicinalPlantCard from '@/components/apothecary/MedicinalPlantCard';
import RecipeBrowser from '@/components/apothecary/RecipeBrowser';
import RecipeSubmissionForm from '@/components/apothecary/RecipeSubmissionForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MedicinalPlant {
  id: string;
  plantId: string;
  plant: {
    id: string;
    commonName: string;
    botanicalName: string;
    images: { url: string; isMain: boolean }[];
  };
  properties: string[];
  activeCompounds: string[];
  traditionalUses: string[];
  modernUses: string[];
}

export default function ApothecaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [plants, setPlants] = useState<MedicinalPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [activeTab, setActiveTab] = useState('plants');

  useEffect(() => {
    fetchMedicinalPlants();
  }, [searchQuery]);

  const fetchMedicinalPlants = async () => {
    try {
      setLoading(true);
      const url = searchQuery
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/apothecary/search?query=${encodeURIComponent(searchQuery)}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/apothecary/search`;
      
      const response = await fetch(url);
      const data = await response.json();
      setPlants(data);
    } catch (error) {
      console.error('Error fetching medicinal plants:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500 rounded-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">The Apothecary</h1>
              <p className="text-gray-600 mt-1">
                Explore medicinal plants, traditional remedies, and herbal recipes
              </p>
            </div>
          </div>

          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-sm font-semibold">
            <BookOpen className="w-4 h-4" />
            Premium Feature
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by plant name, property, or compound..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="plants" className="text-lg py-3">
              <Leaf className="w-5 h-5 mr-2" />
              Medicinal Plants
            </TabsTrigger>
            <TabsTrigger value="recipes" className="text-lg py-3">
              <BookOpen className="w-5 h-5 mr-2" />
              Herbal Recipes
            </TabsTrigger>
          </TabsList>

          {/* Medicinal Plants Tab */}
          <TabsContent value="plants">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-96 bg-gray-200 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : plants.length === 0 ? (
              <div className="text-center py-16">
                <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">
                  No medicinal plants found. Try a different search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plants.map((plant) => (
                  <MedicinalPlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Recipes Tab */}
          <TabsContent value="recipes">
            <div className="mb-6 flex justify-end">
              <Button
                onClick={() => setShowRecipeForm(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Submit Recipe
              </Button>
            </div>
            <RecipeBrowser />
          </TabsContent>
        </Tabs>

        {/* Recipe Submission Modal */}
        {showRecipeForm && (
          <RecipeSubmissionForm
            isOpen={showRecipeForm}
            onClose={() => setShowRecipeForm(false)}
          />
        )}
      </div>
    </div>
  );
}
