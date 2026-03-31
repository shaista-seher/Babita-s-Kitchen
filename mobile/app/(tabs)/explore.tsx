import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function ExploreScreen() {
  const categories = [
    { id: 'papad', name: 'Crispy Papad', icon: 'pizza-outline', count: 3 },
    { id: 'pickle', name: 'Homemade Pickles', icon: 'leaf-outline', count: 5 },
    { id: 'juice', name: 'Fresh Juices', icon: 'wine-outline', count: 4 },
    { id: 'chips', name: 'Spicy Chips', icon: 'flame-outline', count: 6 },
  ];

  return (
    <LinearGradient colors={['#F8F4EC', '#EDE4D9']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
            Explore Menu
          </ThemedText>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#8B5E3C" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.categories}>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <Ionicons name={category.icon} size={28} color="#8B5E3C" style={styles.categoryIcon} />
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count} items</Text>
            </TouchableOpacity>
          ))}
        </ThemedView>

        <ThemedView style={styles.featured}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            🔥 Trending Now
          </ThemedText>
          <View style={styles.trendingItems}>
            <TouchableOpacity style={styles.trendingItem}>
              <Text style={styles.trendingText}>Masala Papad 🔥</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.trendingItem}>
              <Text style={styles.trendingText}>Mango Pickle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.trendingItem}>
              <Text style={styles.trendingText}>Pepper Chips</Text>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  filterBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 94, 60, 0.1)',
  },
  categories: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryIcon: {
    marginRight: 16,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D2B1F',
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    color: '#8B5E3C',
    fontWeight: '500',
  },
  featured: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  trendingItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  trendingItem: {
    backgroundColor: 'rgba(226, 114, 91, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(226, 114, 91, 0.3)',
  },
  trendingText: {
    fontSize: 14,
    color: '#E2725B',
    fontWeight: '600',
  },
});

