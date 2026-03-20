import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';
import { routes } from '../shared/routes';
import { Dish } from '../shared/schema';

export const useDish = (id: string) =>
  useQuery({
    queryKey: ['dish', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const result = await apiFetch<any>(routes.dish, undefined, { id });
      return {
        id: String(result.id),
        name: result.name,
        description: result.description ?? '',
        price: Number(result.price ?? 0),
        category:
          typeof result.category === 'string'
            ? result.category
            : result.category?.name ?? result.categoryName ?? 'Signature',
        imageUrl:
          result.imageUrl ||
          result.image ||
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        isVeg: Boolean(result.isVeg),
        addons: (result.addons ?? []).map((addon: any) => ({
          id: String(addon.id),
          itemId: String(addon.itemId ?? result.id),
          name: addon.name,
          extraPrice: Number(addon.extraPrice ?? 0),
        })),
      } satisfies Dish;
    },
  });
