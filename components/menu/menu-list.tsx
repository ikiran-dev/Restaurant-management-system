'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Plus, Trash2, Eye, Share2 } from 'lucide-react';
import { MenuForm } from './menu-form';
import { QRCodeGenerator } from './qr-code-generator';

interface Menu {
  id: string;
  name: string;
  slug: string;
  isPublic: boolean;
  createdAt: string;
}

interface MenuListProps {
  restaurantId: string;
  restaurantName: string;
}

export function MenuList({ restaurantId, restaurantName }: MenuListProps) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  useEffect(() => {
    fetchMenus();
  }, [restaurantId]);

  async function fetchMenus() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/menus?restaurantId=${restaurantId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load menus');
        return;
      }

      setMenus(data.data || []);
    } catch (err) {
      setError('Failed to load menus');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this menu?')) return;

    try {
      const response = await fetch(`/api/menus/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        setError('Failed to delete menu');
        return;
      }
      setMenus(menus.filter((m) => m.id !== id));
    } catch (err) {
      setError('Failed to delete menu');
      console.error(err);
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading menus...</div>;
  }

  if (selectedMenu) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => setSelectedMenu(null)}
          className="gap-2"
        >
          ← Back to Menus
        </Button>
        <QRCodeGenerator
          menuSlug={selectedMenu.slug}
          restaurantName={restaurantName}
          menuName={selectedMenu.name}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Menus</h2>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Menu
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </Card>
      )}

      {showForm && (
        <MenuForm
          restaurantId={restaurantId}
          onSuccess={() => {
            setShowForm(false);
            fetchMenus();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {menus.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">No menus created yet</p>
          <Button onClick={() => setShowForm(true)}>Create Your First Menu</Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {menus.map((menu) => (
            <Card key={menu.id} className="p-4">
              <h3 className="font-semibold text-lg mb-2">{menu.name}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {menu.isPublic ? '🌍 Public' : '🔒 Private'}
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full gap-2 text-sm"
                  onClick={() => setSelectedMenu(menu)}
                >
                  <Share2 className="h-4 w-4" />
                  Share & QR Code
                </Button>
                <a
                  href={`/menu/${menu.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full gap-2 text-sm">
                    <Eye className="h-4 w-4" />
                    View Menu
                  </Button>
                </a>
                <Button
                  variant="destructive"
                  className="w-full gap-2 text-sm"
                  onClick={() => handleDelete(menu.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
