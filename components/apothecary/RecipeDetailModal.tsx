"use client";

import { X, Clock, Flame, AlertCircle, Leaf } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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
}

interface RecipeDetailModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

export default function RecipeDetailModal({
  recipe,
  isOpen,
  onClose,
}: RecipeDetailModalProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 pr-8">
            {recipe.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[70vh] pr-4">
          {/* Description */}
          <p className="text-gray-700 mb-6">{recipe.description}</p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-gray-200">
            {recipe.prepTime && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">{recipe.prepTime} min</span>
              </div>
            )}
            {recipe.difficulty && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <Flame className="w-4 h-4 text-gray-600" />
                <Badge className={getDifficultyColor(recipe.difficulty)}>
                  {recipe.difficulty}
                </Badge>
              </div>
            )}
          </div>

          {/* Purpose */}
          {recipe.purpose.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                Purpose
              </h3>
              <div className="flex flex-wrap gap-2">
                {recipe.purpose.map((purpose, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 text-sm py-1 px-3"
                  >
                    {purpose}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Safety Notes */}
          {recipe.safetyNotes && (
            <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">
                    Safety Information
                  </h4>
                  <p className="text-sm text-amber-800">{recipe.safetyNotes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Ingredients
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-gray-700"
                >
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Instructions
            </h3>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {recipe.instructions}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
