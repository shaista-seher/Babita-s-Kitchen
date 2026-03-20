import { z } from 'zod';

export const addonSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  itemId: z.union([z.string(), z.number()]).transform(String),
  name: z.string(),
  extraPrice: z.number(),
});

export const dishSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string(),
  description: z.string().optional().default(''),
  price: z.number(),
  category: z.string(),
  imageUrl: z.string().url().or(z.string()),
  isVeg: z.boolean().default(false),
  addons: z.array(addonSchema).default([]),
});

export const deliveryDetailsSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(10),
});

export const orderItemSchema = z.object({
  dish: dishSchema,
  quantity: z.number().int().min(1),
  selectedAddon: addonSchema.optional(),
  unitPrice: z.number(),
});

export const orderSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  status: z.string(),
  paymentMethod: z.string(),
  items: z.array(orderItemSchema),
  deliveryDetails: deliveryDetailsSchema,
  total: z.number(),
  razorpayPaymentId: z.string().optional(),
  createdAt: z.string().optional(),
});

export const cartItemSchema = z.object({
  dish: dishSchema,
  quantity: z.number().int().min(1),
  selectedAddon: addonSchema.optional(),
  unitPrice: z.number(),
});

export const checkoutSchema = deliveryDetailsSchema;

export type Addon = z.infer<typeof addonSchema>;
export type Dish = z.infer<typeof dishSchema>;
export type DeliveryDetails = z.infer<typeof deliveryDetailsSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
