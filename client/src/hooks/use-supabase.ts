import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

// Demo products for when Supabase isn't fully set up
const DEMO_PRODUCTS = [
  // Papad products
  {
    id: 1,
    name: "Crispy Papad",
    description: "Authentic handcrafted papad made with urad dal. Perfectly crispy and delicious.",
    price: "3.99",
    categoryId: 1,
    ingredients: ["Urad Dal", "Black Pepper", "Cumin", "Rock Salt", "Baking Soda"],
    calories: 120,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: false,
    prepTimeMinutes: 5,
    isSpecial: false,
    isAvailable: true,
    imageUrl: "/cripsy papad.jpeg",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Masala Papad",
    description: "Spicy masala papad topped with chopped onions, tomatoes, and green chilies.",
    price: "4.99",
    categoryId: 1,
    ingredients: ["Urad Dal", "Red Chili", "Cumin", "Onion", "Tomato"],
    calories: 150,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: false,
    prepTimeMinutes: 5,
    isSpecial: false,
    isAvailable: true,
    imageUrl: "/masala papad.jpeg",
    createdAt: new Date().toISOString(),
  },
  // Pickles/Achaar products
  {
    id: 3,
    name: "Mango Pickle",
    description: "Tangy and spicy raw mango pickle made with premium quality keri and traditional spices.",
    price: "8.99",
    categoryId: 2,
    ingredients: ["Raw Mango", "Red Chili Powder", "Mustard Oil", "Fenugreek", "Fennel"],
    calories: 80,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: false,
    prepTimeMinutes: 5,
    isSpecial: false,
    isAvailable: true,
    imageUrl: "/mango pickle.jpeg",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Lemon Pickle",
    description: "Zesty lemon pickle with a perfect balance of sour and spicy flavors.",
    price: "7.99",
    categoryId: 2,
    ingredients: ["Fresh Lemons", "Green Chili", "Turmeric", "Salt", "Mustard Oil"],
    calories: 60,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: false,
    prepTimeMinutes: 5,
    isSpecial: false,
    isAvailable: true,
    imageUrl: "/lemon pickle.jpeg",
    createdAt: new Date().toISOString(),
  },
  // Healthy Drinks products
  {
    id: 5,
    name: "Ginger Lemon Juice",
    description: "Refreshing ginger lemon juice, perfect for summers. Natural coolant with healing properties.",
    price: "5.99",
    categoryId: 3,
    ingredients: ["Fresh Ginger", "Lemon", "Sugar", "Water", "Black Salt"],
    calories: 80,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: false,
    prepTimeMinutes: 5,
    isSpecial: false,
    isAvailable: true,
    imageUrl: "/ginger lemon juice.jpeg",
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Green Ginger Juice",
    description: "Fresh green ginger juice with mint and spices. Traditional summer cooler with digestive benefits.",
    price: "4.99",
    categoryId: 3,
    ingredients: ["Green Ginger", "Mint", "Black Salt", "Cumin", "Sugar"],
    calories: 120,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: false,
    prepTimeMinutes: 10,
    isSpecial: false,
    isAvailable: true,
    imageUrl: "/green ginger juice.jpeg",
    createdAt: new Date().toISOString(),
  },
  // Chips products
  {
    id: 7,
    name: "Pepper Chips",
    description: "Crispy and spicy pepper chips, perfect tea-time snack.",
    price: "4.99",
    categoryId: 4,
    ingredients: ["Potato", "Black Pepper", "Salt", "Oil"],
    calories: 180,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: false,
    prepTimeMinutes: 15,
    isSpecial: false,
    isAvailable: true,
    imageUrl: "/pepper chips.jpeg",
    createdAt: new Date().toISOString(),
  },
  {
    id: 8,
    name: "Red Chilli Chips",
    description: "Classic crispy potato chips with red chilli, salted to perfection.",
    price: "3.99",
    categoryId: 4,
    ingredients: ["Potato", "Red Chilli", "Salt", "Oil"],
    calories: 200,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: false,
    prepTimeMinutes: 20,
    isSpecial: false,
    isAvailable: true,
    imageUrl: "/red chilli chips.jpeg",
    createdAt: new Date().toISOString(),
  },
  {
    id: 9,
    name: "Salty Chips",
    description: "Crispy salty chips with a unique flavor.",
    price: "4.49",
    categoryId: 4,
    ingredients: ["Potato", "Salt", "Oil"],
    calories: 160,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: false,
    prepTimeMinutes: 20,
    isSpecial: false,
    isAvailable: true,
    imageUrl: "/salty chips.jpeg",
    createdAt: new Date().toISOString(),
  },
];

const DEMO_CATEGORIES = [
  { id: 1, name: "Papad", slug: "papad", imageUrl: null },
  { id: 2, name: "Pickles/Achaar", slug: "pickles-achaar", imageUrl: null },
  { id: 3, name: "Healthy Drinks", slug: "healthy-drinks", imageUrl: null },
  { id: 4, name: "Chips", slug: "chips", imageUrl: null },
];

