export type PolicyType = 'terms' | 'privacy' | 'refund';

export type RootTabParamList = {
  Home: undefined;
  Menu: { category?: string } | undefined;
  Cart: undefined;
  About: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  DishDetails: { id: string };
  Checkout: undefined;
  OrderSuccess: { orderId: string };
  Contact: undefined;
  Admin: undefined;
  Login: undefined;
  Signup: undefined;
  Policy: { type: PolicyType };
};
