'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { DishForm } from './dish-form';

interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  available: boolean;
}

interface DishListProps {
  categoryId: string;
}

export function DishList({ categoryId }: DishListProps) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDishes();
  }, [categoryId]);

  async function fetchDishes() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/dishes?categoryId=${categoryId}`);
      const data = await response.json();
      setDishes(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this dish?')) return;

    try {
      const response = await fetch(`/api/dishes/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      setDishes(dishes.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-3 mt-4 pl-4 border-l-2 border-gray-200">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-gray-700">Dishes</h4>
        <Button size="sm" onClick={() => setShowForm(true)} className="gap-1 text-xs">
          <Plus className="h-3 w-3" />
          Add Dish
        </Button>
      </div>

      {showForm && (
        <DishForm
          categoryId={categoryId}
          onSuccess={() => {
            setShowForm(false);
            fetchDishes();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {dishes.length === 0 ? (
        <p className="text-xs text-gray-500 py-2">No dishes yet</p>
      ) : (
        <div className="space-y-2">
          {dishes.map((dish) => (
            <div key={dish.id} className="flex items-center justify-between p-3 bg-white rounded border">
              <div className="flex-1">
                <p className="font-medium text-sm">{dish.name}</p>
                {dish.description && <p className="text-xs text-gray-600 mt-0.5">{dish.description}</p>}
                <p className="text-sm font-semibold text-green-600 mt-1">₹{dish.price}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingId(dish.id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(dish.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingId && (
        <DishForm
          dishId={editingId}
          categoryId={categoryId}
          onSuccess={() => {
            setEditingId(null);
            fetchDishes();
          }}
          onCancel={() => setEditingId(null)}
        />
      )}
    </div>
  );
}
