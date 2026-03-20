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
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius, spacing } from '../theme/spacing';
import { shadow } from '../theme/shadow';
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
        <BackgroundBlobs />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 130 }}
          bounces
        >
          <View style={[styles.imageWrap, { height: height * 0.45 }]}>
            <Image source={{ uri: dish.imageUrl }} style={styles.image} contentFit="cover" />
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
              <Feather name="chevron-left" size={22} color={colors.textHeading} />
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
            <View style={styles.divider} />
            <Text style={styles.description}>{dish.description}</Text>

            {dish.addons.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Select Flavour</Text>
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
                <Pressable style={[styles.stepperButton, styles.stepperMinus]} onPress={() => setQuantity((current) => Math.max(1, current - 1))}>
                  <Text style={styles.stepperMinusText}>-</Text>
                </Pressable>
                <Text style={styles.quantityText}>{quantity}</Text>
                <Pressable style={[styles.stepperButton, styles.stepperPlus]} onPress={() => setQuantity((current) => current + 1)}>
                  <Text style={styles.stepperPlusText}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <Text style={styles.totalPrice}>{formatPrice(unitPrice * quantity)}</Text>
          <PrimaryButton
            title="Add to Cart"
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
  safeArea: { flex: 1, backgroundColor: colors.cream },
  loadingSafeArea: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream },
  container: { flex: 1, backgroundColor: colors.cream },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: '100%', backgroundColor: '#e8ddd4' },
  backButton: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  bodyCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -28,
    padding: 28,
    ...shadow.card,
  },
  category: {
    fontSize: 11,
    color: colors.primary,
    fontFamily: fonts.bodyBold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  name: {
    fontFamily: fonts.serifBold,
    fontSize: 30,
    color: colors.textHeading,
    lineHeight: 36,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    marginBottom: 6,
  },
  price: {
    fontFamily: fonts.serifBold,
    fontSize: 28,
    color: colors.primary,
  },
  seller: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 14,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginBottom: 20,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textBody,
    lineHeight: 24,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.textHeading,
    marginBottom: 12,
  },
  addonRow: {
    gap: 8,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperMinus: {
    backgroundColor: colors.primaryLight,
  },
  stepperPlus: {
    backgroundColor: colors.primary,
  },
  stepperMinusText: {
    color: colors.primary,
    fontSize: 22,
    fontFamily: fonts.bodyBold,
  },
  stepperPlusText: {
    color: colors.white,
    fontSize: 22,
    fontFamily: fonts.bodyBold,
  },
  quantityText: {
    width: 48,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: fonts.bodyBold,
    color: colors.textHeading,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalPrice: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.primary,
  },
  bottomButton: {
    flex: 1,
    marginLeft: 16,
  },
});
