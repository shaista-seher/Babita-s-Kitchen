import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Dish } from '../shared/schema';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius, spacing } from '../theme/spacing';
import { shadow } from '../theme/shadow';
import { PriceBadge } from './PriceBadge';
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
      style={[styles.card, animatedStyle, style]}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: dish.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />
        {showNewRibbon ? (
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>New</Text>
          </View>
        ) : null}
        {dish.isVeg ? (
          <View style={styles.vegWrap}>
            <VegBadge />
          </View>
        ) : null}
        <View style={styles.infoWrap}>
          <Feather name="info" size={14} color={colors.textBody} />
        </View>
        <View style={styles.priceWrap}>
          <PriceBadge price={dish.price} />
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.category}>{dish.category}</Text>
        <Pressable onPress={onPress}>
          <Text style={styles.name} numberOfLines={2}>
            {dish.name}
          </Text>
        </Pressable>
        <Text style={styles.seller}>{seller ?? "Babita's Kitchen"}</Text>
        {dish.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {dish.description}
          </Text>
        ) : null}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: radius.lg,
    backgroundColor: colors.cardBg,
    ...shadow.card,
    overflow: 'hidden',
  },
  imageWrap: {
    height: 170,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e8ddd4',
  },
  vegWrap: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  priceWrap: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  infoWrap: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbon: {
    position: 'absolute',
    top: 14,
    left: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  ribbonText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  body: {
    padding: 14,
  },
  category: {
    color: colors.primary,
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  name: {
    color: colors.textHeading,
    fontFamily: fonts.serifBold,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  seller: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    marginBottom: 6,
  },
  description: {
    color: '#6a6a6a',
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
});
