type RazorpayOptions = {
  description: string;
  image?: string;
  currency: string;
  key: string;
  amount: number;
  name: string;
  order_id: string;
  prefill: {
    email: string;
    contact: string;
    name: string;
  };
  theme: {
    color: string;
  };
};

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export async function openRazorpayCheckout(
  options: RazorpayOptions
): Promise<RazorpaySuccess> {
  try {
    // Keep Razorpay optional so Metro can bundle even when the native package
    // is not installed in Expo Go or local dev environments.
    const optionalRequire = eval('require');
    const razorpayModule = optionalRequire('react-native-razorpay');
    const RazorpayCheckout = razorpayModule?.default ?? razorpayModule;
    return await RazorpayCheckout.open(options);
  } catch (error) {
    throw new Error(
      'Razorpay native SDK is not available in Expo Go. Use a development build before testing online payments.'
    );
  }
}
