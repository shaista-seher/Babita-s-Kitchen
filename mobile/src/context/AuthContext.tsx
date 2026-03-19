import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendOTP, verifyOTP } from '../lib/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithPhone: (phone: string) => Promise<{ error: string | null }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const phone = await AsyncStorage.getItem('user_phone');
      if (token && phone) {
        setUser({
          id: 'user-' + Date.now(),
          phone,
          firstName: 'User',
          lastName: '',
        });
      }
    } catch (error) {
      console.error('Auth load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      const result = await sendOTP(phone);
      if (result.success) {
        console.log('OTP sent (check server console):', result.otp);
        return { error: null };
      }
      return { error: result.message || 'Failed to send OTP' };
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      const result = await verifyOTP(phone, otp);
      if (result.success && result.token) {
        await AsyncStorage.setItem('auth_token', result.token);
        await AsyncStorage.setItem('user_phone', phone);
        setUser({
          id: 'user-' + Date.now(),
          phone,
          firstName: 'User',
          lastName: '',
        });
        return { error: null };
      }
      return { error: result.message || 'Invalid OTP' };
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(['auth_token', 'user_phone']);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithPhone,
    verifyOTP,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

