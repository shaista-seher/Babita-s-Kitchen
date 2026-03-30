import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Dish } from '../shared/schema';
import { colors, radius, shadows, spacing, typeScale } from '../constants/theme';
import { fonts } from '../theme/fonts';
import { VegBadge } from './VegBadge';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DishCard({
  dish,
  onPress,
  onAdd,
  style,
  seller,
  showNewRibbon,
}: {
  dish: Dish;
  onPress: () => void;
  onAdd?: () => void;
  style?: StyleProp<ViewStyle>;
  seller?: string;
  featured?: boolean;
  showNewRibbon?: boolean;
}) {
  const scale = useSharedValue(1);
  const cleanDescription = sanitizeCopy(dish.description);
  const cleanName = sanitizeCopy(dish.name) || 'Handmade special';
  const cleanCategory = sanitizeCopy(dish.category) || 'Signature';
  const { rating, eta } = getDishMeta(dish);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.985, { stiffness: 240, damping: 18 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { stiffness: 220, damping: 18 });
      }}
      onPress={onPress}
      style={[styles.card, animatedStyle, style]}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: dish.imageUrl }} style={styles.image} contentFit="cover" />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(31,20,17,0.62)']}
          style={styles.imageOverlay}
        />

        {showNewRibbon ? (
          <LinearGradient
            colors={['#C75C2A', '#7A2E2E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ribbon}
          >
            <Text style={styles.ribbonText}>New</Text>
          </LinearGradient>
        ) : null}

        {dish.isVeg ? (
          <View style={styles.vegWrap}>
            <VegBadge />
          </View>
        ) : null}

        <View style={styles.metaPills}>
          <View style={styles.metaPill}>
            <Feather name="star" size={12} color="#F7C76B" />
            <Text style={styles.metaText}>{rating}</Text>
          </View>
          <View style={styles.metaPill}>
            <Feather name="clock" size={12} color={colors.white} />
            <Text style={styles.metaText}>{eta} min</Text>
          </View>
        </View>

        <View style={styles.priceWrap}>
          <Text style={styles.priceText}>Rs {dish.price}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.category}>{cleanCategory}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {cleanName}
        </Text>
        <Text style={styles.seller}>{seller ?? "Babita's Kitchen"}</Text>
        {cleanDescription ? (
          <Text style={styles.description} numberOfLines={2}>
            {cleanDescription}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerLabel}>Handmade batch</Text>
            <Text style={styles.footerSubcopy}>Prepared fresh for slower, better snacking.</Text>
          </View>

          {onAdd ? (
            <Pressable onPress={onAdd} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
              <Feather name="plus" size={17} color={colors.white} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </AnimatedPressable>
  );
}

function sanitizeCopy(value?: string) {
  const cleaned = value?.replace(/\s+/g, ' ').trim() ?? '';
  if (!cleaned) {
    return '';
  }

  if (/^wods$/i.test(cleaned) || cleaned.length < 3) {
    return '';
  }

  return cleaned;
}

function getDishMeta(dish: Dish) {
  const source = `${dish.id}${dish.name}`;
  const hash = source.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const rating = (4.5 + (hash % 5) * 0.1).toFixed(1);
  const eta = 22 + (hash % 4) * 4;

  return { rating, eta };
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 26,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    shadowColor: '#8B4A2A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 26,
    elevation: 8,
  },
  imageWrap: {
    height: 242,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E8DDD4',
    transform: [{ scale: 1.05 }],
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  ribbon: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: radius.full,
    shadowColor: '#7A2E2E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  ribbonText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  vegWrap: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  metaPills: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: radius.full,
    backgroundColor: 'rgba(29,21,19,0.62)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  metaText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
  },
  priceWrap: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: '#FFF8F2',
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    shadowColor: '#7A2E2E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  priceText: {
    color: colors.primary,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: 6,
    minHeight: 176,
  },
  category: {
    color: colors.primaryMuted,
    fontFamily: fonts.bodyBold,
    fontSize: typeScale.micro.size,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  name: {
    color: colors.textHeading,
    fontFamily: fonts.bodyBold,
    fontSize: 19,
    lineHeight: 24,
  },
  seller: {
    color: '#8E7E76',
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
  description: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: typeScale.support.size,
    lineHeight: 20,
  },
  footer: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  footerLeft: {
    flex: 1,
    gap: 2,
  },
  footerLabel: {
    color: colors.textHeading,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  footerSubcopy: {
    color: '#93857D',
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7A2E2E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  pressed: {
    opacity: 0.82,
  },
});
