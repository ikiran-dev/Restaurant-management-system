'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Plus, Settings, Trash2, UtensilsCrossed, Edit, Share2 } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  location?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

export function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  async function fetchRestaurants() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/restaurants');
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load restaurants');
        return;
      }

      setRestaurants(data.data || []);
    } catch (err) {
      setError('Failed to load restaurants');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedRestaurantId) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/restaurants/${selectedRestaurantId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to delete restaurant');
        return;
      }

      setRestaurants(restaurants.filter((r) => r.id !== selectedRestaurantId));
      setDeleteDialogOpen(false);
      setSelectedRestaurantId(null);
      setSelectedRestaurantName('');
    } catch (err) {
      setError('Failed to delete restaurant');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  }

  function openDeleteDialog(restaurantId: string, restaurantName: string) {
    setSelectedRestaurantId(restaurantId);
    setSelectedRestaurantName(restaurantName);
    setDeleteDialogOpen(true);
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading restaurants...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Restaurants</h2>
        <Link href="/dashboard/restaurants/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Restaurant
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </Card>
      )}

      {restaurants.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">No restaurants yet</p>
          <Link href="/dashboard/restaurants/new">
            <Button>Create Your First Restaurant</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} className="p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{restaurant.name}</h3>
              {restaurant.description && (
                <p className="text-sm text-gray-600 mb-3">{restaurant.description}</p>
              )}
              <div className="space-y-1 text-sm text-gray-500 mb-4">
                {restaurant.location && <p>📍 {restaurant.location}</p>}
                {restaurant.phone && <p>📞 {restaurant.phone}</p>}
                {restaurant.email && <p>📧 {restaurant.email}</p>}
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/restaurants/${restaurant.id}`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Edit className="h-4 w-4" />
                    Manage
                  </Button>
                </Link>
                <Link href={`/dashboard/restaurants/${restaurant.id}/menu`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <UtensilsCrossed className="h-4 w-4" />
                    Menu
                  </Button>
                </Link>
                <Link href={`/dashboard/restaurants/${restaurant.id}/share`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDeleteDialog(restaurant.id, restaurant.name)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Restaurant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedRestaurantName}</strong>? This action cannot be undone
              and will also delete all associated menus and dishes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
