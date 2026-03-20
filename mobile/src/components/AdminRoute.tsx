import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from './EmptyState';
import { ProtectedRoute } from './ProtectedRoute';

export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();

  return (
    <ProtectedRoute>
      {isAdmin ? (
        children
      ) : (
        <EmptyState
          icon="shield"
          title="Admin access only"
          message="You do not have permission to access the admin dashboard."
        />
      )}
    </ProtectedRoute>
  );
}
