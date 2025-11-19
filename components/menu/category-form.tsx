'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface CategoryFormProps {
  restaurantId?: string;
  categoryId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({
  restaurantId,
  categoryId,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  async function fetchCategory() {
    try {
      // Fetch category details if editing
      const response = await fetch(`/api/categories?restaurantId=${restaurantId}`);
      const data = await response.json();
      const category = data.data?.find((c: any) => c.id === categoryId);
      if (category) {
        setFormData({ name: category.name, description: category.description || '' });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = categoryId ? `/api/categories/${categoryId}` : '/api/categories';
      const method = categoryId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ...(restaurantId && { restaurantId }),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save category');
      }

      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Appetizers"
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Category'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
