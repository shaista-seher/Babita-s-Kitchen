import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { SectionHeader } from '../components/SectionHeader';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius, spacing } from '../theme/spacing';

const CONTACT_ROWS = [
  {
    icon: 'map-pin' as const,
    label: 'Location',
    value: 'Babita\'s Kitchen, Jaipur, Rajasthan',
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
        <BackgroundBlobs />
        <View style={styles.content}>
          <SectionHeader
            title="Contact us"
            subtitle="Reach us for catering, custom orders, or support with your delivery."
          />
          <View style={styles.card}>
            {CONTACT_ROWS.map((row) => (
              <Pressable key={row.label} style={styles.row} onPress={row.onPress}>
                <View style={styles.iconWrap}>
                  <Feather name={row.icon} size={18} color={colors.primary} />
                </View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowValue}>{row.value}</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.textMuted} />
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
    backgroundColor: colors.cream,
  },
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  card: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.94)',
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139,26,26,0.08)',
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
  rowLabel: {
    color: colors.textMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rowValue: {
    color: colors.textHeading,
    fontFamily: fonts.sansMedium,
    fontSize: 15,
  },
});
