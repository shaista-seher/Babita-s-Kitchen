import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionHeader } from '../components/SectionHeader';
import { useCart } from '../hooks/useCart';
import { colors, radius, shadows, spacing, typeScale } from '../constants/theme';
import { fonts } from '../theme/fonts';
import { formatPrice } from '../utils/formatPrice';

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const { items, removeFromCart, totalPrice, updateQuantity } = useCart();

  const gst = totalPrice * 0.05;
  const total = Math.round(totalPrice + gst);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <BackgroundBlobs softened />
          <View style={styles.emptyWrap}>
            <Feather name="feather" size={18} color={colors.primary} style={styles.emptyLeaf} />
            <View style={styles.illustrationWrap}>
              <View style={styles.basketHandle} />
              <View style={styles.basketBody}>
                <View style={styles.basketStripe} />
                <View style={styles.basketStripe} />
                <View style={styles.basketStripe} />
              </View>
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyBody}>
              Discover handmade goodness from Babita&apos;s Kitchen and add your favourites here.
            </Text>
            <PrimaryButton
              title="Browse Menu"
              icon="arrow-right"
              onPress={() => navigation.navigate('MainTabs', { screen: 'Menu' })}
              style={styles.emptyButton}
            />
            <View style={styles.emptyDots}>
              <View style={styles.emptyDot} />
              <View style={styles.emptyDot} />
              <View style={styles.emptyDot} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BackgroundBlobs softened />
        <FlatList
          data={items}
          keyExtractor={(item, index) => `${item.dish.id}-${item.selectedAddon?.id ?? 'base'}-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <View style={styles.headerWrap}>
              <SectionHeader title="Your cart" subtitle="Review quantities before you place the order." />
              <View style={styles.countChip}>
                <Text style={styles.countChipText}>{items.length} items</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.rowCard}>
              <Image source={{ uri: item.dish.imageUrl }} style={styles.thumb} contentFit="cover" />
              <View style={styles.rowBody}>
                <Text style={styles.rowCategory}>{item.dish.category}</Text>
                <Text style={styles.rowTitle} numberOfLines={2}>
                  {item.dish.name}
                </Text>
                <Text style={styles.rowMeta} numberOfLines={2}>
                  {item.selectedAddon ? `Flavour: ${item.selectedAddon.name}` : 'Handmade kitchen special'}
                </Text>
                <Text style={styles.rowPrice}>{formatPrice(item.unitPrice)}</Text>
                <View style={styles.rowActions}>
                  <View style={styles.stepper}>
                    <Pressable
                      style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed]}
                      onPress={() => updateQuantity(item.dish.id, item.quantity - 1)}
                    >
                      <Text style={styles.stepperLabel}>-</Text>
                    </Pressable>
                    <Text style={styles.stepperCount}>{item.quantity}</Text>
                    <Pressable
                      style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed]}
                      onPress={() => updateQuantity(item.dish.id, item.quantity + 1)}
                    >
                      <Text style={styles.stepperLabel}>+</Text>
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() =>
                      Alert.alert('Remove item', `Remove ${item.dish.name} from your cart?`, [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.dish.id) },
                      ])
                    }
                    style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
                  >
                    <Feather name="trash-2" size={18} color={colors.textMuted} />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          ListFooterComponent={
            <>
              <View style={styles.summaryCard}>
                <SummaryRow label="Subtotal" value={formatPrice(totalPrice)} />
                <SummaryRow label="GST (5%)" value={formatPrice(gst)} />
                <SummaryRow label="Delivery" value="Free" />
                <View style={styles.summaryDivider} />
                <SummaryRow label="Total" value={formatPrice(total)} emphasis />
              </View>
              <PrimaryButton
                title="Proceed to checkout"
                icon="arrow-right"
                onPress={() => navigation.navigate('Checkout')}
                style={styles.checkoutButton}
              />
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={emphasis ? styles.totalLabel : styles.summaryLabel}>{label}</Text>
      <Text style={emphasis ? styles.totalValue : styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.dockClearance,
  },
  emptyLeaf: {
    marginBottom: spacing.xs,
  },
  illustrationWrap: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  basketHandle: {
    width: 54,
    height: 26,
    borderWidth: 3,
    borderColor: colors.borderStrong,
    borderBottomWidth: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  basketBody: {
    width: 72,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#E6C7A8',
    borderWidth: 2,
    borderColor: colors.borderStrong,
    marginTop: -2,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  basketStripe: {
    width: 8,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#D6A97A',
  },
  emptyTitle: {
    color: colors.textHeading,
    fontFamily: fonts.serifBold,
    fontSize: 26,
    lineHeight: 32,
    textAlign: 'center',
  },
  emptyBody: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: typeScale.body.size,
    lineHeight: typeScale.body.lineHeight,
    textAlign: 'center',
    maxWidth: 300,
  },
  emptyButton: {
    marginTop: spacing.md,
    minWidth: 220,
  },
  emptyDots: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  emptyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryDust,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.dockClearance,
  },
  headerWrap: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  countChip: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
    backgroundColor: colors.primarySoft,
  },
  countChipText: {
    color: colors.primary,
    fontFamily: fonts.bodyBold,
    fontSize: typeScale.support.size,
  },
  rowCard: {
    flexDirection: 'row',
    padding: spacing.sm,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  rowBody: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  rowCategory: {
    fontSize: typeScale.micro.size,
    lineHeight: typeScale.micro.lineHeight,
    color: colors.primaryMuted,
    fontFamily: fonts.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  rowTitle: {
    marginTop: spacing.xxs,
    color: colors.textHeading,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 22,
  },
  rowMeta: {
    marginTop: spacing.xxs,
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: typeScale.support.size,
    lineHeight: typeScale.support.lineHeight,
  },
  rowPrice: {
    marginTop: spacing.xs,
    color: colors.primary,
    fontFamily: fonts.bodyMedium,
    fontSize: typeScale.body.size,
  },
  rowActions: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperLabel: {
    color: colors.primary,
    fontFamily: fonts.bodyBold,
    fontSize: 18,
  },
  stepperCount: {
    minWidth: 20,
    textAlign: 'center',
    color: colors.textHeading,
    fontFamily: fonts.bodyBold,
  },
  deleteButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.md,
    marginTop: spacing.md,
    ...shadows.card,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
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
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  totalLabel: {
    color: colors.textHeading,
    fontFamily: fonts.serifBold,
    fontSize: 18,
  },
  totalValue: {
    color: colors.primary,
    fontFamily: fonts.serifBold,
    fontSize: 22,
  },
  checkoutButton: {
    marginTop: spacing.md,
  },
  pressed: {
    opacity: 0.75,
  },
});
