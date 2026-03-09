
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithPhone: (phone: string) => Promise<{ error: Error | null }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ error: Error | null; token?: string }>;
  signUp: (firstName: string, lastName: string, phone: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo OTP for testing - in production, use real SMS service
const DEMO_OTP = "123456";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on load
    const storedToken = localStorage.getItem('auth_token');
    const storedPhone = localStorage.getItem('user_phone');
    const storedName = localStorage.getItem('user_name');
    
    if (storedToken && storedPhone) {
      setUser({
        id: 'user-' + Date.now(),
        email: '',
        phone: storedPhone,
        firstName: storedName?.split(' ')[0] || '',
        lastName: storedName?.split(' ').slice(1).join(' ') || '',
      });
    }
    setIsLoading(false);
  }, []);

  const signInWithPhone = async (phone: string) => {
    try {
      // For demo: just simulate sending OTP
      // Store pending phone for verification
      sessionStorage.setItem('pendingPhone', phone);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<{ error: Error | null; token?: string }> => {
    try {
      // Accept demo OTP "123456" for testing
      if (otp === DEMO_OTP) {
        const token = 'auth_' + Date.now();
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_phone', phone);
        
        setUser({
          id: 'user-' + Date.now(),
          email: '',
          phone: phone,
        });
        
        return { error: null, token };
      }
      
      return { error: new Error('Invalid OTP. Use 123456 for demo.') };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (firstName: string, lastName: string, phone: string) => {
    try {
      const token = 'auth_' + Date.now();
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_phone', phone);
      localStorage.setItem('user_name', `${firstName} ${lastName}`.trim());
      
      setUser({
        id: 'user-' + Date.now(),
        email: '',
        phone: phone,
        firstName,
        lastName,
      });
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_phone');
    localStorage.removeItem('user_name');
    sessionStorage.removeItem('pendingPhone');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user || !!localStorage.getItem('auth_token'),
    signInWithPhone,
    verifyOTP,
    signUp,
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

