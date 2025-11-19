import { RestaurantList } from '@/components/dashboard/restaurant-list';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <RestaurantList />
      </div>
    </div>
  );
}
