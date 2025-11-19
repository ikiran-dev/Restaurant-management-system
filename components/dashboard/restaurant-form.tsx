'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { fileToBase64, validateImageFile } from '@/lib/image-utils';

interface RestaurantFormProps {
  restaurantId?: string;
}

export function RestaurantForm({ restaurantId }: RestaurantFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    phone: '',
    email: '',
    logo: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurant();
    }
  }, [restaurantId]);

  async function fetchRestaurant() {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load restaurant');
        return;
      }

      setFormData({
        name: data.data.name,
        description: data.data.description || '',
        location: data.data.location || '',
        phone: data.data.phone || '',
        email: data.data.email || '',
        logo: data.data.logo || '',
      });
    } catch (err) {
      setError('Failed to load restaurant');
      console.error(err);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setImageError(validationError);
      return;
    }

    setImageError('');
    try {
      const base64 = await fileToBase64(file);
      setFormData({ ...formData, logo: base64 });
    } catch (err) {
      setImageError('Failed to process logo');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const url = restaurantId ? `/api/restaurants/${restaurantId}` : '/api/restaurants';
      const method = restaurantId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to save restaurant');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        {restaurantId ? 'Edit Restaurant' : 'Create Restaurant'}
      </h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Restaurant Logo</Label>
          {formData.logo && (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={formData.logo || "/placeholder.svg"}
                alt="Logo"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, logo: '' })}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            <span className="text-sm">Click to upload logo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={isLoading}
              className="hidden"
            />
          </label>
          {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Restaurant Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="My Awesome Restaurant"
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
            placeholder="Tell us about your restaurant..."
            disabled={isLoading}
            rows={4}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="123 Main St, City, State"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="contact@restaurant.com"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? 'Saving...' : 'Save Restaurant'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
