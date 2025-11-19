import { CategoryList } from '@/components/menu/category-list';

export default async function MenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-gray-600 mt-2">Manage categories and dishes for your restaurant</p>
        </div>
        <CategoryList restaurantId={id} />
      </div>
    </div>
  );
}
