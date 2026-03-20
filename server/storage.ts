import { eq } from "drizzle-orm";
import { db, hasDatabase } from "./db";
import {
  products,
  categories,
  orders,
  orderItems,
  addresses,
  type Product,
  type Category,
  type Order,
  type OrderItem,
  type Address,
  type InsertProduct,
  type InsertCategory,
  type InsertOrder,
  type InsertOrderItem,
  type InsertAddress,
  type CreateOrderRequest,
  type OrderResponse,
  type ProductResponse,
  type ProductsQueryParams,
} from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(params?: ProductsQueryParams): Promise<ProductResponse[]>;
  getProduct(id: number): Promise<ProductResponse | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Orders
  getOrders(userId: string): Promise<OrderResponse[]>;
  getOrder(id: number): Promise<OrderResponse | undefined>;
  createOrder(userId: string, orderData: CreateOrderRequest): Promise<Order>;

  // Addresses
  getAddresses(userId: string): Promise<Address[]>;
  createAddress(userId: string, address: InsertAddress): Promise<Address>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(params?: ProductsQueryParams): Promise<ProductResponse[]> {
    let query = db.select({
      product: products,
      category: categories,
    })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id));

    // For a real implementation we would apply where clauses based on params here,
    // but Drizzle dynamic queries can be complex. Let's filter in memory for this MVP
    // or build the where conditions if needed.
    const results = await query;
    let filtered = results.map(row => ({
      ...row.product,
      category: row.category || undefined
    }));

    if (params) {
      if (params.category) {
        filtered = filtered.filter(p => p.category?.slug === params.category);
      }
      if (params.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search));
      }
      if (params.isVeg !== undefined) {
        const isVeg = String(params.isVeg) === 'true';
        filtered = filtered.filter(p => p.isVeg === isVeg);
      }
      if (params.isGlutenFree !== undefined) {
        const isGlutenFree = String(params.isGlutenFree) === 'true';
        filtered = filtered.filter(p => p.isGlutenFree === isGlutenFree);
      }
      if (params.isHighProtein !== undefined) {
        const isHighProtein = String(params.isHighProtein) === 'true';
        filtered = filtered.filter(p => p.isHighProtein === isHighProtein);
      }
      if (params.isSpecial !== undefined) {
         const isSpecial = String(params.isSpecial) === 'true';
         filtered = filtered.filter(p => p.isSpecial === isSpecial);
      }
    }

    return filtered;
  }

  async getProduct(id: number): Promise<ProductResponse | undefined> {
    const results = await db.select({
      product: products,
      category: categories,
    })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id));

    if (results.length === 0) return undefined;
    
    return {
      ...results[0].product,
      category: results[0].category || undefined
    };
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async getOrders(userId: string): Promise<OrderResponse[]> {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
    
    const orderResponses: OrderResponse[] = [];
    for (const order of userOrders) {
      const items = await db.select({
        orderItem: orderItems,
        product: products,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id));
      
      orderResponses.push({
        ...order,
        items: items.map(i => ({ ...i.orderItem, product: i.product }))
      });
    }
    
    return orderResponses;
  }

  async getOrder(id: number): Promise<OrderResponse | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db.select({
      orderItem: orderItems,
      product: products,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id));

    return {
      ...order,
      items: items.map(i => ({ ...i.orderItem, product: i.product }))
    };
  }

  async createOrder(userId: string, orderData: CreateOrderRequest): Promise<Order> {
    // Calculate total amount
    let totalAmount = 0;
    for (const item of orderData.items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        totalAmount += Number(product.price) * item.quantity;
      }
    }

    const [newOrder] = await db.insert(orders).values({
      userId,
      deliveryAddress: orderData.address,
      deliveryTimeSlot: orderData.timeSlot,
      totalAmount: totalAmount.toString(),
      status: 'received',
      paymentStatus: 'pending'
    }).returning();

    for (const item of orderData.items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        await db.insert(orderItems).values({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }
    }

    return newOrder;
  }

  async getAddresses(userId: string): Promise<Address[]> {
    return await db.select().from(addresses).where(eq(addresses.userId, userId));
  }

  async createAddress(userId: string, address: InsertAddress): Promise<Address> {
    const [newAddress] = await db.insert(addresses).values({
      ...address,
      userId
    }).returning();
    return newAddress;
  }
}

class MemoryStorage implements IStorage {
  async getProducts(): Promise<ProductResponse[]> {
    return [];
  }

  async getProduct(_id: number): Promise<ProductResponse | undefined> {
    return undefined;
  }

  async createProduct(_product: InsertProduct): Promise<Product> {
    throw new Error("Database is not configured.");
  }

  async getCategories(): Promise<Category[]> {
    return [];
  }

  async createCategory(_category: InsertCategory): Promise<Category> {
    throw new Error("Database is not configured.");
  }

  async getOrders(_userId: string): Promise<OrderResponse[]> {
    return [];
  }

  async getOrder(_id: number): Promise<OrderResponse | undefined> {
    return undefined;
  }

  async createOrder(_userId: string, _orderData: CreateOrderRequest): Promise<Order> {
    throw new Error("Database is not configured.");
  }

  async getAddresses(_userId: string): Promise<Address[]> {
    return [];
  }

  async createAddress(_userId: string, _address: InsertAddress): Promise<Address> {
    throw new Error("Database is not configured.");
  }
}

if (!hasDatabase) {
  console.warn("DATABASE_URL is not set. Starting server without database-backed routes.");
}

export const storage = hasDatabase && db ? new DatabaseStorage() : new MemoryStorage();
