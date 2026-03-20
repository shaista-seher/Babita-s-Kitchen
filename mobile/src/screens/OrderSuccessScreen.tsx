import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { PrimaryButton } from '../components/PrimaryButton';
import { useOrder } from '../hooks/useOrder';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius, spacing } from '../theme/spacing';
import { shadow } from '../theme/shadow';
import { formatPrice } from '../utils/formatPrice';

const TIMELINE = ['Order Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

export default function OrderSuccessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { data: order, isLoading } = useOrder(route.params?.orderId);
  const scale = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSpring(1);
  }, [scale]);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  const timelineIndex = useMemo(() => {
    const status = String((order as any)?.status ?? 'pending').toLowerCase();
    if (status.includes('deliver')) return 4;
    if (status.includes('out')) return 3;
    if (status.includes('prep')) return 2;
    if (status.includes('confirm') || status.includes('paid')) return 1;
    return 0;
  }, [order]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingSafeArea}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  const rawItems = Array.isArray((order as any)?.items) ? (order as any).items : [];
  const items = rawItems.map((item: any) => ({
    id: String(item.id ?? item.product?.id ?? Math.random()),
    name: item.dish?.name ?? item.product?.name ?? 'Dish',
    quantity: item.quantity ?? 1,
    price: Number(item.unitPrice ?? item.price ?? item.product?.price ?? 0),
    imageUrl:
      item.dish?.imageUrl ??
      item.product?.imageUrl ??
      item.product?.image ??
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  }));

  const deliveryDetails = (order as any)?.deliveryDetails ?? {};
  const subtotal = items.reduce((sum: number, item: (typeof items)[number]) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.05;
  const total = Number((order as any)?.total ?? Math.round(subtotal + gst));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BackgroundBlobs />
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <>
              <Animated.View style={[styles.checkWrap, checkStyle]}>
                <Feather name="check-circle" size={44} color={colors.primary} />
              </Animated.View>
              <Text style={styles.title}>Order Confirmed!</Text>
              <Text style={styles.orderId}>Order #{route.params?.orderId}</Text>
              <View style={styles.badgeRow}>
                <Badge label={String((order as any)?.status ?? 'pending')} confirmed />
              </View>
              <View style={styles.timelineWrap}>
                {TIMELINE.map((step, index) => {
                  const completed = index < timelineIndex;
                  const current = index === timelineIndex;
                  return (
                    <React.Fragment key={step}>
                      <View style={styles.timelineStep}>
                        <View style={[styles.timelineCircle, completed && styles.timelineCircleDone, current && styles.timelineCircleCurrent]}>
                          {completed ? <Feather name="check" size={10} color={colors.white} /> : current ? <View style={styles.timelineDotCurrent} /> : null}
                        </View>
                        <Text style={[styles.timelineLabel, (completed || current) && styles.timelineLabelActive]}>{step}</Text>
                      </View>
                      {index < TIMELINE.length - 1 ? <View style={[styles.timelineConnector, index < timelineIndex && styles.timelineConnectorDone]} /> : null}
                    </React.Fragment>
                  );
                })}
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Delivery details</Text>
                <Text style={styles.cardText}>{deliveryDetails.name || 'Details shared at checkout'}</Text>
                <Text style={styles.cardText}>{deliveryDetails.email || 'Email not available'}</Text>
                <Text style={styles.cardText}>{deliveryDetails.phone || 'Phone not available'}</Text>
                <Text style={styles.cardText}>{deliveryDetails.address || 'Address not available'}</Text>
              </View>
              <Text style={styles.sectionTitle}>Items</Text>
            </>
          }
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} contentFit="cover" />
              <View style={styles.itemBody}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>Qty {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
            </View>
          )}
          ListFooterComponent={
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Totals</Text>
                <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
                <SummaryRow label="GST (5%)" value={formatPrice(gst)} />
                <SummaryRow label="Total" value={formatPrice(total)} emphasis />
              </View>
              <PrimaryButton title="Back to Menu" onPress={() => navigation.navigate('MainTabs', { screen: 'Menu' })} style={styles.backButton} />
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
}

function Badge({ label, confirmed }: { label: string; confirmed?: boolean }) {
  return (
    <View style={[styles.badge, confirmed ? styles.badgeConfirmed : styles.badgePending]}>
      <Text style={[styles.badgeText, confirmed ? styles.badgeTextConfirmed : styles.badgeTextPending]}>{label}</Text>
    </View>
  );
}

function SummaryRow({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={emphasis ? styles.summaryLabelStrong : styles.summaryLabel}>{label}</Text>
      <Text style={emphasis ? styles.summaryValueStrong : styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.cream },
  loadingSafeArea: { flex: 1, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, backgroundColor: colors.cream },
  content: { paddingHorizontal: 16, paddingBottom: spacing.xxl },
  checkWrap: {
    alignSelf: 'center',
    marginTop: spacing.sm,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 20,
    textAlign: 'center',
    fontFamily: fonts.serifBold,
    fontSize: 30,
    color: colors.textHeading,
  },
  orderId: {
    marginTop: 6,
    textAlign: 'center',
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    letterSpacing: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
  },
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeConfirmed: {
    backgroundColor: '#e8f5e9',
  },
  badgePending: {
    backgroundColor: '#fff8e1',
  },
  badgeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  badgeTextConfirmed: {
    color: colors.vegGreen,
  },
  badgeTextPending: {
    color: '#f57f17',
  },
  timelineWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 18,
  },
  timelineStep: {
    width: 56,
    alignItems: 'center',
  },
  timelineCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d4c4bc',
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCircleDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timelineCircleCurrent: {
    borderColor: colors.primary,
  },
  timelineDotCurrent: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  timelineConnector: {
    flex: 1,
    marginTop: 9,
    borderTopWidth: 2,
    borderTopColor: '#d4c4bc',
    borderStyle: 'dashed',
  },
  timelineConnectorDone: {
    borderTopColor: colors.primary,
  },
  timelineLabel: {
    marginTop: 8,
    textAlign: 'center',
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 10,
  },
  timelineLabelActive: {
    color: colors.textHeading,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...shadow.card,
  },
  cardTitle: {
    color: colors.textHeading,
    fontFamily: fonts.serifBold,
    fontSize: 22,
    marginBottom: 8,
  },
  cardText: {
    color: colors.textBody,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  sectionTitle: {
    color: colors.textHeading,
    fontFamily: fonts.serifBold,
    fontSize: 24,
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    ...shadow.soft,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#e8ddd4',
  },
  itemBody: {
    flex: 1,
  },
  itemName: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.textHeading,
  },
  itemMeta: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  itemPrice: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  summaryValue: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.textHeading,
  },
  summaryLabelStrong: {
    fontFamily: fonts.serifBold,
    fontSize: 18,
    color: colors.textHeading,
  },
  summaryValueStrong: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.primary,
  },
  backButton: {
    marginBottom: 32,
  },
});
