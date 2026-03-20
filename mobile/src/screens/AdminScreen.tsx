import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { AdminRoute } from '../components/AdminRoute';
import { showErrorToast, showSuccessToast } from '../components/ToastNotification';
import { useOrders } from '../hooks/useOrder';
import { apiFetch } from '../lib/api';
import { routes } from '../shared/routes';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius, spacing } from '../theme/spacing';
import { formatDate } from '../utils/formatDate';
import { formatPrice } from '../utils/formatPrice';

const STATUS_OPTIONS = ['pending', 'confirmed', 'being_prepared', 'out_for_delivery', 'delivered'];

export default function AdminScreen() {
  return (
    <AdminRoute>
      <AdminContent />
    </AdminRoute>
  );
}

function AdminContent() {
  const { data: orders = [], isLoading, refetch, isRefetching } = useOrders();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      await apiFetch(routes.orderStatus, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }, { id });
      showSuccessToast('Order updated', `Status set to ${status}`);
      refetch();
    } catch (error) {
      showErrorToast('Update failed', (error as Error).message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BackgroundBlobs />
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item: any) => String(item.id)}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
            }
            contentContainerStyle={styles.content}
            renderItem={({ item }: { item: any }) => {
              const expanded = expandedId === String(item.id);
              return (
                <Pressable
                  style={styles.orderCard}
                  onPress={() => setExpandedId(expanded ? null : String(item.id))}
                >
                  <View style={styles.rowBetween}>
                    <Text style={styles.orderId}>Order #{item.id}</Text>
                    <Text style={styles.orderDate}>{formatDate(item.createdAt ?? new Date().toISOString())}</Text>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.badge}>{item.status ?? 'pending'}</Text>
                    <Text style={styles.orderTotal}>{formatPrice(Number(item.total ?? item.totalAmount ?? 0))}</Text>
                  </View>
                  <Text style={styles.meta}>Payment: {item.paymentMethod ?? item.paymentStatus ?? 'pending'}</Text>

                  {expanded ? (
                    <View style={styles.expandedSection}>
                      {STATUS_OPTIONS.map((status) => (
                        <Pressable
                          key={status}
                          style={styles.statusChip}
                          onPress={() => handleStatusChange(String(item.id), status)}
                          disabled={updatingId === String(item.id)}
                        >
                          <Text style={styles.statusChipText}>{status}</Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </Pressable>
              );
            }}
          />
        )}
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  orderCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.94)',
    padding: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    color: colors.textHeading,
    fontFamily: fonts.sansBold,
    fontSize: 15,
  },
  orderDate: {
    color: colors.textMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },
  badge: {
    color: colors.primary,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    textTransform: 'capitalize',
  },
  orderTotal: {
    color: colors.textHeading,
    fontFamily: fonts.sansBold,
    fontSize: 14,
  },
  meta: {
    color: colors.textMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
  },
  expandedSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  statusChip: {
    borderRadius: radius.full,
    backgroundColor: 'rgba(139,26,26,0.08)',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  statusChipText: {
    color: colors.primary,
    fontFamily: fonts.sansBold,
    fontSize: 12,
  },
});
