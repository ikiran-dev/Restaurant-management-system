'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface MenuFormProps {
  restaurantId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MenuForm({ restaurantId, onSuccess, onCancel }: MenuFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setFormData({
      name,
      slug: generateSlug(name),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          name: formData.name,
          slug: formData.slug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create menu');
        return;
      }

      onSuccess();
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="p-6 bg-blue-50">
      <h3 className="text-lg font-semibold mb-4">Create New Menu</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Menu Name</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="e.g., Dinner Menu"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="auto-generated"
            disabled={isLoading}
            required
          />
          <p className="text-xs text-gray-600">
            Menu will be available at: /menu/{formData.slug}
          </p>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Menu'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
