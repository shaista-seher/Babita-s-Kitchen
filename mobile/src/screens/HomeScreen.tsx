import React, { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { DishCard } from '../components/DishCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionHeader } from '../components/SectionHeader';
import { SkeletonCard } from '../components/SkeletonCard';
import { showSuccessToast } from '../components/ToastNotification';
import { useCart } from '../hooks/useCart';
import { useDishes } from '../hooks/useDishes';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius, spacing } from '../theme/spacing';
import { shadow } from '../theme/shadow';

const CATEGORY_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Pickles: 'food-apple',
  Papad: 'cookie-outline',
  Snacks: 'food-croissant',
  Sweets: 'cup-outline',
  Signature: 'silverware-fork-knife',
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const { addToCart } = useCart();
  const { data: dishes = [], isLoading } = useDishes();

  const featured = useMemo(() => dishes.slice(0, 5), [dishes]);
  const categories = useMemo(
    () => Array.from(new Set(dishes.map((dish) => dish.category))).slice(0, 6),
    [dishes]
  );

  const featuredWidth = width * 0.72;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BackgroundBlobs />
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          bounces
        >
          <View style={styles.heroCard}>
            <View style={styles.eyebrowRow}>
              <View style={styles.dot} />
              <Text style={styles.eyebrow}>Women-led flavour</Text>
            </View>
            <Text style={styles.heroTitle}>Babita&apos;s Kitchen</Text>
            <Text style={styles.heroSubtitle}>
              Signature recipes crafted with the strength and creativity of women-led excellence
            </Text>
            <View style={styles.ctaRow}>
              <PrimaryButton
                title="Browse Menu"
                onPress={() => navigation.navigate('MainTabs', { screen: 'Menu' })}
                style={styles.ctaButton}
              />
              <PrimaryButton
                title="Our Story"
                variant="ghost"
                onPress={() => navigation.navigate('MainTabs', { screen: 'About' })}
                style={styles.ctaButton}
              />
            </View>
          </View>

          <View style={styles.sectionWrap}>
            <SectionHeader
              title="Featured creations"
              subtitle="Freshly curated favourites, styled for a quick browse on mobile."
            />
            {isLoading ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredRow}
              >
                {Array.from({ length: 3 }).map((_, index) => (
                  <View key={index} style={{ width: featuredWidth }}>
                    <SkeletonCard />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <FlatList
                horizontal
                data={featured}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredRow}
                renderItem={({ item, index }) => (
                  <DishCard
                    dish={item}
                    onPress={() => navigation.navigate('DishDetails', { id: item.id })}
                    onAdd={() => {
                      addToCart(item, 1);
                      showSuccessToast('Added to cart', item.name);
                    }}
                    featured
                    showNewRibbon={index < 2}
                    style={{ width: featuredWidth, flex: 0, margin: 0 }}
                  />
                )}
              />
            )}
          </View>

          <View style={styles.sectionWrap}>
            <SectionHeader
              title="Shop by mood"
              subtitle="Jump straight into the category you want and keep the flow quick."
            />
            <View style={styles.categoryGrid}>
              {categories.map((category) => {
                const key = Object.keys(CATEGORY_ICONS).find((label) =>
                  category.toLowerCase().includes(label.toLowerCase())
                );
                const icon = CATEGORY_ICONS[key ?? 'Signature'] ?? 'silverware-fork-knife';

                return (
                  <Pressable
                    key={category}
                    style={styles.categoryCard}
                    onPress={() =>
                      navigation.navigate('MainTabs', { screen: 'Menu', params: { category } })
                    }
                  >
                    <View style={styles.categoryIconRow}>
                      <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
                      <Text style={styles.categoryCardTitle}>{category}</Text>
                    </View>
                    <Text style={styles.categoryCardHint}>Browse handmade favourites</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            style={styles.quoteCard}
            onPress={() => navigation.navigate('MainTabs', { screen: 'About' })}
          >
            <Feather name="heart" size={22} color={colors.primary} />
            <Text style={styles.quoteText}>
              "Every dish carries the warmth, discipline, and creativity of women-led kitchens."
            </Text>
            <Text style={styles.quoteLink}>Read our story</Text>
          </Pressable>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  heroCard: {
    zIndex: 1,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    ...shadow.card,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  eyebrow: {
    color: colors.primary,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: 8,
    color: colors.textHeading,
    fontFamily: fonts.serifBold,
    fontSize: 36,
    lineHeight: 42,
  },
  heroSubtitle: {
    marginTop: 10,
    color: '#6a6a6a',
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: spacing.lg,
  },
  ctaButton: {
    flex: 1,
  },
  sectionWrap: {
    gap: spacing.md,
    zIndex: 1,
  },
  featuredRow: {
    paddingHorizontal: 0,
    gap: 14,
    paddingVertical: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    ...shadow.soft,
  },
  categoryIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  categoryCardTitle: {
    flex: 1,
    color: colors.textHeading,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  categoryCardHint: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  quoteCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: 4,
    zIndex: 1,
  },
  quoteText: {
    marginTop: 12,
    color: colors.textHeading,
    fontFamily: fonts.serifItalic,
    fontSize: 18,
    lineHeight: 28,
  },
  quoteLink: {
    marginTop: 16,
    color: colors.primary,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
