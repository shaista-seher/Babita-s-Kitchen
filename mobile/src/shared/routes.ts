const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  'https://babitas-kitchen-test.onrender.com';

export const apiUrl = () => API_BASE;

export const buildUrl = (
  path: string,
  params?: Record<string, string | number>
) => {
  let url = `${API_BASE}${path}`;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
};

export const routes = {
  dishes: '/api/dishes',
  dish: '/api/dishes/:id',
  orders: '/api/orders',
  order: '/api/orders/:id',
  orderStatus: '/api/orders/:id/status',
  orderPaymentSuccess: '/api/orders/:id/payment-success',
  createPayment: '/api/payment/create-order',
  verifyPayment: '/api/payment/verify',
} as const;
