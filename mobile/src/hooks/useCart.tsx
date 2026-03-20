import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { CartItem, Dish } from '../shared/schema';

const STORAGE_KEY = 'babitas_cart';

type CartContextValue = {
  items: CartItem[];
  addToCart: (dish: Dish, quantity?: number, unitPrice?: number, selectedAddon?: CartItem['selectedAddon']) => void;
  removeFromCart: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value) {
          setItems(JSON.parse(value) as CartItem[]);
        }
      })
      .catch(() => {
        setItems([]);
      });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => undefined);
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const addToCart = (
      dish: Dish,
      quantity = 1,
      unitPrice = dish.price,
      selectedAddon?: CartItem['selectedAddon']
    ) => {
      setItems((current) => {
        const existingIndex = current.findIndex(
          (item) =>
            item.dish.id === dish.id &&
            item.selectedAddon?.id === selectedAddon?.id &&
            item.unitPrice === unitPrice
        );

        if (existingIndex >= 0) {
          const next = [...current];
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + quantity,
          };
          return next;
        }

        return [...current, { dish, quantity, unitPrice, selectedAddon }];
      });
    };

    const removeFromCart = (dishId: string) => {
      setItems((current) => current.filter((item) => item.dish.id !== dishId));
    };

    const updateQuantity = (dishId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(dishId);
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.dish.id === dishId ? { ...item, quantity } : item
        )
      );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    return {
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
