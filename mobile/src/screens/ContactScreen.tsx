import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { SectionHeader } from '../components/SectionHeader';
import { colors, radius, shadows, spacing, typeScale } from '../constants/theme';
import { fonts } from '../theme/fonts';

const CONTACT_ROWS = [
  {
    icon: 'map-pin' as const,
    label: 'Location',
    value: "Babita's Kitchen, Jaipur, Rajasthan",
    onPress: () => undefined,
  },
  {
    icon: 'phone' as const,
    label: 'Phone',
    value: '+91 98765 43210',
    onPress: () => Linking.openURL('tel:+919876543210'),
  },
  {
    icon: 'mail' as const,
    label: 'Email',
    value: 'hello@babitaskitchen.com',
    onPress: () => Linking.openURL('mailto:hello@babitaskitchen.com'),
  },
];

export default function ContactScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BackgroundBlobs softened />
        <View style={styles.content}>
          <SectionHeader
            title="Contact us"
            subtitle="Reach us for catering, custom orders, or support with your delivery."
          />
          <View style={styles.card}>
            {CONTACT_ROWS.map((row, index) => (
              <Pressable
                key={row.label}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                onPress={row.onPress}
              >
                <View style={styles.iconWrap}>
                  <Feather name={row.icon} size={18} color={colors.primary} />
                </View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowValue}>{row.value}</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.textMuted} />
                {index < CONTACT_ROWS.length - 1 ? <View style={styles.rowDivider} /> : null}
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  card: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.96)',
    padding: spacing.sm,
    ...shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    position: 'relative',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  rowBody: {
    flex: 1,
    gap: spacing.xxs,
  },
  rowLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: typeScale.micro.size,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  rowValue: {
    color: colors.textHeading,
    fontFamily: fonts.bodyMedium,
    fontSize: typeScale.body.size,
  },
  rowDivider: {
    position: 'absolute',
    bottom: 0,
    left: 54,
    right: 0,
    height: 1,
    backgroundColor: colors.border,
  },
  pressed: {
    opacity: 0.75,
  },
});
