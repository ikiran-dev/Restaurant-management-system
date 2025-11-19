'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
}

interface MenuNavigationProps {
  categories: Category[];
}

export function MenuNavigation({ categories }: MenuNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="hidden md:block sticky top-0 bg-white border-b shadow-sm z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`#category-${category.id}`}
                onClick={() => setIsOpen(false)}
                className="flex-shrink-0 px-4 py-2 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-800 hover:text-blue-700 transition-colors text-sm font-medium"
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-40"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="md:hidden fixed inset-0 top-0 pt-16 bg-black bg-opacity-50 z-30">
          <div className="bg-white p-4 space-y-2">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`#category-${category.id}`}
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-4 py-3 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-800 hover:text-blue-700 transition-colors font-medium"
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
