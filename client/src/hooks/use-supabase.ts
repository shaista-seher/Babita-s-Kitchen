import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

// Demo products for when Supabase isn't fully set up
const DEMO_PRODUCTS = [
  {
    id: 1,
    name: "Babita's Signature Oatmeal",
    description: "Organic oats topped with fresh berries, chia seeds, and a drizzle of local honey.",
    price: "8.99",
    categoryId: 1,
    ingredients: ["Organic Oats", "Mixed Berries", "Chia Seeds", "Honey", "Almond Milk"],
    calories: 350,
    isOrganic: true,
    isVeg: true,
    isHighProtein: false,
    isGlutenFree: false,
    prepTimeMinutes: 10,
    isSpecial: true,
    isAvailable: true,
    imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500&h=500&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Quinoa Power Bowl",
    description: "Protein-packed quinoa with roasted sweet potatoes, avocado, and tahini dressing.",
    price: "12.50",
    categoryId: 2,
    ingredients: ["Quinoa", "Sweet Potato", "Avocado", "Tahini", "Kale"],
    calories: 420,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: true,
    prepTimeMinutes: 15,
    isSpecial: false,
    isAvailable: true,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Farmhouse Chicken Stew",
    description: "Slow-cooked organic chicken with seasonal root vegetables in a rich broth.",
    price: "15.99",
    categoryId: 3,
    ingredients: ["Organic Chicken", "Carrots", "Potatoes", "Celery", "Herbs"],
    calories: 550,
    isOrganic: true,
    isVeg: false,
    isGlutenFree: true,
    isHighProtein: true,
    prepTimeMinutes: 30,
    isSpecial: true,
    isAvailable: true,
    imageUrl: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=500&h=500&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Garden Fresh Salad",
    description: "Crisp mixed greens with roasted vegetables and lemon vinaigrette.",
    price: "9.99",
    categoryId: 2,
    ingredients: ["Mixed Greens", "Cherry Tomatoes", "Cucumber", "Roasted Chickpeas", "Lemon Vinaigrette"],
    calories: 280,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: false,
    prepTimeMinutes: 10,
    isSpecial: false,
    isAvailable: true,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop",
    createdAt: new Date().toISOString(),
  },
  // Papad and Pickles products
  {
    id: 5,
    name: "Crispy Papad",
    description: "Traditional crispy papad, perfect accompaniment to any meal. Made with love using traditional recipes.",
    price: "3.99",
    categoryId: 4,
    ingredients: ["Urad Dal Flour", "Black Pepper", "Cumin", "Rock Salt"],
    calories: 120,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: false,
    prepTimeMinutes: 5,
    isSpecial: false,
    isAvailable: true,
    imageUrl: "/papad.jpeg",
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Mango Pickle",
    description: "Tangy and spicy raw mango pickle made with premium quality mangoes and aromatic spices.",
    price: "8.99",
    categoryId: 5,
    ingredients: ["Raw Mango", "Red Chili Powder", "Mustard Oil", "Fenugreek", "Fennel"],
    calories: 80,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: false,
    prepTimeMinutes: 5,
    isSpecial: true,
    isAvailable: true,
    imageUrl: "/papad and pickle.jpeg",
    createdAt: new Date().toISOString(),
  },
  {
    id: 7,
    name: "Mixed Papad Platter",
    description: "Assorted papads including plain, masala, and roasted varieties. A perfect snack for gatherings.",
    price: "5.99",
    categoryId: 4,
    ingredients: ["Urad Dal", "Rice Flour", "Various Spices"],
    calories: 200,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: false,
    isHighProtein: false,
    prepTimeMinutes: 5,
    isSpecial: false,
    isAvailable: true,
    imageUrl: "/papad and pickle.1.jpeg",
    createdAt: new Date().toISOString(),
  },
  {
    id: 8,
    name: "Lemon Pickle",
    description: "Zesty lemon pickle with a perfect balance of sour and spicy flavors. Handmade with fresh lemons.",
    price: "7.99",
    categoryId: 5,
    ingredients: ["Fresh Lemons", "Green Chili", "Turmeric", "Salt", "Oil"],
    calories: 60,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: false,
    prepTimeMinutes: 5,
    isSpecial: false,
    isAvailable: true,
    imageUrl: "/papad and pickle.2.jpeg",
    createdAt: new Date().toISOString(),
  },
  {
    id: 9,
    name: "Garlic Pickle",
    description: "Aromatic garlic pickle with bold flavors. Perfect for garlic lovers.",
    price: "9.99",
    categoryId: 5,
    ingredients: ["Garlic", "Red Chili", "Mustard Oil", "Vinegar"],
    calories: 90,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: false,
    prepTimeMinutes: 5,
    isSpecial: true,
    isAvailable: true,
    imageUrl: "/papad and pickle.3.jpeg",
    createdAt: new Date().toISOString(),
  },
];

const DEMO_CATEGORIES = [
  { id: 1, name: "Breakfast", slug: "breakfast", imageUrl: null },
  { id: 2, name: "Healthy Bowls", slug: "healthy-bowls", imageUrl: null },
  { id: 3, name: "Dinner", slug: "dinner", imageUrl: null },
  { id: 4, name: "Papad", slug: "papad", imageUrl: null },
  { id: 5, name: "Pickles", slug: "pickles", imageUrl: null },
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
      if (error) throw error;
      
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
      if (error) throw error;
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

