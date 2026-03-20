import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';
import { routes } from '../shared/routes';
import { DeliveryDetails, Order } from '../shared/schema';

type CreateOrderInput = {
  items: Array<{
    dishId: string;
    quantity: number;
    addonId?: string;
    price: number;
    name: string;
  }>;
  deliveryDetails: DeliveryDetails;
  paymentMethod: 'cod' | 'razorpay';
  total: number;
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: CreateOrderInput) =>
      apiFetch<Order>(routes.orders, {
        method: 'POST',
        body: JSON.stringify(order),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
