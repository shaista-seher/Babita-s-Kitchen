import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { CategoryPill } from '../components/CategoryPill';
import { DishCard } from '../components/DishCard';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard } from '../components/SkeletonCard';
import { showSuccessToast } from '../components/ToastNotification';
import { useCart } from '../hooks/useCart';
import { useDishes } from '../hooks/useDishes';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius, spacing } from '../theme/spacing';
import { shadow } from '../theme/shadow';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<any>);

export default function MenuScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const { addToCart } = useCart();
  const { data: dishes = [], isLoading, refetch, isRefetching } = useDishes();
  const scrollY = useSharedValue(0);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category ?? 'All');

  useEffect(() => {
    if (route.params?.category) {
      setSelectedCategory(route.params.category);
    }
  }, [route.params?.category]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(dishes.map((dish) => dish.category)))],
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

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scrollY.value, [0, 120], [1, 0.97]) }],
    opacity: interpolate(scrollY.value, [0, 160], [1, 0.9]),
  }));

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const cardWidth = Math.max((width - 24) / 2 - 10, 150);

  const header = (
    <View style={styles.headerWrap}>
      <Animated.View style={[styles.heroCard, heroStyle]}>
        <Text style={styles.heroTitle}>Our Feminine Creations</Text>
        <Text style={styles.heroSubtitle}>
          Signature recipes crafted with the strength and creativity of women-led excellence
        </Text>
      </Animated.View>

      <View style={styles.searchWrap}>
        <Feather name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search dishes, pickles, papad..."
          placeholderTextColor="#c0b8b0"
          style={styles.searchInput}
        />
        {search.length > 0 ? (
          <Feather name="x" size={18} color={colors.textMuted} onPress={() => setSearch('')} />
        ) : null}
      </View>

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
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BackgroundBlobs />
        {isLoading ? (
          <ScrollView contentContainerStyle={styles.loadingContent} bounces>
            {header}
            <View style={styles.loadingGrid}>
              {Array.from({ length: 4 }).map((_, index) => (
                <View key={index} style={[styles.loadingCardWrap, { width: cardWidth }]}>
                  <SkeletonCard />
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <AnimatedFlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            numColumns={2}
            onScroll={onScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrap}
            ListHeaderComponent={header}
            renderItem={({ item }) => (
              <DishCard
                dish={item}
                onPress={() => navigation.navigate('DishDetails', { id: item.id })}
                onAdd={() => {
                  addToCart(item, 1);
                  showSuccessToast('Added to cart', item.name);
                }}
                style={{ width: cardWidth, flex: 0, margin: 0 }}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
            ListEmptyComponent={
              <EmptyState
                icon="search"
                title="Nothing found"
                message="Try a different search or browse all categories."
                actionLabel="Clear Search"
                onAction={() => {
                  setSearch('');
                  setSelectedCategory('All');
                }}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.cream },
  container: { flex: 1, backgroundColor: colors.cream },
  headerWrap: {
    paddingTop: 6,
    paddingBottom: 14,
    gap: 14,
  },
  heroCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    marginHorizontal: 16,
    padding: 28,
    ...shadow.card,
  },
  heroTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 32,
    color: colors.textHeading,
    lineHeight: 38,
  },
  heroSubtitle: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
  },
  searchWrap: {
    backgroundColor: colors.white,
    borderRadius: radius.full,
    marginHorizontal: 16,
    paddingHorizontal: 18,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.soft,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: colors.textHeading,
    fontFamily: fonts.body,
    fontSize: 15,
  },
  pillsRow: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 10,
  },
  listContent: {
    padding: 10,
    paddingBottom: spacing.xxl,
  },
  columnWrap: {
    gap: 4,
    justifyContent: 'space-between',
  },
  loadingContent: {
    paddingBottom: spacing.xxl,
  },
  loadingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    paddingHorizontal: 10,
  },
  loadingCardWrap: {
    marginBottom: 4,
  },
});
