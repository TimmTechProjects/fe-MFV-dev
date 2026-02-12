"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RecipeSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecipeSubmissionForm({
  isOpen,
  onClose,
}: RecipeSubmissionFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prepTime: '',
    difficulty: '',
    instructions: '',
    safetyNotes: '',
  });
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [purposes, setPurposes] = useState<string[]>(['']);
  const [plantIds, setPlantIds] = useState<string[]>(['']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('You must be logged in to submit a recipe');
      return;
    }

    setLoading(true);

    try {
      const token = await user.getIdToken();
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/apothecary/recipes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            prepTime: formData.prepTime ? parseInt(formData.prepTime) : undefined,
            difficulty: formData.difficulty,
            instructions: formData.instructions,
            safetyNotes: formData.safetyNotes || undefined,
            ingredients: ingredients.filter((i) => i.trim() !== ''),
            purpose: purposes.filter((p) => p.trim() !== ''),
            plantIds: plantIds.filter((p) => p.trim() !== ''),
            images: [],
          }),
        }
      );

      if (response.ok) {
        alert('Recipe submitted successfully!');
        onClose();
        // Reset form
        setFormData({
          title: '',
          description: '',
          prepTime: '',
          difficulty: '',
          instructions: '',
          safetyNotes: '',
        });
        setIngredients(['']);
        setPurposes(['']);
        setPlantIds(['']);
      } else {
        const error = await response.json();
        alert(`Failed to submit recipe: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Failed to submit recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addPurpose = () => {
    setPurposes([...purposes, '']);
  };

  const removePurpose = (index: number) => {
    setPurposes(purposes.filter((_, i) => i !== index));
  };

  const updatePurpose = (index: number, value: string) => {
    const updated = [...purposes];
    updated[index] = value;
    setPurposes(updated);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Submit Herbal Recipe
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Recipe Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Chamomile Sleep Tea"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the recipe"
              rows={3}
              required
            />
          </div>

          {/* Prep Time & Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prepTime">Prep Time (minutes)</Label>
              <Input
                id="prepTime"
                type="number"
                value={formData.prepTime}
                onChange={(e) =>
                  setFormData({ ...formData, prepTime: e.target.value })
                }
                placeholder="30"
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  setFormData({ ...formData, difficulty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <Label>Purpose (e.g., relaxation, digestion)</Label>
            {purposes.map((purpose, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  value={purpose}
                  onChange={(e) => updatePurpose(index, e.target.value)}
                  placeholder="e.g., Sleep aid"
                />
                {purposes.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removePurpose(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPurpose}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Purpose
            </Button>
          </div>

          {/* Ingredients */}
          <div>
            <Label>Ingredients *</Label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder="e.g., 2 tbsp dried chamomile"
                  required
                />
                {ingredients.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIngredient}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Ingredient
            </Button>
          </div>

          {/* Instructions */}
          <div>
            <Label htmlFor="instructions">Instructions *</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              placeholder="Step-by-step instructions..."
              rows={6}
              required
            />
          </div>

          {/* Safety Notes */}
          <div>
            <Label htmlFor="safetyNotes">Safety Notes</Label>
            <Textarea
              id="safetyNotes"
              value={formData.safetyNotes}
              onChange={(e) =>
                setFormData({ ...formData, safetyNotes: e.target.value })
              }
              placeholder="Any warnings, contraindications, or precautions..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            >
              {loading ? 'Submitting...' : 'Submit Recipe'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
