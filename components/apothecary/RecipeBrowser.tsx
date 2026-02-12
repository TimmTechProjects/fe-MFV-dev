"use client";

import { useState, useEffect } from 'react';
import { Clock, Flame, AlertCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import RecipeDetailModal from './RecipeDetailModal';

interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime?: number;
  difficulty?: string;
  purpose: string[];
  ingredients: string[];
  instructions: string;
  safetyNotes?: string;
  images: string[];
  createdAt: string;
}

export default function RecipeBrowser() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, [difficultyFilter]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/apothecary/recipes`);
      if (difficultyFilter) {
        url.searchParams.append('difficulty', difficultyFilter);
      }
      
      const response = await fetch(url.toString());
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
        <p className="text-xl text-gray-500">
          No recipes found. Be the first to submit one!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={difficultyFilter === null ? 'default' : 'outline'}
          onClick={() => setDifficultyFilter(null)}
          size="sm"
        >
          All
        </Button>
        <Button
          variant={difficultyFilter === 'easy' ? 'default' : 'outline'}
          onClick={() => setDifficultyFilter('easy')}
          size="sm"
          className="bg-green-500 hover:bg-green-600"
        >
          Easy
        </Button>
        <Button
          variant={difficultyFilter === 'medium' ? 'default' : 'outline'}
          onClick={() => setDifficultyFilter('medium')}
          size="sm"
          className="bg-amber-500 hover:bg-amber-600"
        >
          Medium
        </Button>
        <Button
          variant={difficultyFilter === 'hard' ? 'default' : 'outline'}
          onClick={() => setDifficultyFilter('hard')}
          size="sm"
          className="bg-red-500 hover:bg-red-600"
        >
          Hard
        </Button>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map((recipe) => (
          <Card
            key={recipe.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedRecipe(recipe)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl text-gray-900 flex-1">
                  {recipe.title}
                </CardTitle>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {recipe.description}
              </p>
            </CardHeader>

            <CardContent>
              {/* Meta Info */}
              <div className="flex flex-wrap gap-3 mb-4">
                {recipe.prepTime && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.prepTime} min</span>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Flame className="w-4 h-4" />
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty}
                    </Badge>
                  </div>
                )}
                {recipe.safetyNotes && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Safety Notes</span>
                  </div>
                )}
              </div>

              {/* Purpose Tags */}
              {recipe.purpose.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recipe.purpose.slice(0, 3).map((purpose, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-blue-100 text-blue-700"
                    >
                      {purpose}
                    </Badge>
                  ))}
                  {recipe.purpose.length > 3 && (
                    <Badge variant="secondary">+{recipe.purpose.length - 3}</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </>
  );
}