export function useProducts(params?: {
  category?: string;
  search?: string;
  isVeg?: boolean;
  isGlutenFree?: boolean;
  isHighProtein?: boolean;
}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        // Return demo products filtered by params
        let filtered = [...DEMO_PRODUCTS];
        
        if (params?.search) {
          const search = params.search.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search) || 
            p.description.toLowerCase().includes(search)
          );
        }
        
        if (params?.category) {
          const cat = DEMO_CATEGORIES.find(c => c.slug === params.category);
          if (cat) {
            filtered = filtered.filter(p => p.categoryId === cat.id);
          }
        }
        
        if (params?.isVeg) filtered = filtered.filter(p => p.isVeg);
        if (params?.isGlutenFree) filtered = filtered.filter(p => p.isGlutenFree);
        if (params?.isHighProtein) filtered = filtered.filter(p => p.isHighProtein);
        
        return filtered;
      }

      let query = supabase!.from("products").select("*").eq("isAvailable", true);

      if (params?.category) {
        query = query.eq("categorySlug", params.category);
      }
      if (params?.isVeg) {
        query = query.eq("isVeg", true);
      }
      if (params?.isGlutenFree) {
        query = query.eq("isGlutenFree", true);
      }
      if (params?.isHighProtein) {
        query = query.eq("isHighProtein", true);
      }

      const { data, error } = await query;
      if (error) {
        console.warn("Supabase error, falling back to demo products:", error.message);
        // Fall back to demo products on error
        let filtered = [...DEMO_PRODUCTS];
        
        if (params?.search) {
          const search = params.search.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search) || 
            p.description.toLowerCase().includes(search)
          );
        }
        
        if (params?.category) {
          const cat = DEMO_CATEGORIES.find(c => c.slug === params.category);
          if (cat) {
            filtered = filtered.filter(p => p.categoryId === cat.id);
          }
        }
        
        if (params?.isVeg) filtered = filtered.filter(p => p.isVeg);
        if (params?.isGlutenFree) filtered = filtered.filter(p => p.isGlutenFree);
        if (params?.isHighProtein) filtered = filtered.filter(p => p.isHighProtein);
        
        return filtered;
      }
      
      // If no products in Supabase, return demo products
      if (!data || data.length === 0) {
        let filtered = [...DEMO_PRODUCTS];
        
        if (params?.search) {
          const search = params.search.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search) || 
            p.description.toLowerCase().includes(search)
          );
        }
        
        if (params?.category) {
          const cat = DEMO_CATEGORIES.find(c => c.slug === params.category);
          if (cat) {
            filtered = filtered.filter(p => p.categoryId === cat.id);
          }
        }
        
        if (params?.isVeg) filtered = filtered.filter(p => p.isVeg);
        if (params?.isGlutenFree) filtered = filtered.filter(p => p.isGlutenFree);
        if (params?.isHighProtein) filtered = filtered.filter(p => p.isHighProtein);
        
        return filtered;
      }
      
      return data;
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return DEMO_PRODUCTS.find(p => p.id === id) || null;
      }

      const { data, error } = await supabase!
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return DEMO_CATEGORIES;
      }

      const { data, error } = await supabase!.from("categories").select("*");
      if (error) {
        console.warn("Supabase error, falling back to demo categories:", error.message);
        return DEMO_CATEGORIES;
      }
      return data;
    },
  });
}

export function useOrders(userId: string) {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      if (!isSupabaseConfigured() || !userId) {
        return [];
      }

      const { data, error } = await supabase!
        .from("orders")
        .select("*, orderItems(*, product:products(*))")
        .eq("userId", userId)
        .order("createdAt", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      userId,
      address,
      timeSlot,
      items
    }: {
      userId: string;
      address: string;
      timeSlot?: string;
      items: { productId: number; quantity: number }[];
    }) => {
      if (!isSupabaseConfigured()) {
        // Demo mode - just return success
        return { id: Math.floor(Math.random() * 1000), success: true };
      }

      // Calculate total
      const totalAmount = items.reduce((sum, item) => {
        const product = DEMO_PRODUCTS.find(p => p.id === item.productId);
        return sum + (product ? Number(product.price) * item.quantity : 0);
      }, 0);

      // Create order
      const { data: order, error: orderError } = await supabase!
        .from("orders")
        .insert({
          userId,
          totalAmount: totalAmount.toFixed(2),
          deliveryAddress: address,
          deliveryTimeSlot: timeSlot || null,
          status: "received",
          paymentStatus: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: DEMO_PRODUCTS.find(p => p.id === item.productId)?.price || "0",
      }));

      const { error: itemsError } = await supabase!
        .from("orderItems")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders", variables.userId] });
    },
  });
}

export function useAddresses(userId: string) {
  return useQuery({
    queryKey: ["addresses", userId],
    queryFn: async () => {
      if (!isSupabaseConfigured() || !userId) {
        return [];
      }

      const { data, error } = await supabase!
        .from("user_addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      userId,
      label,
      address,
      latitude,
      longitude,
      isDefault = false
    }: {
      userId: string;
      label: string;
      address: string;
      latitude?: number;
      longitude?: number;
      isDefault?: boolean;
    }) => {
      if (!isSupabaseConfigured()) {
        return { id: Math.floor(Math.random() * 1000), success: true };
      }

      // If this is default, unset other defaults
      if (isDefault) {
        await supabase!
          .from("user_addresses")
          .update({ is_default: false })
          .eq("user_id", userId);
      }

      const { data, error } = await supabase!
        .from("user_addresses")
        .insert({
          user_id: userId,
          label,
          full_address: address,
          latitude: latitude || null,
          longitude: longitude || null,
          is_default: isDefault,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["addresses", variables.userId] });
    },
  });
}

