import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { spacing } from '../theme/spacing';

const CONTENT: Record<'terms' | 'privacy' | 'refund', { title: string; sections: string[] }> = {
  terms: {
    title: 'Terms & Conditions',
    sections: [
      'By placing an order with Babita’s Kitchen, you agree to provide accurate delivery details and contact information.',
      'Orders are prepared fresh, so estimated delivery windows may vary slightly based on location, volume, and kitchen operations.',
      'We reserve the right to cancel fraudulent or duplicate orders and issue an appropriate refund where required.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      'We collect contact and delivery information only to process your orders and improve your experience.',
      'Payment details are handled by trusted third-party processors and are not stored directly by the app.',
      'We do not sell personal data. Operational data may be used internally for support, analytics, and service improvement.',
    ],
  },
  refund: {
    title: 'Refund Policy',
    sections: [
      'If an order cannot be fulfilled, a refund or credit will be initiated based on the payment method used.',
      'Quality-related issues should be reported promptly with order details so our team can review and resolve them.',
      'Refund timelines depend on the payment provider and banking partner involved in the transaction.',
    ],
  },
};

export default function PolicyScreen() {
  const route = useRoute<any>();
  const type = (route.params?.type ?? 'terms') as 'terms' | 'privacy' | 'refund';
  const policy = CONTENT[type];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BackgroundBlobs />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{policy.title}</Text>
          {policy.sections.map((section) => (
            <Text key={section} style={styles.body}>
              {section}
            </Text>
          ))}
        </ScrollView>
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
    gap: spacing.md,
  },
  title: {
    color: colors.textHeading,
    fontFamily: fonts.serif,
    fontSize: 34,
  },
  body: {
    color: colors.textBody,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    lineHeight: 26,
  },
});
