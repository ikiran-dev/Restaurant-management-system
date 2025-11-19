import { RestaurantForm } from '@/components/dashboard/restaurant-form';

export default async function EditRestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <RestaurantForm restaurantId={id} />
      </div>
    </div>
  );
}
