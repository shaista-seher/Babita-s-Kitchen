import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => !!(supabaseUrl && supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          description: string;
          price: string;
          categoryId: number | null;
          imageUrl: string | null;
          isVeg: boolean;
          isGlutenFree: boolean;
          isHighProtein: boolean;
          isOrganic: boolean;
          isSpecial: boolean;
          isAvailable: boolean;
          calories: number | null;
          prepTimeMinutes: number | null;
          createdAt: string | null;
        };
        Insert: {
          id?: never;
          name: string;
          description: string;
          price: string;
          categoryId?: number | null;
          imageUrl?: string | null;
          isVeg?: boolean | null;
          isGlutenFree?: boolean | null;
          isHighProtein?: boolean | null;
          isOrganic?: boolean | null;
          isSpecial?: boolean | null;
          isAvailable?: boolean | null;
          calories?: number | null;
          prepTimeMinutes?: number | null;
          createdAt?: string | null;
        };
        Update: {
          id?: never;
          name?: string | null;
          description?: string | null;
          price?: string | null;
          categoryId?: number | null;
          imageUrl?: string | null;
          isVeg?: boolean | null;
          isGlutenFree?: boolean | null;
          isHighProtein?: boolean | null;
          isOrganic?: boolean | null;
          isSpecial?: boolean | null;
          isAvailable?: boolean | null;
          calories?: number | null;
          prepTimeMinutes?: number | null;
          createdAt?: string | null;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
        };
        Insert: {
          id?: never;
          name: string;
          slug: string;
        };
      };
    };
  };
}

export type Product = Database['public']['Tables']['products']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
