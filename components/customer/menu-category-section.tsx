import { DishCard } from './dish-card';

interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  dishes: Dish[];
}

interface MenuCategorySectionProps {
  category: Category;
}

export function MenuCategorySection({ category }: MenuCategorySectionProps) {
  return (
    <section id={`category-${category.id}`} className="py-12 border-b last:border-b-0">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
          {category.description && (
            <p className="text-gray-600 mt-2">{category.description}</p>
          )}
        </div>

        {category.dishes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No dishes available in this category</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {category.dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
