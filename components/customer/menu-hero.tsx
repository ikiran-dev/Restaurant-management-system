import Image from 'next/image';

interface MenuHeroProps {
  restaurant: {
    name: string;
    description?: string;
    logo?: string;
    location?: string;
    phone?: string;
    email?: string;
  };
}

export function MenuHero({ restaurant }: MenuHeroProps) {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-12 border-b">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {restaurant.logo ? (
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={restaurant.logo || "/placeholder.svg"}
                alt={restaurant.name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-bold">
              {restaurant.name.substring(0, 1)}
            </div>
          )}

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900">{restaurant.name}</h1>
            {restaurant.description && (
              <p className="text-gray-600 mt-2 text-lg">{restaurant.description}</p>
            )}

            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start text-sm text-gray-600">
              {restaurant.location && (
                <span className="flex items-center gap-1">
                  📍 {restaurant.location}
                </span>
              )}
              {restaurant.phone && (
                <span className="flex items-center gap-1">
                  📞 {restaurant.phone}
                </span>
              )}
              {restaurant.email && (
                <span className="flex items-center gap-1">
                  📧 {restaurant.email}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
