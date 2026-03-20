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
    const RazorpayCheckout =
      require('react-native-razorpay')?.default ?? require('react-native-razorpay');
    return await RazorpayCheckout.open(options);
  } catch (error) {
    throw new Error(
      'Razorpay native SDK is not available in Expo Go. Use a development build before testing online payments.'
    );
  }
}
