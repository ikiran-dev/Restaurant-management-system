import { RestaurantForm } from '@/components/dashboard/restaurant-form';

export default function NewRestaurantPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <RestaurantForm />
      </div>
    </div>
  );
}
