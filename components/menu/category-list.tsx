'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Plus, Trash2, Edit2 } from 'lucide-react';
import { CategoryForm } from './category-form';
import { DishList } from './dish-list';

interface Category {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  restaurantId: string;
}

interface CategoryListProps {
  restaurantId: string;
}

export function CategoryList({ restaurantId }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [restaurantId]);

  async function fetchCategories() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/categories?restaurantId=${restaurantId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load categories');
        return;
      }

      setCategories(data.data || []);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category? All dishes in it will be deleted.')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        setError('Failed to delete category');
        return;
      }
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      setError('Failed to delete category');
      console.error(err);
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Menu Categories</h2>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </Card>
      )}

      {showForm && (
        <CategoryForm
          restaurantId={restaurantId}
          onSuccess={() => {
            setShowForm(false);
            fetchCategories();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {categories.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">No categories yet</p>
          <Button onClick={() => setShowForm(true)}>Create First Category</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <Card key={category.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingId(category.id)}
                    className="gap-1"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(category.id)}
                    className="gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {editingId === category.id && (
                <CategoryForm
                  categoryId={category.id}
                  onSuccess={() => {
                    setEditingId(null);
                    fetchCategories();
                  }}
                  onCancel={() => setEditingId(null)}
                />
              )}

              <DishList categoryId={category.id} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
