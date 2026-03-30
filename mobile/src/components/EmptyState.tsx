import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, typeScale } from '../constants/theme';
import { fonts } from '../theme/fonts';
import { PrimaryButton } from './PrimaryButton';

export function EmptyState({
  icon = 'shopping-bag',
  title,
  message,
  actionLabel,
  onAction,
  actionVariant = 'ghost',
}: {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: 'solid' | 'ghost';
}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Feather name={icon} size={40} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <PrimaryButton title={actionLabel} onPress={onAction} variant={actionVariant} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    zIndex: 1,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.textHeading,
    fontFamily: fonts.serifBold,
    fontSize: 26,
    lineHeight: 32,
    textAlign: 'center',
  },
  message: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: typeScale.body.size,
    lineHeight: typeScale.body.lineHeight,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
