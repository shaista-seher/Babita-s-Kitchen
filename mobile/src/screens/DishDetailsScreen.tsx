import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { CategoryPill } from '../components/CategoryPill';
import { PrimaryButton } from '../components/PrimaryButton';
import { VegBadge } from '../components/VegBadge';
import { showSuccessToast } from '../components/ToastNotification';
import { useCart } from '../hooks/useCart';
import { useDish } from '../hooks/useDish';
import { Addon } from '../shared/schema';
import { colors, radius, shadows, spacing, typeScale } from '../constants/theme';
import { fonts } from '../theme/fonts';
import { formatPrice } from '../utils/formatPrice';

export default function DishDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { height } = useWindowDimensions();
  const { addToCart } = useCart();
  const { data: dish, isLoading } = useDish(route.params?.id);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddon, setSelectedAddon] = useState<Addon | undefined>();

  const unitPrice = useMemo(
    () => (dish?.price ?? 0) + (selectedAddon?.extraPrice ?? 0),
    [dish?.price, selectedAddon?.extraPrice]
  );

  if (isLoading || !dish) {
    return (
      <SafeAreaView style={styles.loadingSafeArea}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BackgroundBlobs softened />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={[styles.imageWrap, { height: height * 0.42 }]}>
            <Image source={{ uri: dish.imageUrl }} style={styles.image} contentFit="cover" />
            <Pressable
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              onPress={() => navigation.goBack()}
            >
              <Feather name="chevron-left" size={20} color={colors.textHeading} />
            </Pressable>
          </View>

          <View style={styles.bodyCard}>
            <Text style={styles.category}>{dish.category}</Text>
            <Text style={styles.name}>{dish.name}</Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(unitPrice)}</Text>
              {dish.isVeg ? <VegBadge /> : null}
            </View>

            <Text style={styles.seller}>Babita&apos;s Kitchen</Text>
            <Text style={styles.description}>{dish.description}</Text>

            {dish.addons.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Select flavour</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.addonRow}>
                  {dish.addons.map((addon: Addon) => (
                    <CategoryPill
                      key={addon.id}
                      label={`${addon.name}${addon.extraPrice ? ` +${formatPrice(addon.extraPrice)}` : ''}`}
                      selected={selectedAddon?.id === addon.id}
                      onPress={() => setSelectedAddon(addon)}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Quantity</Text>
              <View style={styles.stepper}>
                <Pressable
                  style={({ pressed }) => [styles.stepperButton, styles.stepperMinus, pressed && styles.pressed]}
                  onPress={() => setQuantity((current) => Math.max(1, current - 1))}
                >
                  <Text style={styles.stepperMinusText}>-</Text>
                </Pressable>
                <Text style={styles.quantityText}>{quantity}</Text>
                <Pressable
                  style={({ pressed }) => [styles.stepperButton, styles.stepperPlus, pressed && styles.pressed]}
                  onPress={() => setQuantity((current) => current + 1)}
                >
                  <Text style={styles.stepperPlusText}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomLabel}>Total</Text>
            <Text style={styles.totalPrice}>{formatPrice(unitPrice * quantity)}</Text>
          </View>
          <PrimaryButton
            title="Add to cart"
            onPress={() => {
              addToCart(dish, quantity, unitPrice, selectedAddon);
              showSuccessToast('Added to cart', dish.name);
              navigation.navigate('MainTabs', { screen: 'Cart' });
            }}
            style={styles.bottomButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  loadingSafeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 132 },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: '100%', backgroundColor: '#E8DDD4' },
  backButton: {
    position: 'absolute',
    top: 20,
    left: spacing.screen,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  bodyCard: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    padding: spacing.lg,
    gap: spacing.xs,
    ...shadows.card,
  },
  category: {
    fontSize: typeScale.label.size,
    lineHeight: typeScale.label.lineHeight,
    color: colors.primaryMuted,
    fontFamily: fonts.bodyBold,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  name: {
    fontFamily: fonts.serifBold,
    fontSize: 32,
    color: colors.textHeading,
    lineHeight: 38,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xxs,
  },
  price: {
    fontFamily: fonts.serifBold,
    fontSize: 28,
    color: colors.primary,
  },
  seller: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: typeScale.support.size,
  },
  description: {
    marginTop: spacing.sm,
    fontFamily: fonts.body,
    fontSize: typeScale.body.size,
    color: colors.textBody,
    lineHeight: typeScale.body.lineHeight,
  },
  section: {
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  sectionLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.textHeading,
  },
  addonRow: {
    gap: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepperButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperMinus: {
    backgroundColor: colors.primarySoft,
  },
  stepperPlus: {
    backgroundColor: colors.primary,
  },
  stepperMinusText: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fonts.bodyBold,
  },
  stepperPlusText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.bodyBold,
  },
  quantityText: {
    width: 44,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: fonts.bodyBold,
    color: colors.textHeading,
  },
  bottomBar: {
    position: 'absolute',
    left: spacing.screen,
    right: spacing.screen,
    bottom: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 24,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.dock,
  },
  bottomLabel: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: typeScale.support.size,
  },
  totalPrice: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.primary,
  },
  bottomButton: {
    flex: 1,
    marginLeft: spacing.md,
  },
  pressed: {
    opacity: 0.75,
  },
});
