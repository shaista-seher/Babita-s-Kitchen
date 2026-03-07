import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  ingredients: text("ingredients").array(),
  calories: integer("calories"),
  isOrganic: boolean("is_organic").default(false),
  isVeg: boolean("is_veg").default(true),
  isGlutenFree: boolean("is_gluten_free").default(false),
  isHighProtein: boolean("is_high_protein").default(false),
  prepTimeMinutes: integer("prep_time_minutes"),
  imageUrl: text("image_url"),
  isSpecial: boolean("is_special").default(false),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // from auth users table
  totalAmount: numeric("total_amount").notNull(),
  status: text("status", { enum: ['received', 'preparing', 'out_for_delivery', 'delivered'] }).default('received'),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryTimeSlot: text("delivery_time_slot"),
  paymentStatus: text("payment_status", { enum: ['pending', 'paid', 'failed'] }).default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price").notNull(),
});

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  label: text("label").notNull(), // e.g., Home, Work
  address: text("address").notNull(),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// New table for user addresses with location data
export const userAddresses = pgTable("user_addresses", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  label: text("label").notNull(), // e.g., Home, Work
  fullAddress: text("full_address").notNull(),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});


// === RELATIONS ===

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
}));

export const orderRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));


// === BASE SCHEMAS ===

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, status: true, paymentStatus: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertAddressSchema = createInsertSchema(addresses).omit({ id: true });
export const insertUserAddressSchema = createInsertSchema(userAddresses).omit({ id: true, createdAt: true });


// === EXPLICIT API CONTRACT TYPES ===

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Address = typeof addresses.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type UserAddress = typeof userAddresses.$inferSelect;
export type InsertUserAddress = z.infer<typeof insertUserAddressSchema>;


// Requests
export type CreateOrderRequest = {
  address: string;
  timeSlot?: string;
  items: { productId: number; quantity: number }[];
};

export type AddAddressRequest = InsertAddress;

// Responses
export type ProductResponse = Product & { category?: Category };
export type OrderResponse = Order & { items: (OrderItem & { product: Product })[] };

export interface ProductsQueryParams {
  category?: string;
  search?: string;
  isVeg?: boolean;
  isGlutenFree?: boolean;
  isHighProtein?: boolean;
  isSpecial?: boolean;
}
