import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { CategoryPill } from '../components/CategoryPill';
import { DishCard } from '../components/DishCard';
import { EmptyState } from '../components/EmptyState';
import { SectionHeader } from '../components/SectionHeader';
import { SkeletonCard } from '../components/SkeletonCard';
import { showSuccessToast } from '../components/ToastNotification';
import { useCart } from '../hooks/useCart';
import { useDishes } from '../hooks/useDishes';
import { colors, radius, shadows, spacing, typeScale } from '../constants/theme';
import { fonts } from '../theme/fonts';

export default function MenuScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const { addToCart } = useCart();
  const { data: dishes = [], isLoading, refetch, isRefetching } = useDishes();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category ?? 'All');

  useEffect(() => {
    if (route.params?.category) {
      setSelectedCategory(route.params.category);
    }
  }, [route.params?.category]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(dishes.map((dish) => dish.category).filter(Boolean)))],
    [dishes]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return dishes.filter((dish) => {
      const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
      const haystack = `${dish.name} ${dish.description}`.toLowerCase();
      return matchesCategory && (term.length === 0 || haystack.includes(term));
    });
  }, [dishes, search, selectedCategory]);

  const cardWidth = Math.max((width - spacing.screen * 2 - spacing.sm) / 2, 156);

  const header = (
    <View style={styles.headerWrap}>
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>From the pantry</Text>
        <Text style={styles.heroTitle}>Pickles, papad, and handmade comfort</Text>
        <Text style={styles.heroSubtitle}>
          Browse slow-crafted favourites and filter by what you feel like taking home today.
        </Text>
      </View>

      <View style={styles.searchWrap}>
        <Feather name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search pickles, papad, flavours..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
        {search.length > 0 ? (
          <Feather name="x" size={18} color={colors.textMuted} onPress={() => setSearch('')} />
        ) : null}
      </View>

      <SectionHeader
        title="Browse the menu"
        subtitle="Category labels stay quiet so the dishes and photography carry the mood."
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
      >
        {categories.map((category) => (
          <CategoryPill
            key={category}
            label={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
          />
        ))}
      </ScrollView>

      <DecorativeDivider />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BackgroundBlobs />
        {isLoading ? (
          <ScrollView contentContainerStyle={styles.loadingContent} showsVerticalScrollIndicator={false}>
            {header}
            <View style={styles.loadingGrid}>
              {Array.from({ length: 4 }).map((_, index) => (
                <View key={index} style={{ width: cardWidth }}>
                  <SkeletonCard />
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            numColumns={2}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrap}
            ListHeaderComponent={header}
            renderItem={({ item }) => (
              <View style={{ width: cardWidth }}>
                <DishCard
                  dish={item}
                  onPress={() => navigation.navigate('DishDetails', { id: item.id })}
                  onAdd={() => {
                    addToCart(item, 1);
                    showSuccessToast('Added to cart', item.name);
                  }}
                />
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
            ListEmptyComponent={
              <EmptyState
                icon="search"
                title="Nothing found"
                message="Try a different search, or return to all categories for the full kitchen spread."
                actionLabel="Clear search"
                onAction={() => {
                  setSearch('');
                  setSelectedCategory('All');
                }}
                actionVariant="solid"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function DecorativeDivider() {
  return (
    <View style={styles.decorativeDots}>
      <View style={styles.decorativeDot} />
      <View style={styles.decorativeDot} />
      <View style={styles.decorativeDot} />
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
  headerWrap: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    ...shadows.card,
  },
  heroEyebrow: {
    color: colors.primaryMuted,
    fontFamily: fonts.bodyBold,
    fontSize: typeScale.label.size,
    lineHeight: typeScale.label.lineHeight,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: spacing.xs,
    color: colors.textHeading,
    fontFamily: fonts.serifBold,
    fontSize: 32,
    lineHeight: 38,
  },
  heroSubtitle: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: typeScale.body.size,
    lineHeight: typeScale.body.lineHeight,
  },
  searchWrap: {
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.soft,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.xs,
    color: colors.textHeading,
    fontFamily: fonts.body,
    fontSize: typeScale.body.size,
  },
  pillsRow: {
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.dockClearance,
  },
  columnWrap: {
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  loadingContent: {
    paddingBottom: spacing.dockClearance,
  },
  loadingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.screen,
  },
  decorativeDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginVertical: spacing.lg,
  },
  decorativeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryDust,
  },
});
