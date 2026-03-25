export type PolicyType = 'terms' | 'privacy' | 'refund';

export type RootTabParamList = {
  Home: undefined;
  Menu: { category?: string } | undefined;
  Cart: undefined;
  About: undefined;
};

export type RootStackParamList = {
  AuthScreen: undefined;
  OTPScreen: { phone: string; name?: string };
  MainTabs: undefined;
  DishDetails: { id: string };
  Checkout: undefined;
  OrderSuccess: { orderId: string };
  Contact: undefined;
  Admin: undefined;
  Policy: { type: PolicyType };
};
