import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  await setupAuth(app);
  registerAuthRoutes(app);

  // Products
  app.get(api.products.list.path, async (req, res) => {
    try {
      const queryParams = req.query as any;
      const products = await storage.getProducts(queryParams);
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.products.get.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Categories
  app.get(api.categories.list.path, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Orders
  app.get(api.orders.list.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.orders.get.path, isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const userId = req.user.claims.sub;
      if (order.userId !== userId) {
         return res.status(401).json({ message: "Unauthorized" });
      }
      
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.orders.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(userId, input);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Addresses
  app.get(api.addresses.list.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const addresses = await storage.getAddresses(userId);
      res.json(addresses);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.addresses.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.addresses.create.input.parse(req.body);
      const address = await storage.createAddress(userId, input);
      res.status(201).json(address);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Optional: Seed database endpoint for easy setup
  app.post('/api/seed', async (req, res) => {
    await seedDatabase();
    res.json({ message: "Database seeded" });
  });

  // Call it on startup for MVP
  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const categories = await storage.getCategories();
  if (categories.length > 0) return; // Already seeded

  console.log("Seeding database...");
  
  const c1 = await storage.createCategory({ name: "Breakfast", slug: "breakfast" });
  const c2 = await storage.createCategory({ name: "Healthy Bowls", slug: "healthy-bowls" });
  const c3 = await storage.createCategory({ name: "Dinner", slug: "dinner" });

  await storage.createProduct({
    name: "Babita's Signature Oatmeal",
    description: "Organic oats topped with fresh berries, chia seeds, and a drizzle of local honey.",
    price: "8.99",
    categoryId: c1.id,
    ingredients: ["Organic Oats", "Mixed Berries", "Chia Seeds", "Honey", "Almond Milk"],
    calories: 350,
    isOrganic: true,
    isVeg: true,
    isHighProtein: false,
    prepTimeMinutes: 10,
    isSpecial: true,
    imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500&h=500&fit=crop"
  });

  await storage.createProduct({
    name: "Quinoa Power Bowl",
    description: "Protein-packed quinoa with roasted sweet potatoes, avocado, and tahini dressing.",
    price: "12.50",
    categoryId: c2.id,
    ingredients: ["Quinoa", "Sweet Potato", "Avocado", "Tahini", "Kale"],
    calories: 420,
    isOrganic: true,
    isVeg: true,
    isGlutenFree: true,
    isHighProtein: true,
    prepTimeMinutes: 15,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop"
  });

  await storage.createProduct({
    name: "Farmhouse Chicken Stew",
    description: "Slow-cooked organic chicken with seasonal root vegetables in a rich broth.",
    price: "15.99",
    categoryId: c3.id,
    ingredients: ["Organic Chicken", "Carrots", "Potatoes", "Celery", "Herbs"],
    calories: 550,
    isOrganic: true,
    isVeg: false,
    isHighProtein: true,
    prepTimeMinutes: 30,
    isSpecial: true,
    imageUrl: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=500&h=500&fit=crop"
  });

  console.log("Database seeding completed.");
}
