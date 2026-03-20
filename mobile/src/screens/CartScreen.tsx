import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionHeader } from '../components/SectionHeader';
import { useCart } from '../hooks/useCart';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius, spacing } from '../theme/spacing';
import { shadow } from '../theme/shadow';
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
          <BackgroundBlobs />
          <EmptyState
            icon="shopping-cart"
            title="Your cart is empty"
            message="Add something handmade and comforting to begin your order."
            actionLabel="Browse Menu"
            actionVariant="ghost"
            onAction={() => navigation.navigate('MainTabs', { screen: 'Menu' })}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BackgroundBlobs />
        <FlatList
          data={items}
          keyExtractor={(item, index) => `${item.dish.id}-${item.selectedAddon?.id ?? 'base'}-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <View style={styles.headerWrap}>
              <SectionHeader title="Your Cart" subtitle="Review quantities before you place the order." />
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
                <Text style={styles.rowTitle}>{item.dish.name}</Text>
                <Text style={styles.rowMeta}>
                  {item.selectedAddon ? `Flavour: ${item.selectedAddon.name}` : 'Handmade kitchen special'}
                </Text>
                <Text style={styles.rowPrice}>{formatPrice(item.unitPrice)}</Text>
                <View style={styles.rowActions}>
                  <View style={styles.stepper}>
                    <Pressable style={styles.stepperButton} onPress={() => updateQuantity(item.dish.id, item.quantity - 1)}>
                      <Text style={styles.stepperLabel}>-</Text>
                    </Pressable>
                    <Text style={styles.stepperCount}>{item.quantity}</Text>
                    <Pressable style={styles.stepperButton} onPress={() => updateQuantity(item.dish.id, item.quantity + 1)}>
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
                    style={styles.deleteButton}
                  >
                    <Feather name="trash-2" size={18} color="#c0b8b0" />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={
            <>
              <View style={styles.summaryCard}>
                <SummaryRow label="Subtotal" value={formatPrice(totalPrice)} />
                <SummaryRow label="GST (5%)" value={formatPrice(gst)} />
                <SummaryRow label="Delivery" value="Free" />
                <View style={styles.summaryDivider} />
                <SummaryRow label="Total" value={formatPrice(total)} emphasis />
              </View>
              <PrimaryButton title="Proceed to Checkout" onPress={() => navigation.navigate('Checkout')} style={styles.checkoutButton} />
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
  safeArea: { flex: 1, backgroundColor: colors.cream },
  container: { flex: 1, backgroundColor: colors.cream },
  content: {
    paddingHorizontal: 16,
    paddingBottom: spacing.xxl,
  },
  headerWrap: {
    marginBottom: spacing.md,
  },
  countChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary,
  },
  countChipText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  rowCard: {
    flexDirection: 'row',
    padding: 14,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: colors.white,
    ...shadow.soft,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#e8ddd4',
  },
  rowBody: {
    flex: 1,
    marginLeft: 14,
  },
  rowCategory: {
    fontSize: 10,
    color: colors.primary,
    fontFamily: fonts.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  rowTitle: {
    marginTop: 2,
    color: colors.textHeading,
    fontFamily: fonts.serifBold,
    fontSize: 15,
  },
  rowMeta: {
    marginTop: 4,
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  rowPrice: {
    marginTop: 6,
    color: colors.primary,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },
  rowActions: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperLabel: {
    color: colors.primary,
    fontFamily: fonts.bodyBold,
    fontSize: 20,
  },
  stepperCount: {
    minWidth: 20,
    textAlign: 'center',
    color: colors.textHeading,
    fontFamily: fonts.bodyBold,
  },
  deleteButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 6,
    ...shadow.card,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 14,
  },
  summaryValue: {
    color: colors.textHeading,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },
  summaryDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderStyle: 'dashed',
    marginVertical: 6,
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
    marginTop: 16,
    marginBottom: 24,
  },
});
