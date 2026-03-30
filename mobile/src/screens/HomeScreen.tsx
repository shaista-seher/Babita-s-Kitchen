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
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { DishCard } from '../components/DishCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { showSuccessToast } from '../components/ToastNotification';
import { useCart } from '../hooks/useCart';
import { useDishes } from '../hooks/useDishes';
import { colors, radius, shadows, spacing, typeScale } from '../constants/theme';
import { fonts } from '../theme/fonts';

const LOGO = require('../../assets/BK_logo.jpeg');

const CATEGORY_META: Record<
  string,
  { icon: keyof typeof Feather.glyphMap; description: string; tint: [string, string] }
> = {
  pickles: {
    icon: 'sun',
    description: 'Sharp, bright, oil-rich jars for rice, rotis, and snack plates.',
    tint: ['#FFF0E4', '#F7DDD4'],
  },
  papad: {
    icon: 'disc',
    description: 'Crisp, roast-ready sides that turn any meal into a spread.',
    tint: ['#FFF7EA', '#F3E0C9'],
  },
  snacks: {
    icon: 'coffee',
    description: 'Tea-time favourites with a homemade finish.',
    tint: ['#F7EFE6', '#EED9CC'],
  },
  sweets: {
    icon: 'heart',
    description: 'Comforting bites for gifting, guests, and slower evenings.',
    tint: ['#FCEFEF', '#F3DDE0'],
  },
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const { addToCart } = useCart();
  const { data: dishes = [], isLoading } = useDishes();

  const featured = useMemo(() => {
    const seen = new Set<string>();

    return dishes
      .filter((dish) => {
        if (seen.has(dish.id)) {
          return false;
        }

        seen.add(dish.id);
        return true;
      })
      .slice(0, 6);
  }, [dishes]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(dishes.map((dish) => dish.category).filter(Boolean)));

    return unique.slice(0, 4).map((category) => {
      const sourceDish = dishes.find((dish) => dish.category === category);
      const key =
        Object.keys(CATEGORY_META).find((entry) => category.toLowerCase().includes(entry)) ?? 'pickles';
      const meta = CATEGORY_META[key];

      return {
        category,
        imageUrl: sourceDish?.imageUrl,
        ...meta,
      };
    });
  }, [dishes]);

  const featuredWidth = Math.min(width * 0.78, 320);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BackgroundBlobs />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={['#FFF8F2', '#F6ECE5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.storyShell}
          >
            <View style={styles.storyCard}>
              <Image source={LOGO} style={styles.storyWatermark} contentFit="cover" />

              <View style={styles.storyHeader}>
                <Image source={LOGO} style={styles.storyLogo} contentFit="cover" />
                <Text style={styles.storyLabel}>Women-led flavour</Text>
              </View>

              <Text style={styles.storyTitle}>Babitas Kitchen</Text>
              <Text style={styles.storyBody}>
                Recipes shaped by patience, memory, and everyday craft. The kitchen stays rooted
                in homemade textures while the experience feels lighter and easier to browse.
              </Text>

              <Pressable
                style={({ pressed }) => [styles.storyButton, pressed && styles.pressed]}
                onPress={() => navigation.navigate('MainTabs', { screen: 'About' })}
              >
                <Text style={styles.storyButtonText}>Our Story</Text>
                <Feather name="arrow-right" size={15} color={colors.primary} />
              </Pressable>
            </View>
          </LinearGradient>

          <View style={styles.sectionBlock}>
            <SectionIntro
              title="Featured creations"
              subtitle="Seasonal jars, crisp papad, and fast-moving favourites worth opening first."
              actionLabel="View all"
              onAction={() => navigation.navigate('MainTabs', { screen: 'Menu' })}
            />

            {isLoading ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator
                contentContainerStyle={styles.featuredRow}
                decelerationRate="fast"
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
                showsHorizontalScrollIndicator
                contentContainerStyle={styles.featuredRow}
                snapToInterval={featuredWidth + spacing.sm}
                snapToAlignment="start"
                decelerationRate="fast"
                disableIntervalMomentum
                ItemSeparatorComponent={() => <View style={{ width: spacing.sm }} />}
                renderItem={({ item, index }) => (
                  <DishCard
                    dish={item}
                    onPress={() => navigation.navigate('DishDetails', { id: item.id })}
                    onAdd={() => {
                      addToCart(item, 1);
                      showSuccessToast('Added to cart', item.name);
                    }}
                    showNewRibbon={index === 0}
                    style={{ width: featuredWidth, flex: 0 }}
                  />
                )}
              />
            )}
          </View>

          <View style={styles.sectionBlock}>
            <SectionIntro
              title="Shop by mood"
              subtitle="Choose the kind of craving you want to solve, then let the menu narrow itself."
            />

            <View style={styles.moodGrid}>
              {categories.map((category) => (
                <Pressable
                  key={category.category}
                  style={({ pressed }) => [styles.moodCard, pressed && styles.pressed]}
                  onPress={() =>
                    navigation.navigate('MainTabs', {
                      screen: 'Menu',
                      params: { category: category.category },
                    })
                  }
                >
                  <LinearGradient
                    colors={category.tint}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.moodTint}
                  />
                  {category.imageUrl ? (
                    <Image source={{ uri: category.imageUrl }} style={styles.moodImage} contentFit="cover" />
                  ) : null}

                  <View style={styles.moodIconWrap}>
                    <Feather name={category.icon} size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.moodTitle}>{category.category}</Text>
                  <Text style={styles.moodDescription}>{category.description}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.quoteCard}>
            <View style={styles.quoteTop}>
              <View style={styles.quoteIconWrap}>
                <Feather name="feather" size={16} color={colors.primary} />
              </View>
              <View style={styles.quoteLine} />
            </View>

            <Text style={styles.quoteText}>
              "Food made by hand carries memory differently. It arrives warmer, slower, and more
              personal."
            </Text>

            <Pressable
              style={({ pressed }) => [styles.quoteLinkWrap, pressed && styles.pressed]}
              onPress={() => navigation.navigate('MainTabs', { screen: 'About' })}
            >
              <Text style={styles.quoteLink}>Read our story</Text>
              <Feather name="arrow-right" size={14} color={colors.primary} />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function SectionIntro({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionCopy}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.sectionAccent} />
        </View>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>

      {actionLabel && onAction ? (
        <Pressable style={({ pressed }) => [styles.viewAllButton, pressed && styles.pressed]} onPress={onAction}>
          <Text style={styles.viewAllText}>{actionLabel}</Text>
          <Feather name="arrow-right" size={14} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
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
    paddingBottom: spacing.dockClearance + spacing.md,
    gap: spacing.lg,
  },
  storyShell: {
    borderRadius: 28,
    padding: 1,
    shadowColor: '#8B4A2A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.09,
    shadowRadius: 20,
    elevation: 4,
  },
  storyCard: {
    borderRadius: 27,
    backgroundColor: '#FFF8F2',
    padding: spacing.lg,
    overflow: 'hidden',
  },
  storyWatermark: {
    position: 'absolute',
    right: -10,
    top: -8,
    width: 138,
    height: 138,
    opacity: 0.06,
    transform: [{ rotate: '-12deg' }],
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  storyLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  storyLabel: {
    color: colors.primary,
    fontFamily: fonts.bodyBold,
    fontSize: typeScale.label.size,
    lineHeight: typeScale.label.lineHeight,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  storyTitle: {
    marginTop: spacing.sm,
    color: '#2B211C',
    fontFamily: fonts.serifBold,
    fontSize: 34,
    lineHeight: 40,
  },
  storyBody: {
    marginTop: spacing.sm,
    maxWidth: '82%',
    color: '#73655D',
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  storyButton: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: 'rgba(123,27,27,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(123,27,27,0.16)',
  },
  storyButtonText: {
    color: colors.primary,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionBlock: {
    gap: spacing.sm,
  },
  sectionHeader: {
    gap: spacing.sm,
  },
  sectionCopy: {
    gap: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.textHeading,
    fontFamily: fonts.serifBold,
    fontSize: 28,
    lineHeight: 34,
  },
  sectionAccent: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(123,27,27,0.20)',
  },
  sectionSubtitle: {
    color: '#83756D',
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    maxWidth: '88%',
  },
  viewAllButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 4,
  },
  viewAllText: {
    color: colors.primary,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  featuredRow: {
    paddingTop: spacing.xs,
    paddingRight: spacing.screen,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  moodCard: {
    width: '47%',
    minHeight: 186,
    borderRadius: 24,
    backgroundColor: colors.surface,
    padding: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(123,27,27,0.06)',
    ...shadows.soft,
  },
  moodTint: {
    ...StyleSheet.absoluteFillObject,
  },
  moodImage: {
    position: 'absolute',
    right: -18,
    bottom: -10,
    width: 118,
    height: 118,
    borderRadius: 59,
    opacity: 0.22,
  },
  moodIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.70)',
    marginBottom: spacing.sm,
  },
  moodTitle: {
    color: colors.textHeading,
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    lineHeight: 22,
  },
  moodDescription: {
    marginTop: spacing.xs,
    color: '#766962',
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    maxWidth: '82%',
  },
  quoteCard: {
    borderRadius: 26,
    padding: spacing.lg,
    backgroundColor: '#F6EAE2',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    ...shadows.soft,
  },
  quoteTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quoteIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(123,27,27,0.10)',
  },
  quoteLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(123,27,27,0.18)',
  },
  quoteText: {
    color: colors.textHeading,
    fontFamily: fonts.serifItalic,
    fontSize: 23,
    lineHeight: 33,
  },
  quoteLinkWrap: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 4,
  },
  quoteLink: {
    color: colors.primary,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
