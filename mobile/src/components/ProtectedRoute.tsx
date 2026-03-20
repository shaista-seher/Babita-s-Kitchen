import React, { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from './EmptyState';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Checking your session...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <EmptyState
        icon="lock"
        title="Sign in required"
        message="Please sign in to continue to this screen."
      />
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.cream,
  },
  loadingText: {
    color: colors.textBody,
    fontFamily: fonts.sansRegular,
  },
});
