import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';
import { routes } from '../shared/routes';
import { Dish } from '../shared/schema';

type BackendDish = {
  id: string | number;
  name: string;
  description?: string;
  price: number | string;
  imageUrl?: string;
  image?: string;
  category?: { name?: string } | string;
  categoryName?: string;
  isVeg?: boolean;
  addons?: {
    id: string | number;
    itemId?: string | number;
    name: string;
    extraPrice: number | string;
  }[];
};

function normalizeDish(input: BackendDish): Dish {
  const category =
    typeof input.category === 'string'
      ? input.category
      : input.category?.name ?? input.categoryName ?? 'Signature';

  return {
    id: String(input.id),
    name: input.name,
    description: input.description ?? '',
    price: Number(input.price ?? 0),
    category,
    imageUrl:
      input.imageUrl ||
      input.image ||
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    isVeg: Boolean(input.isVeg),
    addons: (input.addons ?? []).map((addon) => ({
      id: String(addon.id),
      itemId: String(addon.itemId ?? input.id),
      name: addon.name,
      extraPrice: Number(addon.extraPrice ?? 0),
    })),
  };
}

export const useDishes = () =>
  useQuery({
    queryKey: ['dishes'],
    queryFn: async () => {
      const result = await apiFetch<BackendDish[]>(routes.dishes);
      return result.map(normalizeDish);
    },
  });
