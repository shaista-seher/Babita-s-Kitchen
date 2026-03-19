// Types from shared/schema.ts - for RN
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  categoryId?: number;
  imageUrl?: string;
  isVeg: boolean;
  isGlutenFree: boolean;
  isHighProtein: boolean;
  isOrganic: boolean;
  isSpecial: boolean;
  isAvailable: boolean;
  calories?: number;
  prepTimeMinutes?: number;
  createdAt?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
}
