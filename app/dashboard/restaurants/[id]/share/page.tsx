import { MenuList } from '@/components/menu/menu-list';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // In production, fetch restaurant name from database
  const restaurantName = 'Your Restaurant';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Menu Settings</h1>
          <p className="text-gray-600 mt-2">Manage and share your restaurant menus</p>
        </div>
        <MenuList restaurantId={id} restaurantName={restaurantName} />
      </div>
    </div>
  );
}
