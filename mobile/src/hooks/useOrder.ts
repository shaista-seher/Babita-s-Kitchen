import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';
import { routes } from '../shared/routes';
import { Order } from '../shared/schema';

export const useOrder = (id: string) =>
  useQuery({
    queryKey: ['order', id],
    enabled: Boolean(id),
    queryFn: () => apiFetch<Order>(routes.order, undefined, { id }),
  });

export const useOrders = () =>
  useQuery({
    queryKey: ['orders'],
    queryFn: () => apiFetch<Order[]>(routes.orders),
  });
