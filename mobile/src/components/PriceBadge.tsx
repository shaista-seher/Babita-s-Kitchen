import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing } from '../constants/theme';
import { fonts } from '../theme/fonts';
import { formatPrice } from '../utils/formatPrice';

export function PriceBadge({ price }: { price: number }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{formatPrice(price)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
    ...shadows.soft,
  },
  text: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
});
