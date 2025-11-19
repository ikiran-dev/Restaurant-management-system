'use client';

import { useState, useEffect } from 'react';
import { MenuHero } from '@/components/customer/menu-hero';
import { MenuNavigation } from '@/components/customer/menu-navigation';
import { MenuCategorySection } from '@/components/customer/menu-category-section';
import { AlertCircle } from 'lucide-react';

interface Menu {
  id: string;
  slug: string;
  restaurant: {
    id: string;
    name: string;
    description?: string;
    logo?: string;
    location?: string;
    phone?: string;
    email?: string;
    theme: string;
    categories: Array<{
      id: string;
      name: string;
      description?: string;
      dishes: Array<{
        id: string;
        name: string;
        description?: string;
        price: number;
        image?: string;
      }>;
    }>;
  };
}

export default function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    const getParams = async () => {
      const p = await params;
      setSlug(p.slug);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    async function fetchMenu() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/public/menu/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Menu not found');
          return;
        }

        setMenu(data.data);
      } catch (err) {
        setError('Failed to load menu');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMenu();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full">
          <div className="flex items-center gap-3 mb-4 text-red-600">
            <AlertCircle className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Menu Not Found</h2>
          </div>
          <p className="text-gray-600">{error || 'The menu you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <MenuHero restaurant={menu.restaurant} />
      <MenuNavigation categories={menu.restaurant.categories} />

      <div className="bg-gray-50">
        {menu.restaurant.categories.length === 0 ? (
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <p className="text-gray-500 text-lg">No categories available yet</p>
          </div>
        ) : (
          menu.restaurant.categories.map((category) => (
            <MenuCategorySection key={category.id} category={category} />
          ))
        )}
      </div>

      <div className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {menu.restaurant.name}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
