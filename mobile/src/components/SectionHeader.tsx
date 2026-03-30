import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typeScale } from '../constants/theme';
import { fonts } from '../theme/fonts';

export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  title: {
    color: colors.textHeading,
    fontFamily: fonts.bodyBold,
    fontSize: typeScale.heading.size,
    lineHeight: typeScale.heading.lineHeight,
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: typeScale.support.size,
    lineHeight: typeScale.support.lineHeight,
  },
});
