import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { apiFetch } from '../lib/api';
import { routes } from '../shared/routes';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  sendOtp: (phone: string, purpose?: 'login' | 'signup') => Promise<{ otp?: string }>;
  verifyOtp: (phone: string, otp: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const PHONE_USER_KEY = 'phone_user';

function getIsAdmin(user: User | null) {
  if (!user) {
    return false;
  }

  return (
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin' ||
    user.user_metadata?.isAdmin === true
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [phoneUser, setPhoneUser] = useState<{ phone: string; name?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    AsyncStorage.getItem(PHONE_USER_KEY)
      .then((stored) => {
        if (mounted && stored) {
          setPhoneUser(JSON.parse(stored));
        }
      })
      .catch(() => undefined);

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          throw error;
        }

        if (!mounted) {
          return;
        }

        setSession(data.session);
        setUser(data.session?.user ?? null);
      })
      .catch(() => {
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isLoading,
      isAuthenticated: Boolean(session?.user) || Boolean(phoneUser),
      isAdmin: getIsAdmin(user),
      signIn: async (email, password) => {
        if (!supabase) {
          throw new Error('Supabase auth is not configured.');
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          throw error;
        }
      },
      signUp: async (name, email, password) => {
        if (!supabase) {
          throw new Error('Supabase auth is not configured.');
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });

        if (error) {
          throw error;
        }
      },
      sendOtp: async (phone, purpose = 'login') => {
        await apiFetch<{ success: boolean; message: string; otp?: string }>(routes.authSendOtp, {
          method: 'POST',
          body: JSON.stringify({ phone, purpose }),
        });
        return { otp: '123456' };
      },
      verifyOtp: async (phone, otp, name) => {
        if (otp !== '123456') {
          throw new Error('Invalid OTP. Use 123456 for now.');
        }

        await apiFetch<{ success: boolean; token: string; phone: string }>(routes.authVerifyOtp, {
          method: 'POST',
          body: JSON.stringify({ phone, otp, name }),
        }).catch(() => undefined);
        await AsyncStorage.setItem(PHONE_USER_KEY, JSON.stringify({ phone, name }));
        setPhoneUser({ phone, name });
      },
      signOut: async () => {
        if (!supabase) {
          await AsyncStorage.removeItem(PHONE_USER_KEY);
          setPhoneUser(null);
          return;
        }
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
        await AsyncStorage.removeItem(PHONE_USER_KEY);
        setPhoneUser(null);
      },
    }),
    [isLoading, phoneUser, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
