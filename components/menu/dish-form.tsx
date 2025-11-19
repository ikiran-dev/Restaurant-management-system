'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { fileToBase64, validateImageFile } from '@/lib/image-utils';

interface DishFormProps {
  categoryId: string;
  dishId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DishForm({ categoryId, dishId, onSuccess, onCancel }: DishFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    available: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (dishId) {
      fetchDish();
    }
  }, [dishId]);

  async function fetchDish() {
    try {
      const response = await fetch(`/api/dishes?categoryId=${categoryId}`);
      const data = await response.json();
      const dish = data.data?.find((d: any) => d.id === dishId);
      if (dish) {
        setFormData({
          name: dish.name,
          description: dish.description || '',
          price: dish.price.toString(),
          image: dish.image || '',
          available: dish.available,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      setImageError(error);
      return;
    }

    setImageError('');
    try {
      const base64 = await fileToBase64(file);
      setFormData({ ...formData, image: base64 });
    } catch (err) {
      setImageError('Failed to process image');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = dishId ? `/api/dishes/${dishId}` : '/api/dishes';
      const method = dishId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          categoryId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save dish');
      }

      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="p-4 bg-blue-50">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="name">Dish Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Caesar Salad"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the dish..."
            disabled={isLoading}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Dish Image</Label>
          {formData.image && (
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={formData.image || "/placeholder.svg"}
                alt={formData.name}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image: '' })}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            <span className="text-sm">Click to upload image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isLoading}
              className="hidden"
            />
          </label>
          {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="9.99"
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-7">
            <Switch
              checked={formData.available}
              onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              disabled={isLoading}
            />
            <Label>Available</Label>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Dish'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
