import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface DishCardProps {
  dish: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
  };
}

export function DishCard({ dish }: DishCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {dish.image ? (
        <div className="relative w-full h-48">
          <Image
            src={dish.image || "/placeholder.svg"}
            alt={dish.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No image</span>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900">{dish.name}</h3>
        {dish.description && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{dish.description}</p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">₹{dish.price}</span>
        </div>
      </div>
    </Card>
  );
}
