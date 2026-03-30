import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionHeader } from '../components/SectionHeader';
import { showErrorToast, showSuccessToast } from '../components/ToastNotification';
import { useCart } from '../hooks/useCart';
import { useCreateOrder } from '../hooks/useCreateOrder';
import {
  useCreatePaymentOrder,
  useMarkPaymentSuccess,
  useVerifyPayment,
} from '../hooks/usePayment';
import { openRazorpayCheckout } from '../lib/razorpay';
import { checkoutSchema, DeliveryDetails } from '../shared/schema';
import { colors, radius, shadows, spacing, typeScale } from '../constants/theme';
import { fonts } from '../theme/fonts';
import { formatPrice } from '../utils/formatPrice';

type Step = 'details' | 'payment';
type PaymentMethod = 'cod' | 'razorpay';

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const { items, clearCart, totalPrice } = useCart();
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const createOrder = useCreateOrder();
  const createPaymentOrder = useCreatePaymentOrder();
  const verifyPayment = useVerifyPayment();
  const markPaymentSuccess = useMarkPaymentSuccess();

  const gst = totalPrice * 0.05;
  const total = Math.round(totalPrice + gst);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryDetails>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  useEffect(() => {
    if (items.length === 0) {
      navigation.navigate('MainTabs', { screen: 'Menu' });
    }
  }, [items.length, navigation]);

  const orderPayload = useMemo(
    () => ({
      items: items.map((item) => ({
        dishId: item.dish.id,
        quantity: item.quantity,
        addonId: item.selectedAddon?.id,
        price: item.unitPrice,
        name: item.dish.name,
      })),
      deliveryDetails: deliveryDetails as DeliveryDetails,
      paymentMethod,
      total,
    }),
    [deliveryDetails, items, paymentMethod, total]
  );

  const handlePlaceOrder = async () => {
    if (!deliveryDetails) {
      setCurrentStep('details');
      return;
    }

    try {
      const order = await createOrder.mutateAsync(orderPayload);
      const orderId = String((order as any).id ?? Date.now());

      if (paymentMethod === 'cod') {
        clearCart();
        showSuccessToast('Order placed', 'Pay at your doorstep');
        navigation.replace('OrderSuccess', { orderId });
        return;
      }

      const paymentOrder = await createPaymentOrder.mutateAsync({
        orderId,
        amount: total * 100,
      });

      const paymentResult = await openRazorpayCheckout({
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        description: "Babita's Kitchen order payment",
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID ?? '',
        name: "Babita's Kitchen",
        order_id: paymentOrder.orderId,
        prefill: {
          name: deliveryDetails.name,
          email: deliveryDetails.email,
          contact: deliveryDetails.phone,
        },
        theme: {
          color: colors.primary,
        },
      });

      const verification = await verifyPayment.mutateAsync(paymentResult);
      if (!verification.verified) {
        throw new Error('Payment verification failed');
      }

      await markPaymentSuccess.mutateAsync({
        id: orderId,
        razorpayPaymentId: paymentResult.razorpay_payment_id,
      });

      clearCart();
      showSuccessToast('Payment confirmed', 'Your order is on its way');
      navigation.replace('OrderSuccess', { orderId });
    } catch (error) {
      showErrorToast('Could not place order', (error as Error).message);
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <EmptyState
          icon="shopping-bag"
          title="Nothing to checkout"
          message="Add a few favourites to your order first."
          actionLabel="Browse Menu"
          onAction={() => navigation.navigate('MainTabs', { screen: 'Menu' })}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BackgroundBlobs softened />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <SectionHeader
                title={currentStep === 'details' ? 'Delivery details' : 'Payment method'}
                subtitle={
                  currentStep === 'details'
                    ? 'A cleaner checkout, with the same warm service behind it.'
                    : 'Choose how you would like to complete the order.'
                }
              />
              <View style={styles.stepIndicator}>
                <StepNode label="Details" active={currentStep === 'details'} />
                <View style={styles.stepLine} />
                <StepNode label="Payment" active={currentStep === 'payment'} />
              </View>
            </View>

            {currentStep === 'details' ? (
              <View style={styles.formCard}>
                <FormField
                  control={control}
                  name="name"
                  label="Full name"
                  placeholder="Babita Sharma"
                  error={errors.name?.message}
                />
                <FormField
                  control={control}
                  name="email"
                  label="Email"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                />
                <FormField
                  control={control}
                  name="phone"
                  label="Phone"
                  placeholder="9876543210"
                  keyboardType="phone-pad"
                  error={errors.phone?.message}
                />
                <FormField
                  control={control}
                  name="address"
                  label="Delivery address"
                  placeholder="House no., area, city, landmark"
                  multiline
                  error={errors.address?.message}
                />

                <PrimaryButton
                  title="Continue to payment"
                  icon="arrow-right"
                  onPress={handleSubmit((values) => {
                    setDeliveryDetails(values);
                    setCurrentStep('payment');
                  })}
                />
              </View>
            ) : (
              <View style={styles.formCard}>
                <View style={styles.paymentGrid}>
                  <PaymentOption
                    icon="credit-card"
                    title="Cash on Delivery"
                    subtitle="Pay at the doorstep"
                    selected={paymentMethod === 'cod'}
                    onPress={() => setPaymentMethod('cod')}
                  />
                  <PaymentOption
                    icon="smartphone"
                    title="Razorpay"
                    subtitle="Pay securely online"
                    selected={paymentMethod === 'razorpay'}
                    onPress={() => setPaymentMethod('razorpay')}
                  />
                </View>

                <View style={styles.summaryCard}>
                  <SummaryRow label="Subtotal" value={formatPrice(totalPrice)} />
                  <SummaryRow label="GST (5%)" value={formatPrice(gst)} />
                  <SummaryRow label="Delivery" value="Free" />
                  <SummaryRow label="Total" value={formatPrice(total)} emphasis />
                </View>

                <PrimaryButton
                  title="Place order"
                  onPress={handlePlaceOrder}
                  loading={
                    createOrder.isPending ||
                    createPaymentOrder.isPending ||
                    verifyPayment.isPending ||
                    markPaymentSuccess.isPending
                  }
                />

                <Pressable
                  style={({ pressed }) => [styles.backLinkWrap, pressed && styles.pressed]}
                  onPress={() => setCurrentStep('details')}
                >
                  <Text style={styles.backLink}>Back to details</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

function FormField({
  control,
  name,
  label,
  placeholder,
  error,
  multiline,
  ...props
}: {
  control: any;
  name: keyof DeliveryDetails;
  label: string;
  placeholder: string;
  error?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            style={[styles.input, multiline && styles.textArea]}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
            {...props}
          />
        )}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function PaymentOption({
  icon,
  title,
  subtitle,
  selected,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.paymentOption,
        selected && styles.paymentOptionSelected,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.paymentIconCircle}>
        <Feather name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.paymentBody}>
        <Text style={[styles.paymentTitle, selected && styles.paymentTitleSelected]}>{title}</Text>
        <Text style={styles.paymentSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
    </Pressable>
  );
}

function StepNode({ label, active }: { label: string; active: boolean }) {
  return (
    <View style={styles.stepNode}>
      <View style={[styles.stepCircle, active ? styles.stepCircleActive : styles.stepCircleInactive]} />
      <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={emphasis ? styles.summaryEmphasisLabel : styles.summaryLabel}>{label}</Text>
      <Text style={emphasis ? styles.summaryEmphasisValue : styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  header: {
    gap: spacing.md,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  stepNode: {
    width: 72,
    alignItems: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepCircleInactive: {
    backgroundColor: colors.background,
    borderColor: colors.borderStrong,
  },
  stepLabel: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: typeScale.support.size,
  },
  stepLabelActive: {
    color: colors.primary,
    fontFamily: fonts.bodyBold,
  },
  stepLine: {
    width: 40,
    marginTop: 11,
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
    borderStyle: 'dashed',
  },
  formCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.96)',
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  fieldWrap: {
    gap: spacing.xxs,
  },
  label: {
    color: colors.textHeading,
    fontFamily: fonts.bodyBold,
    fontSize: typeScale.support.size,
  },
  input: {
    minHeight: 52,
    borderRadius: radius.xl,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    color: colors.textHeading,
    fontFamily: fonts.body,
    fontSize: typeScale.body.size,
  },
  textArea: {
    minHeight: 104,
    paddingTop: spacing.md,
  },
  errorText: {
    color: colors.danger,
    fontFamily: fonts.body,
    fontSize: typeScale.support.size,
  },
  paymentGrid: {
    gap: spacing.sm,
  },
  paymentOption: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  paymentIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentBody: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  paymentTitle: {
    color: colors.textHeading,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  paymentTitleSelected: {
    color: colors.primary,
  },
  paymentSubtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: typeScale.support.size,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  summaryCard: {
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    padding: spacing.md,
    gap: spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: typeScale.body.size,
  },
  summaryValue: {
    color: colors.textHeading,
    fontFamily: fonts.bodyMedium,
    fontSize: typeScale.body.size,
  },
  summaryEmphasisLabel: {
    color: colors.textHeading,
    fontFamily: fonts.serifBold,
    fontSize: 18,
  },
  summaryEmphasisValue: {
    color: colors.primary,
    fontFamily: fonts.serifBold,
    fontSize: 18,
  },
  backLinkWrap: {
    alignSelf: 'center',
  },
  backLink: {
    color: colors.primary,
    fontFamily: fonts.bodyBold,
    textAlign: 'center',
    fontSize: typeScale.support.size,
  },
  pressed: {
    opacity: 0.75,
  },
});
