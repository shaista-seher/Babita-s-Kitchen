import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, User as AppUser } from '@/lib/supabaseClient';

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithPhone: (phone: string) => Promise<{ error: Error | null }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ error: Error | null; token?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token first
    const storedToken = localStorage.getItem('auth_token');
    
    if (!isSupabaseConfigured()) {
      // If no Supabase but we have a token, simulate authenticated state
      if (storedToken) {
        const pendingPhone = sessionStorage.getItem('pendingPhone');
        if (pendingPhone) {
          setUser({
            id: 'temp-user',
            email: '',
            phone: pendingPhone,
          } as AppUser);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
      return;
    }

    // Check active session
    supabase!.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUser = (supabaseUser: User): AppUser => {
    const { id, email, created_at } = supabaseUser;
    const userData = supabaseUser.user_metadata || {};
    return {
      id,
      email: email || '',
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      profileImageUrl: userData.avatar_url || '',
      createdAt: created_at,
    };
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase is not configured. Please add Supabase credentials.') };
    }

    try {
      const { error } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName || '',
            last_name: lastName || '',
          },
        },
      });
      return { error: error as Error | null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase is not configured. Please add Supabase credentials.') };
    }

    try {
      const { error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error as Error | null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Send OTP to phone number
  const signInWithPhone = async (phone: string) => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { error: new Error(data.message || 'Failed to send OTP') };
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Verify OTP and sign in
  const verifyOTP = async (phone: string, otp: string): Promise<{ error: Error | null; token?: string }> => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { error: new Error(data.message || 'Invalid OTP') };
      }
      
      // Store the token
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        
        // Update user state
        setUser({
          id: data.userId || 'temp-user',
          email: '',
          phone: phone,
        } as AppUser);
      }
      
      return { error: null, token: data.token };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('pendingPhone');
    sessionStorage.removeItem('signupName');
    
    if (!isSupabaseConfigured()) {
      setUser(null);
      setSession(null);
      return;
    }
    
    await supabase!.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase is not configured. Please add Supabase credentials.') };
    }

    try {
      const { error } = await supabase!.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error: error as Error | null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user || !!localStorage.getItem('auth_token'),
    signUp,
    signIn,
    signInWithPhone,
    verifyOTP,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

