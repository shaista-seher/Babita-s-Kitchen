import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius } from '../theme/spacing';
import { shadow } from '../theme/shadow';
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
    paddingHorizontal: 14,
    paddingVertical: 6,
    ...shadow.card,
  },
  text: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
});
