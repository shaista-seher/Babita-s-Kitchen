import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius, spacing } from '../theme/spacing';
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
    gap: spacing.md,
    zIndex: 1,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.textHeading,
    fontFamily: fonts.serifBold,
    fontSize: 28,
    textAlign: 'center',
  },
  message: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
