import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';
import { routes } from '../shared/routes';

export const useCreatePaymentOrder = () =>
  useMutation({
    mutationFn: (payload: { orderId: string; amount: number }) =>
      apiFetch<{ orderId: string; amount: number; currency: string }>(routes.createPayment, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  });

export const useVerifyPayment = () =>
  useMutation({
    mutationFn: (payload: Record<string, string>) =>
      apiFetch<{ verified: boolean }>(routes.verifyPayment, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  });

export const useMarkPaymentSuccess = () =>
  useMutation({
    mutationFn: (payload: { id: string; razorpayPaymentId: string }) =>
      apiFetch(routes.orderPaymentSuccess, {
        method: 'POST',
        body: JSON.stringify({ razorpayPaymentId: payload.razorpayPaymentId }),
      }, { id: payload.id }),
  });
