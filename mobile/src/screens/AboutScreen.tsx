import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { colors, spacing } from '../constants/theme';
import { fonts } from '../theme/fonts';
import { shadow } from '../theme/shadow';

const TEAM = [
  { name: 'Babita Sharma', role: 'Founder & Recipe Curator' },
  { name: 'Mobile Team', role: 'Product & App Experience' },
];

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BackgroundBlobs />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
            }}
            style={styles.heroImage}
            contentFit="cover"
          />

          <Text style={styles.title}>Our Story</Text>
          <Text style={styles.body}>
            Babita&apos;s Kitchen was imagined as a warm, elegant food experience grounded in women-led excellence. The goal is simple: honour family recipes, preserve everyday craft, and present them with the polish they deserve.
          </Text>
          <Text style={styles.body}>
            Each menu section celebrates care, precision, and the intuition that lives inside a kitchen run with discipline and love. The app extends that feeling into a calm, polished ordering journey built for mobile.
          </Text>

          <View style={styles.valuesCard}>
            <ValueRow icon="heart" title="Care first" text="Every order is designed to feel personal, not transactional." />
            <View style={styles.divider} />
            <ValueRow icon="star" title="Quality always" text="Ingredients, flavour, and presentation stay at the centre of each dish." />
            <View style={styles.divider} />
            <ValueRow icon="feather" title="Rooted craft" text="Traditional recipes are carried forward with modern consistency." />
          </View>

          <View style={styles.quoteCard}>
            <Text style={styles.quote}>
              "Women-led kitchens don&apos;t just feed families. They preserve memory, rhythm, and excellence."
            </Text>
          </View>

          <View style={styles.teamSection}>
            <Text style={styles.teamTitle}>Team</Text>
            {TEAM.map((member) => (
              <View key={member.name} style={styles.teamRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{member.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function ValueRow({ icon, title, text }: { icon: keyof typeof Feather.glyphMap; title: string; text: string }) {
  return (
    <View style={styles.valueRow}>
      <View style={styles.valueIcon}>
        <Feather name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.valueBody}>
        <Text style={styles.valueTitle}>{title}</Text>
        <Text style={styles.valueText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.dockClearance },
  heroImage: { width: '100%', height: 240 },
  title: {
    marginTop: 24,
    marginHorizontal: 24,
    fontFamily: fonts.serifBold,
    fontSize: 28,
    color: colors.textHeading,
  },
  body: {
    marginTop: 16,
    marginHorizontal: 24,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 26,
    color: colors.textBody,
  },
  valuesCard: {
    marginTop: 24,
    marginHorizontal: 24,
    borderRadius: 20,
    backgroundColor: colors.white,
    padding: 20,
    ...shadow.card,
  },
  valueRow: {
    flexDirection: 'row',
    gap: 14,
  },
  valueIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueBody: { flex: 1 },
  valueTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.textHeading,
  },
  valueText: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: '#6a6a6a',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 16,
  },
  quoteCard: {
    marginTop: 24,
    marginHorizontal: 24,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    padding: 24,
  },
  quote: {
    fontFamily: fonts.serifItalic,
    fontSize: 20,
    lineHeight: 30,
    color: colors.textHeading,
  },
  teamSection: {
    marginTop: 32,
    marginHorizontal: 24,
  },
  teamTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    color: colors.textHeading,
    marginBottom: 16,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontFamily: fonts.serifBold,
    fontSize: 18,
  },
  memberName: {
    marginLeft: 14,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.textHeading,
  },
  memberRole: {
    marginLeft: 14,
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
  },
});
